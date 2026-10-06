'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundManager } from '@/lib/sound';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, Heart, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarioPlatformerProps {
  onBackToHub?: () => void;
}

export const MarioPlatformer: React.FC<MarioPlatformerProps> = ({ onBackToHub }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arena_sound_muted') === 'true';
    }
    return false;
  });
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_mario_highscore');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  // State refs for the 60fps animation loop
  const gameStateRef = useRef({
    score: 0,
    coins: 0,
    lives: 3,
    timeLeft: 300,
    isGameOver: false,
    isGameWon: false,
    isPaused: false,
    cameraX: 0,
    mario: {
      x: 60,
      y: 280,
      vx: 0,
      vy: 0,
      width: 24,
      height: 32,
      isGrounded: false,
      isJumping: false,
      facingRight: true,
      invulnerable: 0,
      isBig: false,
    },
    keys: {
      left: false,
      right: false,
      jump: false,
    },
    blocks: [] as Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      type: 'ground' | 'brick' | 'question' | 'pipe' | 'empty';
      hasCoin?: boolean;
      hasMushroom?: boolean;
      bumpY?: number;
    }>,
    enemies: [] as Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      isSquashed: boolean;
      squashTimer: number;
    }>,
    floatingCoins: [] as Array<{
      x: number;
      y: number;
      collected: boolean;
    }>,
    particles: [] as Array<{
      x: number;
      y: number;
      text: string;
      life: number;
      vy: number;
      color: string;
    }>,
    flagPole: {
      x: 2350,
      y: 80,
      w: 8,
      h: 240,
      flagY: 90,
      reached: false,
    },
    castle: {
      x: 2480,
      y: 180,
      w: 120,
      h: 140,
    },
    levelWidth: 2700,
  });

  // Stable check and update high score using functional state updater
  const checkHighScore = useCallback((finalScore: number) => {
    setHighScore((prev) => {
      if (finalScore > prev) {
        try {
          localStorage.setItem('arena_mario_highscore', String(finalScore));
        } catch {
          // Ignore
        }
        return finalScore;
      }
      return prev;
    });
  }, []);

  // Setup level geometry in game state ref
  const setupLevelGeometry = useCallback(() => {
    const s = gameStateRef.current;
    s.score = 0;
    s.coins = 0;
    s.lives = 3;
    s.timeLeft = 300;
    s.isGameOver = false;
    s.isGameWon = false;
    s.isPaused = false;
    s.cameraX = 0;

    s.mario = {
      x: 60,
      y: 280,
      vx: 0,
      vy: 0,
      width: 24,
      height: 32,
      isGrounded: false,
      isJumping: false,
      facingRight: true,
      invulnerable: 0,
      isBig: false,
    };

    s.flagPole = {
      x: 2350,
      y: 80,
      w: 8,
      h: 240,
      flagY: 90,
      reached: false,
    };

    // Ground segments (with small pits for classic platforming)
    const blocks: typeof s.blocks = [];
    const groundSegments = [
      { start: 0, end: 700 },
      { start: 760, end: 1250 },
      { start: 1320, end: 1850 },
      { start: 1920, end: 2700 },
    ];

    groundSegments.forEach((seg) => {
      // Ground tile row at y: 320 to 400
      blocks.push({
        x: seg.start,
        y: 320,
        w: seg.end - seg.start,
        h: 80,
        type: 'ground',
      });
    });

    // Green Warp Pipes
    const pipes = [
      { x: 300, y: 260, w: 42, h: 60 },
      { x: 550, y: 240, w: 42, h: 80 },
      { x: 920, y: 250, w: 42, h: 70 },
      { x: 1550, y: 240, w: 42, h: 80 },
      { x: 2100, y: 260, w: 42, h: 60 },
    ];
    pipes.forEach((p) => {
      blocks.push({
        x: p.x,
        y: p.y,
        w: p.w,
        h: p.h,
        type: 'pipe',
      });
    });

    // ? Blocks and Brick Blocks
    const qBlocks = [
      { x: 180, y: 210, hasCoin: true },
      { x: 230, y: 210, hasCoin: false, type: 'brick' as const },
      { x: 260, y: 210, hasCoin: true },
      { x: 290, y: 210, hasCoin: false, type: 'brick' as const },
      { x: 260, y: 130, hasCoin: true }, // higher ? block

      // Mid area cluster
      { x: 640, y: 210, hasCoin: true },
      { x: 670, y: 210, hasCoin: false, type: 'brick' as const },
      { x: 700, y: 210, hasCoin: true },

      // High challenge blocks
      { x: 1050, y: 200, hasCoin: true },
      { x: 1080, y: 200, hasCoin: true },
      { x: 1110, y: 200, hasCoin: true },

      { x: 1420, y: 210, hasCoin: true },
      { x: 1450, y: 210, hasCoin: false, type: 'brick' as const },
      { x: 1480, y: 210, hasCoin: true },
      { x: 1680, y: 190, hasCoin: true },
      { x: 1710, y: 190, hasCoin: true },
    ];

    qBlocks.forEach((qb) => {
      blocks.push({
        x: qb.x,
        y: qb.y,
        w: 28,
        h: 28,
        type: qb.type || 'question',
        hasCoin: qb.hasCoin,
        bumpY: 0,
      });
    });

    s.blocks = blocks;

    // Goombas
    s.enemies = [
      { x: 420, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 480, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 820, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 1000, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 1180, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 1400, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 1620, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 1780, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 2020, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
      { x: 2200, y: 292, w: 26, h: 28, vx: -1, isSquashed: false, squashTimer: 0 },
    ];

    // Floating Coins in the sky
    s.floatingCoins = [
      { x: 230, y: 170, collected: false },
      { x: 290, y: 170, collected: false },
      { x: 380, y: 240, collected: false },
      { x: 400, y: 240, collected: false },
      { x: 670, y: 160, collected: false },
      { x: 960, y: 210, collected: false },
      { x: 1220, y: 230, collected: false },
      { x: 1360, y: 210, collected: false },
      { x: 1740, y: 150, collected: false },
      { x: 2150, y: 220, collected: false },
    ];

    s.particles = [];
  }, []);

  // Full restart called by user action buttons
  const restartGame = useCallback(() => {
    setupLevelGeometry();
    setScore(0);
    setCoins(0);
    setLives(3);
    setTimeLeft(300);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPaused(false);
  }, [setupLevelGeometry]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!keys.jump) {
          keys.jump = true;
          const m = gameStateRef.current.mario;
          if (m.isGrounded && !gameStateRef.current.isGameOver && !gameStateRef.current.isGameWon) {
            m.vy = -12.5;
            m.isGrounded = false;
            m.isJumping = true;
            soundManager.playMarioJump();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') keys.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const s = gameStateRef.current;
      if (!s.isGameOver && !s.isGameWon && !s.isPaused) {
        s.timeLeft = Math.max(0, s.timeLeft - 1);
        setTimeLeft(s.timeLeft);
        if (s.timeLeft === 0) {
          s.lives = 0;
          s.isGameOver = true;
          setIsGameOver(true);
          soundManager.playMarioDie();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    setupLevelGeometry();

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.58;
    const friction = 0.82;
    const moveSpeed = 3.6;

    const gameLoop = () => {
      const s = gameStateRef.current;

      if (!s.isPaused && !s.isGameOver) {
        // --- 1. Mario Physics & Controls ---
        const m = s.mario;

        if (m.invulnerable > 0) {
          m.invulnerable--;
        }

        // Horizontal movement
        if (s.keys.left) {
          m.vx = -moveSpeed;
          m.facingRight = false;
        } else if (s.keys.right) {
          m.vx = moveSpeed;
          m.facingRight = true;
        } else {
          m.vx *= friction;
          if (Math.abs(m.vx) < 0.1) m.vx = 0;
        }

        // Apply gravity
        m.vy += gravity;
        if (m.vy > 13) m.vy = 13;

        // Proposed positions
        const nextX = m.x + m.vx;
        const nextY = m.y + m.vy;

        // Screen boundary left
        if (nextX < s.cameraX) {
          m.x = s.cameraX;
          m.vx = 0;
        } else {
          m.x = nextX;
        }

        // Horizontal Collision with Blocks
        s.blocks.forEach((b) => {
          if (
            m.x < b.x + b.w &&
            m.x + m.width > b.x &&
            m.y < b.y + b.h &&
            m.y + m.height > b.y
          ) {
            if (m.vx > 0) {
              m.x = b.x - m.width;
              m.vx = 0;
            } else if (m.vx < 0) {
              m.x = b.x + b.w;
              m.vx = 0;
            }
          }
        });

        // Vertical movement
        m.y = nextY;
        m.isGrounded = false;

        // Vertical Collision with Blocks
        s.blocks.forEach((b) => {
          if (
            m.x + 2 < b.x + b.w &&
            m.x + m.width - 2 > b.x &&
            m.y < b.y + b.h &&
            m.y + m.height > b.y
          ) {
            // Falling on top of block
            if (m.vy > 0 && m.y + m.height - m.vy <= b.y + 12) {
              m.y = b.y - m.height;
              m.vy = 0;
              m.isGrounded = true;
              m.isJumping = false;
            }
            // Hitting block from below
            else if (m.vy < 0 && m.y - m.vy >= b.y + b.h - 12) {
              m.y = b.y + b.h;
              m.vy = 1;

              // Hit ? Block or Brick
              if (b.type === 'question') {
                b.type = 'empty';
                b.bumpY = -8;
                s.score += 200;
                s.coins += 1;
                setScore(s.score);
                setCoins(s.coins);
                soundManager.playMarioCoin();

                s.particles.push({
                  x: b.x + b.w / 2,
                  y: b.y - 12,
                  text: '🪙 +200',
                  life: 30,
                  vy: -2,
                  color: '#fbbf24',
                });
              } else if (b.type === 'brick') {
                b.bumpY = -4;
                s.score += 50;
                setScore(s.score);
                soundManager.playMarioStomp();
              }
            }
          }

          // Return bump animation
          if (b.bumpY && b.bumpY < 0) {
            b.bumpY += 1;
          }
        });

        // Check if Mario falls down a pit
        if (m.y > 420) {
          s.lives -= 1;
          setLives(s.lives);
          soundManager.playMarioDie();

          if (s.lives <= 0) {
            s.isGameOver = true;
            setIsGameOver(true);
            checkHighScore(s.score);
          } else {
            // Respawn at last safe checkpoint
            m.x = Math.max(40, s.cameraX + 50);
            m.y = 150;
            m.vx = 0;
            m.vy = 0;
            m.invulnerable = 60;
          }
        }

        // Camera Follow
        const targetCamX = m.x - 220;
        if (targetCamX > s.cameraX) {
          s.cameraX = Math.min(targetCamX, s.levelWidth - canvas.width);
        }

        // --- 2. Floating Coins Collection ---
        s.floatingCoins.forEach((c) => {
          if (!c.collected) {
            if (
              m.x < c.x + 16 &&
              m.x + m.width > c.x &&
              m.y < c.y + 16 &&
              m.y + m.height > c.y
            ) {
              c.collected = true;
              s.coins += 1;
              s.score += 100;
              setCoins(s.coins);
              setScore(s.score);
              soundManager.playMarioCoin();

              s.particles.push({
                x: c.x,
                y: c.y,
                text: '+100',
                life: 25,
                vy: -2,
                color: '#fbbf24',
              });
            }
          }
        });

        // --- 3. Enemies Logic ---
        s.enemies.forEach((enemy) => {
          if (enemy.isSquashed) {
            enemy.squashTimer--;
            return;
          }

          // Only move when near screen
          if (enemy.x - s.cameraX < canvas.width + 100 && enemy.x - s.cameraX > -100) {
            enemy.x += enemy.vx;

            // Turn around on pipe/block edges
            s.blocks.forEach((b) => {
              if (
                enemy.x < b.x + b.w &&
                enemy.x + enemy.w > b.x &&
                enemy.y < b.y + b.h &&
                enemy.y + enemy.h > b.y
              ) {
                enemy.vx *= -1;
              }
            });

            // Collision with Mario
            if (
              m.x < enemy.x + enemy.w &&
              m.x + m.width > enemy.x &&
              m.y < enemy.y + enemy.h &&
              m.y + m.height > enemy.y
            ) {
              // Mario stomps Goomba from above
              if (m.vy > 0 && m.y + m.height - m.vy <= enemy.y + 12) {
                enemy.isSquashed = true;
                enemy.squashTimer = 30;
                m.vy = -9.5; // bounce up
                s.score += 200;
                setScore(s.score);
                soundManager.playMarioStomp();

                s.particles.push({
                  x: enemy.x + enemy.w / 2,
                  y: enemy.y - 10,
                  text: '💥 +200',
                  life: 25,
                  vy: -1.8,
                  color: '#f97316',
                });
              } else if (m.invulnerable <= 0) {
                // Mario takes damage
                s.lives -= 1;
                setLives(s.lives);
                soundManager.playMarioDie();

                if (s.lives <= 0) {
                  s.isGameOver = true;
                  setIsGameOver(true);
                  checkHighScore(s.score);
                } else {
                  m.invulnerable = 90;
                  m.vy = -8;
                  m.vx = m.facingRight ? -4 : 4;
                }
              }
            }
          }
        });

        // --- 4. Flagpole Victory Check ---
        const fp = s.flagPole;
        if (!fp.reached && m.x + m.width >= fp.x && m.x <= fp.x + fp.w + 10) {
          fp.reached = true;
          s.isGameWon = true;
          setIsGameWon(true);
          const bonus = Math.max(500, Math.floor(s.timeLeft * 10));
          s.score += bonus;
          setScore(s.score);
          checkHighScore(s.score);
          soundManager.playMarioLevelClear();

          s.particles.push({
            x: fp.x,
            y: 120,
            text: `🚩 VITÓRIA! +${bonus}`,
            life: 60,
            vy: -1,
            color: '#10b981',
          });
        }

        // Flag sliding down animation
        if (fp.reached && fp.flagY < fp.y + fp.h - 30) {
          fp.flagY += 3.5;
        }

        // --- 5. Particles Update ---
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) {
            s.particles.splice(i, 1);
          }
        }
      }

      // --- RENDERING ON CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#5c94fc'); // classic Mario NES sky blue
      skyGrad.addColorStop(1, '#92b6fc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-s.cameraX, 0);

      // Clouds in the background (parallax)
      for (let cx = 80; cx < s.levelWidth; cx += 320) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(cx, 70, 22, 0, Math.PI * 2);
        ctx.arc(cx + 25, 60, 28, 0, Math.PI * 2);
        ctx.arc(cx + 50, 70, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hills in the background
      for (let hx = 60; hx < s.levelWidth; hx += 420) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(hx, 320, 70, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw Blocks
      s.blocks.forEach((b) => {
        const by = b.y + (b.bumpY || 0);

        if (b.type === 'ground') {
          // Brick/Dirt ground
          ctx.fillStyle = '#c84c0c';
          ctx.fillRect(b.x, by, b.w, b.h);

          // Grass top edge
          ctx.fillStyle = '#00a800';
          ctx.fillRect(b.x, by, b.w, 8);

          // Brick pattern lines
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 1;
          for (let gx = b.x; gx < b.x + b.w; gx += 32) {
            ctx.strokeRect(gx, by, 32, b.h);
          }
        } else if (b.type === 'question') {
          // Animated ? Block
          const pulse = Math.sin(Date.now() / 150) * 2;
          ctx.fillStyle = '#fc9838';
          ctx.fillRect(b.x, by, b.w, b.h);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, by, b.w, b.h);

          // Shimmer border
          ctx.fillStyle = '#ffe090';
          ctx.fillRect(b.x + 2, by + 2, b.w - 4, 3);
          ctx.fillRect(b.x + 2, by + 2, 3, b.h - 4);

          // '?' text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', b.x + b.w / 2, by + b.h / 2 + pulse * 0.3);
        } else if (b.type === 'empty') {
          // Hit/Used Block
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(b.x, by, b.w, b.h);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, by, b.w, b.h);
        } else if (b.type === 'brick') {
          // Destructible / solid Brick Block
          ctx.fillStyle = '#b84418';
          ctx.fillRect(b.x, by, b.w, b.h);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, by, b.w, b.h);
          // Brick seams
          ctx.fillStyle = '#000000';
          ctx.fillRect(b.x, by + 13, b.w, 2);
          ctx.fillRect(b.x + 13, by, 2, 13);
          ctx.fillRect(b.x + 6, by + 14, 2, 14);
          ctx.fillRect(b.x + 20, by + 14, 2, 14);
        } else if (b.type === 'pipe') {
          // Green Pipe
          ctx.fillStyle = '#00a800';
          ctx.fillRect(b.x, by, b.w, b.h);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, by, b.w, b.h);

          // Pipe Lip (top)
          ctx.fillStyle = '#00c800';
          ctx.fillRect(b.x - 3, by, b.w + 6, 16);
          ctx.strokeRect(b.x - 3, by, b.w + 6, 16);

          // Pipe highlight
          ctx.fillStyle = '#80e880';
          ctx.fillRect(b.x + 5, by + 16, 6, b.h - 16);
        }
      });

      // Draw Floating Coins
      s.floatingCoins.forEach((c) => {
        if (!c.collected) {
          const wobble = Math.sin(Date.now() / 120 + c.x) * 3;
          ctx.fillStyle = '#fcbc00';
          ctx.beginPath();
          ctx.ellipse(c.x + 8, c.y + 8, 7 + wobble * 0.4, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#a06000';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Sparkle
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(c.x + 6, c.y + 5, 2, 4);
        }
      });

      // Draw Enemies (Goombas)
      s.enemies.forEach((enemy) => {
        if (enemy.isSquashed) {
          // Squashed Goomba
          ctx.fillStyle = '#883c00';
          ctx.fillRect(enemy.x, enemy.y + 18, enemy.w, 10);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(enemy.x + 4, enemy.y + 20, 4, 3);
          ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + 20, 4, 3);
        } else {
          // Goomba Body
          ctx.fillStyle = '#a84c00';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + 12, 13, Math.PI, 0);
          ctx.lineTo(enemy.x + enemy.w, enemy.y + 20);
          ctx.lineTo(enemy.x, enemy.y + 20);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Face
          ctx.fillStyle = '#fcbc70';
          ctx.fillRect(enemy.x + 4, enemy.y + 12, enemy.w - 8, 12);

          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(enemy.x + 6, enemy.y + 13, 4, 6);
          ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + 13, 4, 6);
          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x + 8, enemy.y + 15, 2, 4);
          ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + 15, 2, 4);

          // Feet (animated walk)
          const step = Math.floor(Date.now() / 150) % 2 === 0;
          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x + (step ? 0 : 2), enemy.y + 22, 9, 6);
          ctx.fillRect(enemy.x + enemy.w - (step ? 9 : 11), enemy.y + 22, 9, 6);
        }
      });

      // Draw Flagpole & Castle
      const fp = s.flagPole;
      // Pole
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fp.x, fp.y, fp.w, fp.h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(fp.x, fp.y, fp.w, fp.h);

      // Gold ball on top of flagpole
      ctx.fillStyle = '#fcbc00';
      ctx.beginPath();
      ctx.arc(fp.x + fp.w / 2, fp.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Green Flag
      ctx.fillStyle = '#00a800';
      ctx.beginPath();
      ctx.moveTo(fp.x - 28, fp.flagY + 12);
      ctx.lineTo(fp.x, fp.flagY);
      ctx.lineTo(fp.x, fp.flagY + 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Castle
      const cst = s.castle;
      ctx.fillStyle = '#00a800';
      ctx.fillRect(cst.x, cst.y, cst.w, cst.h);
      ctx.fillStyle = '#006000';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(cst.x + i * 32, cst.y - 14, 20, 14);
      }
      // Castle door
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cst.x + cst.w / 2, cst.y + cst.h - 40, 20, Math.PI, 0);
      ctx.fillRect(cst.x + cst.w / 2 - 20, cst.y + cst.h - 40, 40, 40);
      ctx.fill();

      // Draw Mario Sprite
      const m = s.mario;
      const isBlinking = m.invulnerable > 0 && Math.floor(m.invulnerable / 4) % 2 === 0;

      if (!isBlinking) {
        ctx.save();
        ctx.translate(m.x + m.width / 2, m.y + m.height / 2);
        if (!m.facingRight) ctx.scale(-1, 1);

        const hw = m.width / 2;
        const hh = m.height / 2;

        // Red Hat & Brim
        ctx.fillStyle = '#e52521';
        ctx.fillRect(-hw + 2, -hh, m.width - 2, 8);
        ctx.fillRect(0, -hh + 3, hw + 4, 5);

        // Face & Nose (Peach skin tone)
        ctx.fillStyle = '#fcc082';
        ctx.fillRect(-hw + 4, -hh + 8, m.width - 6, 10);
        ctx.fillRect(hw - 4, -hh + 8, 6, 6); // nose

        // Mustache & Hair (Dark Brown)
        ctx.fillStyle = '#4a2505';
        ctx.fillRect(-hw + 2, -hh + 5, 4, 8); // hair
        ctx.fillRect(0, -hh + 12, hw + 2, 4); // mustache

        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(2, -hh + 9, 3, 4);

        // Red Shirt
        ctx.fillStyle = '#e52521';
        ctx.fillRect(-hw + 2, -hh + 18, m.width - 4, 8);

        // Blue Overalls
        ctx.fillStyle = '#0025c8';
        ctx.fillRect(-hw + 4, -hh + 20, m.width - 8, 8);
        ctx.fillRect(-hw + 3, -hh + 26, 7, 6);
        ctx.fillRect(hw - 10, -hh + 26, 7, 6);

        // Yellow Buttons on overalls
        ctx.fillStyle = '#fceb00';
        ctx.fillRect(-2, -hh + 21, 3, 3);

        // Brown Shoes
        ctx.fillStyle = '#6b360b';
        ctx.fillRect(-hw + 1, -hh + 30, 9, 4);
        ctx.fillRect(hw - 8, -hh + 30, 9, 4);

        ctx.restore();
      }

      // Draw Floating Text Particles
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [setupLevelGeometry, checkHighScore]);

  // Touch control handlers for mobile
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    const s = gameStateRef.current;
    if (action === 'left') s.keys.left = true;
    if (action === 'right') s.keys.right = true;
    if (action === 'jump') {
      s.keys.jump = true;
      const m = s.mario;
      if (m.isGrounded && !s.isGameOver && !s.isGameWon) {
        m.vy = -12.5;
        m.isGrounded = false;
        m.isJumping = true;
        soundManager.playMarioJump();
      }
    }
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump') => {
    const s = gameStateRef.current;
    if (action === 'left') s.keys.left = false;
    if (action === 'right') s.keys.right = false;
    if (action === 'jump') s.keys.jump = false;
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleTogglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    gameStateRef.current.isPaused = next;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Arcade HUD Stats */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-3 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-center">
          {/* Mario Score */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 sm:p-2.5">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-400">
              MARIO
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-white tracking-widest">
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Coins */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">
              MOEDAS
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-amber-300 flex items-center space-x-1">
              <span>🪙</span>
              <span>x{coins.toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Lives */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-400">
              VIDAS
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-rose-400 flex items-center space-x-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>x{lives}</span>
            </div>
          </div>

          {/* Time Left */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400">
              TEMPO
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-white">
              {timeLeft.toString().padStart(3, '0')}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-2 bg-slate-950/70 border border-slate-800 rounded-xl p-1.5">
            <button
              onClick={handleTogglePause}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isPaused ? 'Continuar' : 'Pausar'}
              id="mario-btn-pause"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isMuted ? 'Ativar Sons 8-bit' : 'Silenciar'}
              id="mario-btn-sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={restartGame}
              className="p-2 rounded-lg bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 transition-colors"
              title="Reiniciar Fase"
              id="mario-btn-restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full max-w-4xl bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto block select-none aspect-[2/1] bg-[#5c94fc]"
          id="mario-canvas"
        />

        {/* Game Over Screen Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <div className="text-4xl sm:text-5xl font-black text-rose-500 mb-2 tracking-wider">
                GAME OVER
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Suas vidas acabaram! Pontuação Final: <strong className="text-amber-400 font-mono">{score}</strong>
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition-all flex items-center space-x-2"
                id="btn-mario-retry"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Tentar Novamente</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Screen Overlay */}
        <AnimatePresence>
          {isGameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 mb-1">
                FASE CONCLUÍDA!
              </div>
              <p className="text-slate-300 text-sm mb-5">
                Você alcançou a bandeira do Castelo! Pontuação total:{' '}
                <strong className="text-amber-400 font-mono text-base">{score} pts</strong>
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2"
                id="btn-mario-play-again"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Jogar Mais Uma Vez</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Touch & On-screen Controller for Mobile / Touch screens */}
      <div className="w-full max-w-4xl mt-3 flex items-center justify-between px-2 sm:px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-2xl">
        {/* D-Pad Left / Right */}
        <div className="flex items-center space-x-3">
          <button
            onPointerDown={() => handleTouchStart('left')}
            onPointerUp={() => handleTouchEnd('left')}
            onPointerLeave={() => handleTouchEnd('left')}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center shadow-md select-none touch-none"
            aria-label="Mover para esquerda"
            id="touch-left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => handleTouchStart('right')}
            onPointerUp={() => handleTouchEnd('right')}
            onPointerLeave={() => handleTouchEnd('right')}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center shadow-md select-none touch-none"
            aria-label="Mover para direita"
            id="touch-right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Keyboard instructions badge */}
        <div className="hidden sm:flex flex-col items-center text-[11px] text-slate-400">
          <span>Teclado: <strong>Setas / A & D</strong> para mover</span>
          <span><strong>Barra de Espaço / W</strong> para pular</span>
        </div>

        {/* Big Jump Button */}
        <div>
          <button
            onPointerDown={() => handleTouchStart('jump')}
            onPointerUp={() => handleTouchEnd('jump')}
            onPointerLeave={() => handleTouchEnd('jump')}
            className="px-6 sm:px-8 h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 active:from-red-700 active:to-rose-700 text-white font-black text-sm sm:text-base border border-red-500/50 flex items-center space-x-2 shadow-lg shadow-red-600/30 select-none touch-none"
            id="touch-jump"
          >
            <ArrowUp className="w-5 h-5 stroke-[3]" />
            <span>PULAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
