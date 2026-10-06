'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Shield,
  Heart,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '@/lib/sound';

interface TarzanGameState {
  tarzan: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    isGrounded: boolean;
    isJumping: boolean;
    facingRight: boolean;
    invulnerable: number;
    // Vine swinging state
    isSwinging: boolean;
    currentVineIndex: number | null;
    vineGrabDistance: number; // distance down the vine
    swingVelocity: number;
    runFrame: number;
    yellTimer: number;
  };
  keys: {
    left: boolean;
    right: boolean;
    jump: boolean;
    throw: boolean;
    yell: boolean;
  };
  cameraX: number;
  score: number;
  bananas: number;
  coconuts: number;
  lives: number;
  isGameOver: boolean;
  isGameWon: boolean;
  isPaused: boolean;
  levelWidth: number;
  // Level entities
  platforms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'branch' | 'bridge' | 'ruin' | 'water';
  }>;
  vines: Array<{
    anchorX: number;
    anchorY: number;
    length: number;
    angle: number; // radians
    angularVelocity: number;
    baseAngle: number;
    amplitude: number;
    speed: number;
  }>;
  enemies: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    minX: number;
    maxX: number;
    type: 'jaguar' | 'croc' | 'snake';
    isDefeated: boolean;
    defeatTimer: number;
  }>;
  collectibles: Array<{
    x: number;
    y: number;
    type: 'banana' | 'coconut' | 'idol';
    collected: boolean;
    bobOffset: number;
  }>;
  coconutsInAir: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  }>;
  particles: Array<{
    x: number;
    y: number;
    text: string;
    life: number;
    vy: number;
    color: string;
  }>;
  waterfalls: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  goalTemple: {
    x: number;
    y: number;
    w: number;
    h: number;
    reached: boolean;
  };
}

export const TarzanGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React State for HUD & Overlay
  const [score, setScore] = useState(0);
  const [bananas, setBananas] = useState(0);
  const [coconuts, setCoconuts] = useState(5);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_tarzan_highscore');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [distancePercent, setDistancePercent] = useState(0);

  // Stable high score checker
  const checkHighScore = useCallback((finalScore: number) => {
    setHighScore((prev) => {
      if (finalScore > prev) {
        try {
          localStorage.setItem('arena_tarzan_highscore', String(finalScore));
        } catch {
          // Ignore
        }
        return finalScore;
      }
      return prev;
    });
  }, []);

  // Main game state in Ref to decouple 60 FPS physics from React renders
  const gameStateRef = useRef<TarzanGameState>({
    tarzan: {
      x: 80,
      y: 260,
      vx: 0,
      vy: 0,
      width: 32,
      height: 48,
      isGrounded: false,
      isJumping: false,
      facingRight: true,
      invulnerable: 0,
      isSwinging: false,
      currentVineIndex: null,
      vineGrabDistance: 180,
      swingVelocity: 0,
      runFrame: 0,
      yellTimer: 0,
    },
    keys: {
      left: false,
      right: false,
      jump: false,
      throw: false,
      yell: false,
    },
    cameraX: 0,
    score: 0,
    bananas: 0,
    coconuts: 5,
    lives: 3,
    isGameOver: false,
    isGameWon: false,
    isPaused: false,
    levelWidth: 3200,
    platforms: [],
    vines: [],
    enemies: [],
    collectibles: [],
    coconutsInAir: [],
    particles: [],
    waterfalls: [],
    goalTemple: {
      x: 3000,
      y: 140,
      w: 160,
      h: 220,
      reached: false,
    },
  });

  // Setup level geometry, vines, platforms and wildlife
  const setupLevel = useCallback(() => {
    const s = gameStateRef.current;
    s.score = 0;
    s.bananas = 0;
    s.coconuts = 5;
    s.lives = 3;
    s.isGameOver = false;
    s.isGameWon = false;
    s.isPaused = false;
    s.cameraX = 0;

    s.tarzan = {
      x: 80,
      y: 260,
      vx: 0,
      vy: 0,
      width: 32,
      height: 48,
      isGrounded: false,
      isJumping: false,
      facingRight: true,
      invulnerable: 0,
      isSwinging: false,
      currentVineIndex: null,
      vineGrabDistance: 170,
      swingVelocity: 0,
      runFrame: 0,
      yellTimer: 0,
    };

    // Platforms: giant branches, suspension bridges, stone ruins, and crocodile waters
    s.platforms = [
      // Starting branch (Zone 1: Canopy Entrance)
      { x: 0, y: 320, w: 320, h: 80, type: 'branch' },
      { x: 420, y: 310, w: 260, h: 60, type: 'branch' },
      { x: 780, y: 280, w: 220, h: 50, type: 'bridge' },
      
      // Giant River Gap (Swinging vines required)
      { x: 1000, y: 370, w: 450, h: 50, type: 'water' }, // Croc infested water below
      { x: 1090, y: 260, w: 90, h: 30, type: 'branch' }, // High branch island

      // Zone 2: Waterfall Rapids & Hanging Boughs
      { x: 1450, y: 320, w: 300, h: 70, type: 'branch' },
      { x: 1850, y: 290, w: 240, h: 50, type: 'bridge' },
      { x: 2090, y: 370, w: 350, h: 50, type: 'water' }, // Dangerous chasm

      // Zone 3: Ancient Lost Temple Ruins
      { x: 2440, y: 300, w: 280, h: 70, type: 'ruin' },
      { x: 2800, y: 270, w: 180, h: 60, type: 'ruin' },
      { x: 2980, y: 330, w: 240, h: 80, type: 'ruin' }, // Final Temple Summit
    ];

    // Hanging Swinging Vines (Cipós da Selva)
    s.vines = [
      // Vine 1: First leap across the canopy
      {
        anchorX: 370,
        anchorY: 40,
        length: 220,
        angle: 0.35,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.5,
        speed: 0.035,
      },
      // Vine 2: Second jump to bridge
      {
        anchorX: 730,
        anchorY: 30,
        length: 210,
        angle: -0.4,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.52,
        speed: 0.038,
      },
      // Vine 3 & 4: Deep River chasm chain
      {
        anchorX: 1180,
        anchorY: 40,
        length: 230,
        angle: 0.45,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.55,
        speed: 0.036,
      },
      {
        anchorX: 1380,
        anchorY: 40,
        length: 230,
        angle: -0.45,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.55,
        speed: 0.036,
      },
      // Vine 5 & 6: Waterfall chasm
      {
        anchorX: 2180,
        anchorY: 30,
        length: 230,
        angle: 0.5,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.58,
        speed: 0.034,
      },
      {
        anchorX: 2380,
        anchorY: 30,
        length: 220,
        angle: -0.45,
        angularVelocity: 0,
        baseAngle: 0,
        amplitude: 0.52,
        speed: 0.036,
      },
    ];

    // Jungle Wildlife & Enemies
    s.enemies = [
      // Onça / Jaguar 1 on branch
      {
        x: 520,
        y: 284,
        w: 36,
        h: 24,
        vx: -1.2,
        minX: 430,
        maxX: 660,
        type: 'jaguar',
        isDefeated: false,
        defeatTimer: 0,
      },
      // Snapping Crocodile 1 in river
      {
        x: 1080,
        y: 356,
        w: 48,
        h: 22,
        vx: 0.8,
        minX: 1010,
        maxX: 1220,
        type: 'croc',
        isDefeated: false,
        defeatTimer: 0,
      },
      // Snapping Crocodile 2 in river
      {
        x: 1260,
        y: 356,
        w: 48,
        h: 22,
        vx: -0.8,
        minX: 1220,
        maxX: 1400,
        type: 'croc',
        isDefeated: false,
        defeatTimer: 0,
      },
      // Snake hanging on branch in zone 2
      {
        x: 1560,
        y: 298,
        w: 30,
        h: 20,
        vx: 0.6,
        minX: 1460,
        maxX: 1680,
        type: 'snake',
        isDefeated: false,
        defeatTimer: 0,
      },
      // Fierce Jaguar 2 on rope bridge
      {
        x: 1940,
        y: 264,
        w: 36,
        h: 24,
        vx: -1.5,
        minX: 1860,
        maxX: 2060,
        type: 'jaguar',
        isDefeated: false,
        defeatTimer: 0,
      },
      // Snake in temple ruins
      {
        x: 2550,
        y: 278,
        w: 30,
        h: 20,
        vx: 0.8,
        minX: 2450,
        maxX: 2680,
        type: 'snake',
        isDefeated: false,
        defeatTimer: 0,
      },
    ];

    // Collectibles (Bananas, Coconuts, Golden Idols)
    s.collectibles = [
      // Starting bananas
      { x: 140, y: 270, type: 'banana', collected: false, bobOffset: 0 },
      { x: 190, y: 270, type: 'banana', collected: false, bobOffset: 1 },
      { x: 240, y: 270, type: 'banana', collected: false, bobOffset: 2 },
      { x: 280, y: 270, type: 'coconut', collected: false, bobOffset: 3 },

      // In-flight swinging vine bananas
      { x: 370, y: 190, type: 'banana', collected: false, bobOffset: 0.5 },
      { x: 490, y: 230, type: 'banana', collected: false, bobOffset: 1.5 },
      { x: 620, y: 220, type: 'coconut', collected: false, bobOffset: 2.5 },
      { x: 730, y: 180, type: 'banana', collected: false, bobOffset: 0.8 },

      // High island rewards
      { x: 1100, y: 210, type: 'idol', collected: false, bobOffset: 0 },
      { x: 1140, y: 210, type: 'banana', collected: false, bobOffset: 1 },

      // River chasm flight path bananas
      { x: 1240, y: 210, type: 'banana', collected: false, bobOffset: 2 },
      { x: 1330, y: 210, type: 'banana', collected: false, bobOffset: 3 },
      { x: 1520, y: 260, type: 'coconut', collected: false, bobOffset: 0 },
      { x: 1650, y: 260, type: 'banana', collected: false, bobOffset: 1 },
      { x: 1720, y: 260, type: 'banana', collected: false, bobOffset: 2 },

      // Waterfall gap flight path
      { x: 2180, y: 190, type: 'banana', collected: false, bobOffset: 1.2 },
      { x: 2280, y: 180, type: 'banana', collected: false, bobOffset: 2.2 },
      { x: 2380, y: 190, type: 'banana', collected: false, bobOffset: 0.7 },

      // Temple approach
      { x: 2620, y: 240, type: 'coconut', collected: false, bobOffset: 1 },
      { x: 2720, y: 240, type: 'banana', collected: false, bobOffset: 2 },
      { x: 2850, y: 220, type: 'banana', collected: false, bobOffset: 3 },
      { x: 2920, y: 200, type: 'idol', collected: false, bobOffset: 0 },
    ];

    s.waterfalls = [
      { x: 1040, y: 0, w: 40, h: 370 },
      { x: 2140, y: 0, w: 55, h: 370 },
    ];

    s.goalTemple = {
      x: 3000,
      y: 130,
      w: 180,
      h: 220,
      reached: false,
    };

    s.coconutsInAir = [];
    s.particles = [];
  }, []);

  // Full Restart Game
  const restartGame = useCallback(() => {
    setupLevel();
    setScore(0);
    setBananas(0);
    setCoconuts(5);
    setLives(3);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPaused(false);
    setDistancePercent(0);
  }, [setupLevel]);

  // Throw Coconut Action
  const handleThrowCoconut = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    if (s.coconuts <= 0) return;

    s.coconuts -= 1;
    setCoconuts(s.coconuts);
    soundManager.playCoconutThrow();

    const t = s.tarzan;
    const throwVx = t.facingRight ? 8.5 : -8.5;
    s.coconutsInAir.push({
      x: t.x + (t.facingRight ? t.width + 4 : -4),
      y: t.y + 16,
      vx: throwVx,
      vy: -2,
      active: true,
    });
  }, []);

  // Tarzan Jungle Cry Action (Grito da Selva)
  const handleTarzanYell = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    if (s.tarzan.yellTimer > 0) return; // cooldown

    s.tarzan.yellTimer = 180; // 3 seconds cooldown
    soundManager.playTarzanYell();

    // Effect: Stuns all visible enemies and grants bonus score!
    s.enemies.forEach((enemy) => {
      const dist = Math.abs(enemy.x - s.tarzan.x);
      if (dist < 400 && !enemy.isDefeated) {
        enemy.isDefeated = true;
        enemy.defeatTimer = 90;
        s.score += 150;
        setScore(s.score);
        s.particles.push({
          x: enemy.x + enemy.w / 2,
          y: enemy.y - 12,
          text: '🦁 AFUGENTADO! +150',
          life: 40,
          vy: -1.5,
          color: '#34d399',
        });
      }
    });

    s.particles.push({
      x: s.tarzan.x + 16,
      y: s.tarzan.y - 20,
      text: '📢 AAAAUUUUAAAH!',
      life: 60,
      vy: -2,
      color: '#f59e0b',
    });
  }, []);

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
          const s = gameStateRef.current;
          const t = s.tarzan;

          // If on a vine, release and fling forward!
          if (t.isSwinging && t.currentVineIndex !== null) {
            const vine = s.vines[t.currentVineIndex];
            t.isSwinging = false;
            t.currentVineIndex = null;
            t.isJumping = true;

            // Compute tangential release velocity
            const tangentialSpeed = vine.angularVelocity * vine.length * 1.35;
            t.vx = Math.cos(vine.angle) * tangentialSpeed + (t.facingRight ? 4 : -4);
            t.vy = -Math.abs(Math.sin(vine.angle) * tangentialSpeed) - 8;

            soundManager.playTarzanVineRelease();

            s.particles.push({
              x: t.x,
              y: t.y,
              text: '🌿 SALTO!',
              life: 25,
              vy: -2,
              color: '#10b981',
            });
          }
          // Normal ground jump
          else if (t.isGrounded && !s.isGameOver && !s.isGameWon) {
            t.vy = -12.5;
            t.isGrounded = false;
            t.isJumping = true;
            soundManager.playTarzanJump();
          }
        }
      }
      // Coconut throw
      if (e.code === 'KeyX' || e.code === 'KeyJ') {
        handleThrowCoconut();
      }
      // Jungle Cry
      if (e.code === 'KeyZ' || e.code === 'KeyK') {
        handleTarzanYell();
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
  }, [handleThrowCoconut, handleTarzanYell]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    setupLevel();

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.55;
    const friction = 0.82;
    const runSpeed = 4.0;

    const gameLoop = () => {
      const s = gameStateRef.current;

      if (!s.isPaused && !s.isGameOver) {
        const t = s.tarzan;

        if (t.invulnerable > 0) t.invulnerable--;
        if (t.yellTimer > 0) t.yellTimer--;

        // Update swinging vines harmonic motion
        s.vines.forEach((vine, index) => {
          // If Tarzan is currently holding this vine, allow player to pump the swing
          if (t.isSwinging && t.currentVineIndex === index) {
            if (s.keys.right) {
              vine.angularVelocity += 0.003;
              t.facingRight = true;
            } else if (s.keys.left) {
              vine.angularVelocity -= 0.003;
              t.facingRight = false;
            }
          }

          // Pendulum restoring torque: theta'' = - (g / L) * sin(theta)
          const torque = -0.0016 * Math.sin(vine.angle);
          vine.angularVelocity += torque;
          vine.angularVelocity *= 0.994; // slight air resistance
          vine.angle += vine.angularVelocity;

          // Natural minimum swing oscillation when idle
          if (Math.abs(vine.angle) < 0.05 && Math.abs(vine.angularVelocity) < 0.001) {
            vine.angularVelocity = 0.015;
          }
        });

        // --- TARZAN MOVEMENT LOGIC ---
        if (t.isSwinging && t.currentVineIndex !== null) {
          // Tarzan attached to current vine tip
          const vine = s.vines[t.currentVineIndex];
          t.x = vine.anchorX + Math.sin(vine.angle) * t.vineGrabDistance - t.width / 2;
          t.y = vine.anchorY + Math.cos(vine.angle) * t.vineGrabDistance - t.height / 2;
          t.vx = 0;
          t.vy = 0;
        } else {
          // Normal horizontal movement
          if (s.keys.left) {
            t.vx = -runSpeed;
            t.facingRight = false;
            t.runFrame += 0.2;
          } else if (s.keys.right) {
            t.vx = runSpeed;
            t.facingRight = true;
            t.runFrame += 0.2;
          } else {
            t.vx *= friction;
            if (Math.abs(t.vx) < 0.1) t.vx = 0;
          }

          // Apply Gravity
          t.vy += gravity;
          if (t.vy > 14) t.vy = 14;

          const nextX = t.x + t.vx;
          const nextY = t.y + t.vy;

          // Camera left edge clamp
          if (nextX < s.cameraX) {
            t.x = s.cameraX;
            t.vx = 0;
          } else {
            t.x = nextX;
          }

          // Collision with solid platforms
          t.y = nextY;
          t.isGrounded = false;

          s.platforms.forEach((p) => {
            if (p.type === 'water') return; // water has no solid footing

            if (
              t.x + 4 < p.x + p.w &&
              t.x + t.width - 4 > p.x &&
              t.y < p.y + p.h &&
              t.y + t.height > p.y
            ) {
              // Landing on top of branch or ruin
              if (t.vy > 0 && t.y + t.height - t.vy <= p.y + 14) {
                t.y = p.y - t.height;
                t.vy = 0;
                t.isGrounded = true;
                t.isJumping = false;
              }
            }
          });

          // Check if Tarzan grabs a nearby vine in mid-air
          if (!t.isGrounded && !s.keys.jump) {
            s.vines.forEach((vine, vIdx) => {
              const vineTipX = vine.anchorX + Math.sin(vine.angle) * vine.length;
              const vineTipY = vine.anchorY + Math.cos(vine.angle) * vine.length;

              const dist = Math.hypot(
                t.x + t.width / 2 - vineTipX,
                t.y + t.height / 2 - vineTipY
              );

              // Grab tolerance
              if (dist < 46) {
                t.isSwinging = true;
                t.currentVineIndex = vIdx;
                t.vineGrabDistance = Math.min(vine.length - 10, Math.max(120, vine.length - 30));
                // Add boost to vine swing based on entry velocity
                vine.angularVelocity += (t.vx > 0 ? 0.025 : -0.025);
                soundManager.playTarzanVineGrab();

                s.particles.push({
                  x: vineTipX,
                  y: vineTipY,
                  text: '🌿 AGARROU!',
                  life: 25,
                  vy: -1.5,
                  color: '#34d399',
                });
              }
            });
          }
        }

        // River / Pit Fall Check (Water hazards or falling into abyss)
        if (t.y > 410) {
          s.lives -= 1;
          setLives(s.lives);
          soundManager.playTarzanDamage();

          if (s.lives <= 0) {
            s.isGameOver = true;
            setIsGameOver(true);
            checkHighScore(s.score);
          } else {
            // Respawn on previous branch
            t.x = Math.max(60, s.cameraX + 40);
            t.y = 200;
            t.vx = 0;
            t.vy = 0;
            t.isSwinging = false;
            t.currentVineIndex = null;
            t.invulnerable = 90;
          }
        }

        // Camera smoothly tracks Tarzan
        const targetCamX = t.x - 220;
        if (targetCamX > s.cameraX) {
          s.cameraX = Math.min(targetCamX, s.levelWidth - canvas.width);
        }

        // Update Distance HUD
        const currentDistPercent = Math.min(
          100,
          Math.max(0, Math.round((t.x / s.goalTemple.x) * 100))
        );
        setDistancePercent(currentDistPercent);

        // --- COCONUT PROJECTILE PHYSICS ---
        s.coconutsInAir.forEach((c) => {
          if (!c.active) return;
          c.x += c.vx;
          c.vy += 0.3; // gravity on coconut
          c.y += c.vy;

          // Check hit against platforms
          s.platforms.forEach((p) => {
            if (p.type === 'water') return;
            if (c.x > p.x && c.x < p.x + p.w && c.y > p.y && c.y < p.y + p.h) {
              c.active = false;
              soundManager.playCoconutHit();
            }
          });

          // Check hit against enemies
          s.enemies.forEach((enemy) => {
            if (
              !enemy.isDefeated &&
              c.x > enemy.x &&
              c.x < enemy.x + enemy.w &&
              c.y > enemy.y &&
              c.y < enemy.y + enemy.h
            ) {
              c.active = false;
              enemy.isDefeated = true;
              enemy.defeatTimer = 60;
              s.score += 200;
              setScore(s.score);
              soundManager.playCoconutHit();

              s.particles.push({
                x: enemy.x + enemy.w / 2,
                y: enemy.y - 12,
                text: '💥 ACERTOU! +200',
                life: 30,
                vy: -2,
                color: '#f59e0b',
              });
            }
          });

          // Offscreen despawn
          if (c.x < s.cameraX - 50 || c.x > s.cameraX + canvas.width + 50 || c.y > 450) {
            c.active = false;
          }
        });

        // --- WILDLIFE & ENEMIES LOGIC ---
        s.enemies.forEach((enemy) => {
          if (enemy.isDefeated) {
            enemy.defeatTimer--;
            return;
          }

          // Enemy patrol
          enemy.x += enemy.vx;
          if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.vx *= -1;
          }

          // Collision with Tarzan
          if (
            t.x < enemy.x + enemy.w &&
            t.x + t.width > enemy.x &&
            t.y < enemy.y + enemy.h &&
            t.y + t.height > enemy.y
          ) {
            // If Tarzan stomps enemy from above
            if (t.vy > 0 && t.y + t.height - t.vy <= enemy.y + 12) {
              enemy.isDefeated = true;
              enemy.defeatTimer = 60;
              t.vy = -10; // bounce
              s.score += 250;
              setScore(s.score);
              soundManager.playTarzanJump();

              s.particles.push({
                x: enemy.x + enemy.w / 2,
                y: enemy.y - 10,
                text: '🐾 +250',
                life: 30,
                vy: -2,
                color: '#34d399',
              });
            } else if (t.invulnerable <= 0) {
              // Tarzan takes damage
              s.lives -= 1;
              setLives(s.lives);
              soundManager.playTarzanDamage();
              soundManager.playJungleGrowl();

              if (s.lives <= 0) {
                s.isGameOver = true;
                setIsGameOver(true);
                checkHighScore(s.score);
              } else {
                t.invulnerable = 90;
                t.vy = -7;
                t.vx = t.facingRight ? -4 : 4;
              }
            }
          }
        });

        // --- COLLECTIBLES LOGIC ---
        s.collectibles.forEach((item) => {
          if (!item.collected) {
            if (
              t.x < item.x + 20 &&
              t.x + t.width > item.x &&
              t.y < item.y + 20 &&
              t.y + t.height > item.y
            ) {
              item.collected = true;

              if (item.type === 'banana') {
                s.bananas += 1;
                s.score += 100;
                setBananas(s.bananas);
                setScore(s.score);
                soundManager.playBananaCollect();

                s.particles.push({
                  x: item.x,
                  y: item.y,
                  text: '🍌 +100',
                  life: 25,
                  vy: -1.8,
                  color: '#facc15',
                });
              } else if (item.type === 'coconut') {
                s.coconuts += 3;
                s.score += 50;
                setCoconuts(s.coconuts);
                setScore(s.score);
                soundManager.playCoconutHit();

                s.particles.push({
                  x: item.x,
                  y: item.y,
                  text: '🥥 +3 COCOS',
                  life: 30,
                  vy: -1.8,
                  color: '#a16207',
                });
              } else if (item.type === 'idol') {
                s.score += 1000;
                setScore(s.score);
                soundManager.playTarzanVictory();

                s.particles.push({
                  x: item.x,
                  y: item.y,
                  text: '🗿 ÍDOLO DOURADO! +1000',
                  life: 50,
                  vy: -2,
                  color: '#fbbf24',
                });
              }
            }
          }
        });

        // --- GOAL TEMPLE VICTORY CHECK ---
        const temple = s.goalTemple;
        if (!temple.reached && t.x + t.width >= temple.x + 30) {
          temple.reached = true;
          s.isGameWon = true;
          setIsGameWon(true);
          const bonus = 2000 + s.bananas * 50;
          s.score += bonus;
          setScore(s.score);
          checkHighScore(s.score);
          soundManager.playTarzanVictory();

          s.particles.push({
            x: temple.x + 80,
            y: temple.y + 20,
            text: `🏛️ TEMPLO PERDIDO CONQUISTADO! +${bonus}`,
            life: 80,
            vy: -1.2,
            color: '#34d399',
          });
        }

        // Particles update
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) {
            s.particles.splice(i, 1);
          }
        }
      }

      // ==========================================
      // CANVAS RENDERING (Lush Rainforest Aesthetics)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. Background: Tropical Sky & Mountain Silhouettes ---
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#064e3b'); // deep emerald
      skyGradient.addColorStop(0.4, '#047857'); // jungle mist
      skyGradient.addColorStop(0.8, '#065f46');
      skyGradient.addColorStop(1, '#022c22');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Golden Tropical Sunbeams
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#fde047';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(100 + i * 140, 0);
        ctx.lineTo(160 + i * 140, 0);
        ctx.lineTo(320 + i * 160, canvas.height);
        ctx.lineTo(240 + i * 160, canvas.height);
        ctx.fill();
      }
      ctx.restore();

      // Distant Parallax Jungle Hills
      ctx.save();
      const p1 = (s.cameraX * 0.2) % 300;
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      for (let x = -p1; x < canvas.width + 100; x += 120) {
        ctx.arc(x, 260, 90, 0, Math.PI, true);
      }
      ctx.fill();
      ctx.restore();

      // Waterfalls in Background
      s.waterfalls.forEach((wf) => {
        const drawX = wf.x - s.cameraX;
        if (drawX > -100 && drawX < canvas.width + 100) {
          // Falling Water Column
          ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.fillRect(drawX, wf.y, wf.w, wf.h);
          // Rushing water lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.5;
          const timeOffset = (Date.now() / 40) % 20;
          for (let ly = timeOffset; ly < wf.h; ly += 18) {
            ctx.beginPath();
            ctx.moveTo(drawX + 6, ly);
            ctx.lineTo(drawX + wf.w - 6, ly + 6);
            ctx.stroke();
          }
          // Spray mist at the bottom
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(drawX + wf.w / 2, wf.h - 10, wf.w * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- WORLD TRANSLATION ---
      ctx.save();
      ctx.translate(-s.cameraX, 0);

      // --- 2. Platforms & Bridges ---
      s.platforms.forEach((p) => {
        if (p.x + p.w < s.cameraX - 100 || p.x > s.cameraX + canvas.width + 100) return;

        if (p.type === 'branch') {
          // Giant Ancient Mossy Branch
          ctx.fillStyle = '#451a03'; // deep wood
          ctx.fillRect(p.x, p.y, p.w, p.h);

          // Mossy top foliage
          ctx.fillStyle = '#15803d'; // lush moss
          ctx.fillRect(p.x, p.y, p.w, 10);
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(p.x, p.y, p.w, 3);

          // Hanging jungle vine tendrils
          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 2;
          for (let vx = p.x + 20; vx < p.x + p.w - 20; vx += 35) {
            ctx.beginPath();
            ctx.moveTo(vx, p.y + p.h);
            ctx.quadraticCurveTo(vx + 6, p.y + p.h + 15, vx - 4, p.y + p.h + 24);
            ctx.stroke();
          }
        } else if (p.type === 'bridge') {
          // Rope Suspension Bridge
          // Planks
          ctx.fillStyle = '#78350f';
          for (let bx = p.x; bx < p.x + p.w; bx += 14) {
            ctx.fillRect(bx, p.y + 6, 10, 12);
          }
          // Suspension Ropes
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 12);
          ctx.quadraticCurveTo(p.x + p.w / 2, p.y + 2, p.x + p.w, p.y - 12);
          ctx.stroke();
        } else if (p.type === 'ruin') {
          // Incan / Mayan Lost Temple Stone
          ctx.fillStyle = '#334155';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = '#15803d';
          ctx.fillRect(p.x, p.y, p.w, 6);

          // Carved glyph lines
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x + 8, p.y + 12, p.w - 16, p.h - 20);
        } else if (p.type === 'water') {
          // Crocodile River Rapids
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(p.x, p.y, p.w, 8);
        }
      });

      // --- 3. Hanging Swinging Vines (Cipós) ---
      s.vines.forEach((vine) => {
        // Anchor branch node
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(vine.anchorX, vine.anchorY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Vine curve coordinates
        const tipX = vine.anchorX + Math.sin(vine.angle) * vine.length;
        const tipY = vine.anchorY + Math.cos(vine.angle) * vine.length;

        // Draw thick organic vine
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(vine.anchorX, vine.anchorY);
        // Subtle natural sag
        const midX = (vine.anchorX + tipX) / 2 + Math.cos(vine.angle) * 8;
        const midY = (vine.anchorY + tipY) / 2;
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.stroke();

        // Vine leaves clinging
        ctx.fillStyle = '#22c55e';
        for (let tStep = 0.25; tStep < 0.9; tStep += 0.22) {
          const lx = vine.anchorX + (tipX - vine.anchorX) * tStep;
          const ly = vine.anchorY + (tipY - vine.anchorY) * tStep;
          ctx.beginPath();
          ctx.ellipse(lx + 4, ly, 6, 3, vine.angle + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vine end knot
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 4. Goal Temple (O Templo Perdido) ---
      const gt = s.goalTemple;
      // Stone stepped pyramid structure
      ctx.fillStyle = '#475569';
      ctx.fillRect(gt.x, gt.y + 60, gt.w, gt.h - 60);
      ctx.fillRect(gt.x + 20, gt.y + 20, gt.w - 40, 40);
      ctx.fillRect(gt.x + 45, gt.y - 15, gt.w - 90, 35);

      // Temple Entrance Archway
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(gt.x + gt.w / 2, gt.y + 110, 24, Math.PI, 0);
      ctx.lineTo(gt.x + gt.w / 2 + 24, gt.y + gt.h);
      ctx.lineTo(gt.x + gt.w / 2 - 24, gt.y + gt.h);
      ctx.fill();

      // Golden Ape / Jaguar Idol on Temple Summit
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(gt.x + gt.w / 2, gt.y - 30, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(gt.x + gt.w / 2, gt.y - 30, 8, 0, Math.PI * 2);
      ctx.fill();

      // Golden Glow around Idol
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.beginPath();
      ctx.arc(gt.x + gt.w / 2, gt.y - 30, 36, 0, Math.PI * 2);
      ctx.fill();

      // --- 5. Wildlife & Enemies ---
      s.enemies.forEach((enemy) => {
        if (enemy.defeatTimer > 0) {
          ctx.save();
          ctx.globalAlpha = enemy.defeatTimer / 60;
        }

        if (enemy.type === 'jaguar') {
          // Onça-Pintada (Golden body with spots)
          ctx.fillStyle = '#d97706';
          ctx.fillRect(enemy.x, enemy.y + 6, enemy.w, enemy.h - 6);
          // Head
          const headX = enemy.vx > 0 ? enemy.x + enemy.w - 6 : enemy.x - 4;
          ctx.fillRect(headX, enemy.y, 10, 12);
          // Glowing Eyes
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(headX + (enemy.vx > 0 ? 6 : 2), enemy.y + 3, 2, 2);
          // Spots
          ctx.fillStyle = '#78350f';
          ctx.fillRect(enemy.x + 8, enemy.y + 10, 4, 3);
          ctx.fillRect(enemy.x + 18, enemy.y + 12, 4, 3);
          ctx.fillRect(enemy.x + 28, enemy.y + 9, 3, 3);
          // Legs
          ctx.fillStyle = '#b45309';
          ctx.fillRect(enemy.x + 4, enemy.y + enemy.h - 4, 4, 6);
          ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + enemy.h - 4, 4, 6);
        } else if (enemy.type === 'croc') {
          // Snapping River Crocodile
          ctx.fillStyle = '#15803d';
          ctx.fillRect(enemy.x, enemy.y + 6, enemy.w, enemy.h - 6);
          // Scaled Ridges
          ctx.fillStyle = '#166534';
          for (let rx = enemy.x + 6; rx < enemy.x + enemy.w - 10; rx += 8) {
            ctx.beginPath();
            ctx.moveTo(rx, enemy.y + 6);
            ctx.lineTo(rx + 4, enemy.y);
            ctx.lineTo(rx + 8, enemy.y + 6);
            ctx.fill();
          }
          // Croc Jaws Snapping
          const snoutX = enemy.vx > 0 ? enemy.x + enemy.w : enemy.x - 8;
          ctx.fillStyle = '#14532d';
          ctx.fillRect(snoutX, enemy.y + 8, 10, 8);
          // Eye
          ctx.fillStyle = '#facc15';
          ctx.fillRect(snoutX + (enemy.vx > 0 ? 2 : 6), enemy.y + 6, 3, 3);
        } else if (enemy.type === 'snake') {
          // Jungle Python
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#065f46';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          // Red Tongue flicking
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(enemy.x + (enemy.vx > 0 ? enemy.w : -4), enemy.y + 8, 5, 2);
        }

        if (enemy.defeatTimer > 0) {
          ctx.restore();
        }
      });

      // --- 6. Collectibles ---
      const nowMs = Date.now() / 250;
      s.collectibles.forEach((item) => {
        if (item.collected) return;
        const bob = Math.sin(nowMs + item.bobOffset) * 4;

        if (item.type === 'banana') {
          // Golden Banana
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(item.x + 8, item.y + 8 + bob, 8, 0.4, 2.8);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#eab308';
          ctx.stroke();
          // Stem
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(item.x + 14, item.y + 4 + bob, 3, 3);
        } else if (item.type === 'coconut') {
          // Brown Coconut Ammunition
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(item.x + 9, item.y + 9 + bob, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(item.x + 7, item.y + 7 + bob, 2, 0, Math.PI * 2);
          ctx.arc(item.x + 11, item.y + 7 + bob, 2, 0, Math.PI * 2);
          ctx.arc(item.x + 9, item.y + 11 + bob, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'idol') {
          // Golden Idol Relic
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(item.x + 2, item.y + 2 + bob, 16, 20);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(item.x + 5, item.y + 6 + bob, 10, 8);
          // Gem
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10 + bob, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- 7. Coconuts in Flight ---
      s.coconutsInAir.forEach((c) => {
        if (!c.active) return;
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // --- 8. Tarzan Character Rendering ---
      const t = s.tarzan;
      if (t.invulnerable <= 0 || Math.floor(Date.now() / 70) % 2 === 0) {
        ctx.save();
        ctx.translate(t.x + t.width / 2, t.y + t.height / 2);

        // Facing direction flip
        if (!t.facingRight) {
          ctx.scale(-1, 1);
        }

        // Swinging Rotation
        if (t.isSwinging && t.currentVineIndex !== null) {
          const vine = s.vines[t.currentVineIndex];
          ctx.rotate(vine.angle * 0.7);
        }

        // Athletic Tarzan Body
        // Head
        ctx.fillStyle = '#fcd34d'; // skin
        ctx.beginPath();
        ctx.arc(0, -14, 8, 0, Math.PI * 2);
        ctx.fill();

        // Wild Jungle Hair (flowing dark mane)
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(-8, -18);
        ctx.quadraticCurveTo(-14, -6, -10, 4);
        ctx.lineTo(-4, -10);
        ctx.lineTo(4, -18);
        ctx.fill();

        // Athletic Muscular Torso
        ctx.fillStyle = '#f59e0b'; // tanned chest
        ctx.fillRect(-6, -6, 12, 16);

        // Iconic Leopard Print Loincloth
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-7, 8, 14, 10);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-4, 11, 3, 2);
        ctx.fillRect(2, 13, 3, 2);

        // Arms (Reaching up when swinging, running when on ground)
        ctx.fillStyle = '#f59e0b';
        if (t.isSwinging) {
          // Both arms stretched up grasping the vine
          ctx.fillRect(-2, -26, 4, 18);
          ctx.fillRect(2, -24, 4, 16);
        } else if (t.isJumping) {
          // Outstretched athletic dive arms
          ctx.fillRect(4, -10, 14, 4);
          ctx.fillRect(-14, -8, 12, 4);
        } else {
          // Running swing arms
          const armSwing = Math.sin(t.runFrame) * 6;
          ctx.fillRect(2, -4 + armSwing, 4, 12);
          ctx.fillRect(-6, -4 - armSwing, 4, 12);
        }

        // Legs
        if (t.isSwinging) {
          // Tucked swinging legs
          ctx.fillRect(-5, 18, 4, 12);
          ctx.fillRect(1, 16, 4, 10);
        } else if (t.isJumping) {
          // Split leap legs
          ctx.fillRect(-8, 16, 5, 12);
          ctx.fillRect(4, 14, 5, 14);
        } else {
          // Running animated legs
          const legSwing = Math.sin(t.runFrame) * 7;
          ctx.fillRect(-5, 18 + legSwing, 4, 12);
          ctx.fillRect(1, 18 - legSwing, 4, 12);
        }

        // Jungle Cry Aura / Visual Indicator
        if (t.yellTimer > 120) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(8, -14, 18, -0.6, 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(8, -14, 26, -0.6, 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- 9. Floating Text Particles ---
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      });

      ctx.restore(); // Restore camera translation

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [setupLevel, checkHighScore]);

  // Mobile Touch handlers
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    const s = gameStateRef.current;
    if (action === 'left') s.keys.left = true;
    if (action === 'right') s.keys.right = true;
    if (action === 'jump') {
      s.keys.jump = true;
      const t = s.tarzan;
      if (t.isSwinging && t.currentVineIndex !== null) {
        const vine = s.vines[t.currentVineIndex];
        t.isSwinging = false;
        t.currentVineIndex = null;
        t.isJumping = true;
        const tangentialSpeed = vine.angularVelocity * vine.length * 1.35;
        t.vx = Math.cos(vine.angle) * tangentialSpeed + (t.facingRight ? 4 : -4);
        t.vy = -Math.abs(Math.sin(vine.angle) * tangentialSpeed) - 8;
        soundManager.playTarzanVineRelease();
      } else if (t.isGrounded && !s.isGameOver && !s.isGameWon) {
        t.vy = -12.5;
        t.isGrounded = false;
        t.isJumping = true;
        soundManager.playTarzanJump();
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
      {/* Top HUD Card */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-3 sm:p-4 mb-3 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
          {/* Hearts / Lives */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>VIDAS</span>
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-white">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={i < lives ? 'text-rose-500' : 'text-slate-700 opacity-40'}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          {/* Bananas */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">
              BANANAS
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-amber-300">
              🍌 {bananas}
            </div>
          </div>

          {/* Coconuts Ammo */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600">
              MUNIÇÃO
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-amber-500">
              🥥 {coconuts}
            </div>
          </div>

          {/* Score */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
              PONTOS
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-emerald-300">
              {score.toString().padStart(5, '0')}
            </div>
          </div>

          {/* Distance / Progress */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5" />
              <span>TEMPLO</span>
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-teal-200">
              {distancePercent}%
            </div>
          </div>

          {/* Action & Sound Buttons */}
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-2 bg-slate-950/70 border border-emerald-950 rounded-xl p-1.5">
            <button
              onClick={handleTogglePause}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isPaused ? 'Continuar' : 'Pausar'}
              id="tarzan-btn-pause"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isMuted ? 'Ativar Sons da Selva' : 'Silenciar'}
              id="tarzan-btn-sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={restartGame}
              className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 transition-colors"
              title="Reiniciar Floresta"
              id="tarzan-btn-restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full max-w-4xl bg-slate-950 border-4 border-emerald-900/80 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/50">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto block select-none aspect-[2/1] bg-[#064e3b]"
          id="tarzan-canvas"
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
                FIM DA JORNADA
              </div>
              <p className="text-slate-300 text-sm mb-4">
                A selva venceu desta vez! Pontuação Final: <strong className="text-amber-400 font-mono">{score}</strong>
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2"
                id="btn-tarzan-retry"
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
                REI DA SELVA! 🌴
              </div>
              <p className="text-slate-300 text-sm mb-5">
                Você conquistou o Templo Perdido e recuperou o Ídolo Sagrado! Pontuação:{' '}
                <strong className="text-amber-400 font-mono text-base">{score} pts</strong>
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-extrabold text-base shadow-xl shadow-amber-600/30 transition-all flex items-center space-x-2"
                id="btn-tarzan-play-again"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Jogar Outra Aventura</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons Bar (Desktop Quick-Triggers & Mobile On-Screen Controls) */}
      <div className="w-full max-w-4xl mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-3">
        {/* Special Actions: Throw Coconut & Tarzan Yell */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleThrowCoconut}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/40 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md"
            title="Lançar Coco (Tecla X)"
            id="btn-throw-coconut"
          >
            <span>🥥 Lançar Coco</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(X)</span>
          </button>

          <button
            onClick={handleTarzanYell}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700/30 hover:bg-emerald-700/50 border border-emerald-500/40 text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md"
            title="Grito da Selva (Tecla Z)"
            id="btn-jungle-yell"
          >
            <span>📢 Grito da Selva</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(Z)</span>
          </button>
        </div>

        {/* Directional & Jump Controls for Mobile */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            className="p-3 rounded-xl bg-slate-800 active:bg-emerald-700 border border-slate-700 text-slate-200 select-none touch-none shadow-md"
            aria-label="Mover para esquerda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            className="p-3 rounded-xl bg-slate-800 active:bg-emerald-700 border border-slate-700 text-slate-200 select-none touch-none shadow-md"
            aria-label="Mover para direita"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={() => handleTouchEnd('jump')}
            onMouseDown={() => handleTouchStart('jump')}
            onMouseUp={() => handleTouchEnd('jump')}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 active:from-emerald-700 active:to-teal-700 text-white font-black text-sm select-none touch-none flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
            id="btn-tarzan-jump"
          >
            <ArrowUp className="w-4 h-4" />
            <span>PULAR / SOLTAR CIPÓ</span>
          </button>
        </div>
      </div>

      {/* Instructions & Record Banner */}
      <div className="w-full max-w-4xl mt-3 p-3 bg-emerald-950/40 border border-emerald-800/30 rounded-xl text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">🌿 Guia do Tarzan:</span>
          <span>Pule no cipó para se agarrar, balance com as setas e aperte <strong>Espaço</strong> no ápice para se lançar!</span>
        </div>
        <div className="flex items-center space-x-1 font-bold text-amber-300">
          <Trophy className="w-3.5 h-3.5" />
          <span>Recorde Selva: {highScore > 0 ? `${highScore} pts` : '--'}</span>
        </div>
      </div>
    </div>
  );
};
