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
  Zap,
  Flame,
  Award,
  ChevronRight,
  Layers,
  ArrowDown,
  Music,
  Swords,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '@/lib/sound';

export type TarzanStage = 1 | 2 | 3;

interface TarzanGameState {
  currentStage: TarzanStage;
  tarzan: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    isGrounded: boolean;
    isJumping: boolean;
    canDoubleJump: boolean;
    hasDoubleJumped: boolean;
    facingRight: boolean;
    invulnerable: number;
    // Vine swinging
    isSwinging: boolean;
    currentVineIndex: number | null;
    vineGrabDistance: number;
    swingVelocity: number;
    runFrame: number;
    yellTimer: number;
    dashTimer: number;
    dashCooldown: number;
    // Power-ups
    hasShield: boolean;
    tantorElephantTimer: number; // Invincible trampling mode
    isSliding: boolean;
    slideTimer: number;
    somersaultAngle: number;
    hasMonkeyAlly: boolean;
  };
  keys: {
    left: boolean;
    right: boolean;
    jump: boolean;
    throw: boolean;
    yell: boolean;
    dash: boolean;
    slide: boolean;
  };
  cameraX: number;
  score: number;
  bananas: number;
  coconuts: number;
  superCoconuts: number;
  lives: number;
  combo: number;
  comboTimer: number;
  difficulty: 'easy' | 'normal' | 'hard';
  screenShake: number;
  isGameOver: boolean;
  isGameWon: boolean;
  isPaused: boolean;
  levelWidth: number;
  checkpoint: {
    x: number;
    y: number;
    activated: boolean;
  };
  platforms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'branch' | 'bridge' | 'ruin' | 'water' | 'log';
    floatOffset?: number;
  }>;
  mushrooms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    bounceScale: number;
  }>;
  bossSabor: {
    active: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    hp: number;
    maxHp: number;
    state: 'patrol' | 'pounce' | 'roar' | 'hurt' | 'defeated';
    timer: number;
    defeatTimer: number;
  };
  vines: Array<{
    anchorX: number;
    anchorY: number;
    length: number;
    angle: number;
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
    type: 'jaguar' | 'croc' | 'snake' | 'monkey';
    isDefeated: boolean;
    defeatTimer: number;
  }>;
  collectibles: Array<{
    x: number;
    y: number;
    type: 'banana' | 'coconut' | 'idol' | 'elephant' | 'shield' | 'goldenBanana' | 'superCoconut' | 'monkey';
    collected: boolean;
    bobOffset: number;
  }>;
  coconutsInAir: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    isSuper?: boolean;
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
  ambientLeaves: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
  }>;
  butterflies: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    wingFrame: number;
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

  // HUD & React State
  const [currentStage, setCurrentStage] = useState<TarzanStage>(1);
  const [score, setScore] = useState(0);
  const [bananas, setBananas] = useState(0);
  const [coconuts, setCoconuts] = useState(6);
  const [superCoconuts, setSuperCoconuts] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [hasMonkey, setHasMonkey] = useState(false);
  const [elephantTime, setElephantTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [bossHp, setBossHp] = useState<number | null>(null);
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
  const [canYell, setCanYell] = useState(true);

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

  // Main game state ref
  const gameStateRef = useRef<TarzanGameState>({
    currentStage: 1,
    tarzan: {
      x: 80,
      y: 260,
      vx: 0,
      vy: 0,
      width: 32,
      height: 48,
      isGrounded: false,
      isJumping: false,
      canDoubleJump: true,
      hasDoubleJumped: false,
      facingRight: true,
      invulnerable: 0,
      isSwinging: false,
      currentVineIndex: null,
      vineGrabDistance: 170,
      swingVelocity: 0,
      runFrame: 0,
      yellTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      hasShield: false,
      tantorElephantTimer: 0,
      isSliding: false,
      slideTimer: 0,
      somersaultAngle: 0,
      hasMonkeyAlly: false,
    },
    keys: {
      left: false,
      right: false,
      jump: false,
      throw: false,
      yell: false,
      dash: false,
      slide: false,
    },
    cameraX: 0,
    score: 0,
    bananas: 0,
    coconuts: 6,
    superCoconuts: 0,
    lives: 3,
    combo: 0,
    comboTimer: 0,
    difficulty: 'normal',
    screenShake: 0,
    isGameOver: false,
    isGameWon: false,
    isPaused: false,
    levelWidth: 3200,
    checkpoint: {
      x: 1600,
      y: 280,
      activated: false,
    },
    platforms: [],
    mushrooms: [],
    bossSabor: {
      active: false,
      x: 2750,
      y: 240,
      w: 48,
      h: 32,
      vx: -1.5,
      vy: 0,
      hp: 5,
      maxHp: 5,
      state: 'patrol',
      timer: 0,
      defeatTimer: 0,
    },
    vines: [],
    enemies: [],
    collectibles: [],
    coconutsInAir: [],
    particles: [],
    ambientLeaves: [],
    butterflies: [],
    waterfalls: [],
    goalTemple: {
      x: 3000,
      y: 130,
      w: 180,
      h: 220,
      reached: false,
    },
  });

  // Pure stage entity initialization without triggering React renders
  const initStageData = useCallback(
    (stageNumber: TarzanStage, preserveScore: boolean = false) => {
      const s = gameStateRef.current;
      s.currentStage = stageNumber;
      const initialLives = s.difficulty === 'easy' ? 5 : s.difficulty === 'hard' ? 2 : 3;
      const initialCoconuts = s.difficulty === 'easy' ? 10 : s.difficulty === 'hard' ? 4 : 6;
      if (!preserveScore) {
        s.score = 0;
        s.bananas = 0;
        s.lives = initialLives;
      }
      s.coconuts = Math.max(s.coconuts, initialCoconuts);
      s.superCoconuts = 0;
      s.combo = 0;
      s.comboTimer = 0;
      s.isGameOver = false;
      s.isGameWon = false;
      s.isPaused = false;
      s.cameraX = 0;

      s.checkpoint = {
        x: stageNumber === 1 ? 1500 : stageNumber === 2 ? 1600 : 1700,
        y: 260,
        activated: false,
      };

      s.tarzan = {
        x: 80,
        y: 260,
        vx: 0,
        vy: 0,
        width: 32,
        height: 48,
        isGrounded: false,
        isJumping: false,
        canDoubleJump: true,
        hasDoubleJumped: false,
        facingRight: true,
        invulnerable: 0,
        isSwinging: false,
        currentVineIndex: null,
        vineGrabDistance: 170,
        swingVelocity: 0,
        runFrame: 0,
        yellTimer: 0,
        dashTimer: 0,
        dashCooldown: 0,
        hasShield: false,
        tantorElephantTimer: 0,
        isSliding: false,
        slideTimer: 0,
        somersaultAngle: 0,
        hasMonkeyAlly: false,
      };

      // Mushrooms per stage
      if (stageNumber === 1) {
        s.mushrooms = [
          { x: 990, y: 260, w: 36, h: 22, bounceScale: 1 },
          { x: 2360, y: 250, w: 36, h: 22, bounceScale: 1 },
        ];
      } else if (stageNumber === 2) {
        s.mushrooms = [
          { x: 820, y: 290, w: 36, h: 22, bounceScale: 1 },
          { x: 2360, y: 260, w: 36, h: 22, bounceScale: 1 },
        ];
      } else {
        s.mushrooms = [
          { x: 560, y: 240, w: 36, h: 22, bounceScale: 1 },
          { x: 2060, y: 280, w: 36, h: 22, bounceScale: 1 },
        ];
      }

      // Boss Sabor in Stage 3
      if (stageNumber === 3) {
        s.bossSabor = {
          active: true,
          x: 2720,
          y: 250,
          w: 52,
          h: 32,
          vx: -1.6,
          vy: 0,
          hp: 5,
          maxHp: 5,
          state: 'patrol',
          timer: 0,
          defeatTimer: 0,
        };
      } else {
        s.bossSabor = {
          active: false,
          x: 2720,
          y: 250,
          w: 52,
          h: 32,
          vx: 0,
          vy: 0,
          hp: 0,
          maxHp: 5,
          state: 'patrol',
          timer: 0,
          defeatTimer: 0,
        };
      }

      // Populate Ambient Leaves and Butterflies
      s.ambientLeaves = Array.from({ length: 18 }).map(() => ({
        x: Math.random() * 3200,
        y: Math.random() * 380,
        vx: 0.6 + Math.random() * 1.2,
        vy: 0.4 + Math.random() * 0.8,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#15803d' : '#84cc16',
        rotation: Math.random() * Math.PI * 2,
      }));

      s.butterflies = Array.from({ length: 8 }).map(() => ({
        x: 200 + Math.random() * 2800,
        y: 120 + Math.random() * 180,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 0.8,
        color: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7'][Math.floor(Math.random() * 4)],
        wingFrame: 0,
      }));

      // STAGE SPECIFIC ENTITIES
      if (stageNumber === 1) {
        // --- FASE 1: A COPA DAS ÁRVORES (CANOPY FOREST) ---
        s.platforms = [
          { x: 0, y: 320, w: 320, h: 80, type: 'branch' },
          { x: 400, y: 310, w: 260, h: 60, type: 'branch' },
          { x: 760, y: 280, w: 240, h: 50, type: 'bridge' },
          { x: 1080, y: 320, w: 120, h: 40, type: 'branch' },
          { x: 1280, y: 270, w: 180, h: 50, type: 'branch' },
          { x: 1540, y: 310, w: 280, h: 70, type: 'branch' }, // Checkpoint branch
          { x: 1900, y: 290, w: 220, h: 50, type: 'bridge' },
          { x: 2200, y: 270, w: 160, h: 50, type: 'branch' },
          { x: 2460, y: 310, w: 260, h: 70, type: 'branch' },
          { x: 2820, y: 280, w: 180, h: 60, type: 'branch' },
          { x: 2980, y: 330, w: 240, h: 80, type: 'ruin' },
        ];

        s.vines = [
          { anchorX: 360, anchorY: 30, length: 220, angle: 0.35, angularVelocity: 0, baseAngle: 0, amplitude: 0.5, speed: 0.035 },
          { anchorX: 720, anchorY: 30, length: 210, angle: -0.4, angularVelocity: 0, baseAngle: 0, amplitude: 0.52, speed: 0.038 },
          { anchorX: 1040, anchorY: 40, length: 220, angle: 0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.036 },
          { anchorX: 1240, anchorY: 30, length: 200, angle: -0.4, angularVelocity: 0, baseAngle: 0, amplitude: 0.5, speed: 0.037 },
          { anchorX: 1850, anchorY: 30, length: 220, angle: 0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.54, speed: 0.035 },
          { anchorX: 2160, anchorY: 30, length: 220, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.52, speed: 0.036 },
          { anchorX: 2420, anchorY: 30, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.036 },
        ];

        s.enemies = [
          { x: 500, y: 286, w: 36, h: 24, vx: -1.2, minX: 420, maxX: 640, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 840, y: 256, w: 32, h: 22, vx: 0.8, minX: 780, maxX: 980, type: 'monkey', isDefeated: false, defeatTimer: 0 },
          { x: 1340, y: 246, w: 36, h: 24, vx: 1.3, minX: 1290, maxX: 1440, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 1620, y: 286, w: 30, h: 20, vx: -0.7, minX: 1560, maxX: 1800, type: 'snake', isDefeated: false, defeatTimer: 0 },
          { x: 1960, y: 266, w: 36, h: 24, vx: -1.4, minX: 1910, maxX: 2100, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 2540, y: 286, w: 32, h: 22, vx: 1.0, minX: 2480, maxX: 2700, type: 'monkey', isDefeated: false, defeatTimer: 0 },
        ];

        s.collectibles = [
          { x: 140, y: 270, type: 'banana', collected: false, bobOffset: 0 },
          { x: 220, y: 270, type: 'banana', collected: false, bobOffset: 1 },
          { x: 280, y: 270, type: 'coconut', collected: false, bobOffset: 2 },
          { x: 360, y: 190, type: 'banana', collected: false, bobOffset: 0.5 },
          { x: 540, y: 240, type: 'shield', collected: false, bobOffset: 1.5 },
          { x: 720, y: 190, type: 'banana', collected: false, bobOffset: 0.8 },
          { x: 920, y: 230, type: 'coconut', collected: false, bobOffset: 2 },
          { x: 1040, y: 200, type: 'banana', collected: false, bobOffset: 3 },
          { x: 1240, y: 180, type: 'elephant', collected: false, bobOffset: 0 }, // Tantor elephant powerup!
          { x: 1400, y: 220, type: 'banana', collected: false, bobOffset: 1 },
          { x: 1700, y: 260, type: 'coconut', collected: false, bobOffset: 2 },
          { x: 2020, y: 240, type: 'banana', collected: false, bobOffset: 1 },
          { x: 2320, y: 210, type: 'banana', collected: false, bobOffset: 2 },
          { x: 2640, y: 260, type: 'coconut', collected: false, bobOffset: 0 },
          { x: 2860, y: 220, type: 'idol', collected: false, bobOffset: 1 },
        ];

        s.waterfalls = [{ x: 1020, y: 0, w: 45, h: 370 }];
      } else if (stageNumber === 2) {
        // --- FASE 2: AS CORREDEIRAS DO RIO DOS CROCODILOS ---
        s.platforms = [
          { x: 0, y: 320, w: 280, h: 80, type: 'branch' },
          { x: 340, y: 370, w: 550, h: 50, type: 'water' }, // Enormous river!
          { x: 420, y: 280, w: 90, h: 25, type: 'log', floatOffset: 0 },
          { x: 620, y: 260, w: 90, h: 25, type: 'log', floatOffset: 2 },
          { x: 890, y: 310, w: 220, h: 60, type: 'branch' },
          { x: 1180, y: 270, w: 240, h: 50, type: 'bridge' },
          { x: 1480, y: 370, w: 600, h: 50, type: 'water' }, // Chasm rapids
          { x: 1600, y: 300, w: 180, h: 60, type: 'ruin' }, // Checkpoint island
          { x: 1880, y: 270, w: 100, h: 25, type: 'log', floatOffset: 1 },
          { x: 2140, y: 320, w: 240, h: 60, type: 'branch' },
          { x: 2450, y: 280, w: 220, h: 50, type: 'bridge' },
          { x: 2740, y: 300, w: 180, h: 60, type: 'branch' },
          { x: 2980, y: 330, w: 240, h: 80, type: 'ruin' },
        ];

        s.vines = [
          { anchorX: 380, anchorY: 30, length: 230, angle: 0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.038 },
          { anchorX: 580, anchorY: 30, length: 220, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.54, speed: 0.038 },
          { anchorX: 780, anchorY: 30, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.56, speed: 0.036 },
          { anchorX: 1440, anchorY: 30, length: 230, angle: 0.48, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.037 },
          { anchorX: 1820, anchorY: 30, length: 220, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.52, speed: 0.038 },
          { anchorX: 2060, anchorY: 30, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.56, speed: 0.036 },
          { anchorX: 2680, anchorY: 30, length: 220, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.52, speed: 0.037 },
        ];

        s.enemies = [
          { x: 480, y: 356, w: 52, h: 22, vx: 1.1, minX: 380, maxX: 600, type: 'croc', isDefeated: false, defeatTimer: 0 },
          { x: 680, y: 356, w: 52, h: 22, vx: -1.2, minX: 620, maxX: 850, type: 'croc', isDefeated: false, defeatTimer: 0 },
          { x: 940, y: 286, w: 36, h: 24, vx: 1.3, minX: 900, maxX: 1090, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 1240, y: 246, w: 32, h: 22, vx: -0.9, minX: 1190, maxX: 1400, type: 'monkey', isDefeated: false, defeatTimer: 0 },
          { x: 1540, y: 356, w: 52, h: 22, vx: 1.0, minX: 1490, maxX: 1720, type: 'croc', isDefeated: false, defeatTimer: 0 },
          { x: 1980, y: 356, w: 52, h: 22, vx: -1.2, minX: 1850, maxX: 2100, type: 'croc', isDefeated: false, defeatTimer: 0 },
          { x: 2220, y: 296, w: 36, h: 24, vx: -1.4, minX: 2160, maxX: 2360, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 2520, y: 256, w: 30, h: 20, vx: 0.8, minX: 2470, maxX: 2650, type: 'snake', isDefeated: false, defeatTimer: 0 },
        ];

        s.collectibles = [
          { x: 140, y: 270, type: 'banana', collected: false, bobOffset: 0 },
          { x: 240, y: 270, type: 'coconut', collected: false, bobOffset: 1 },
          { x: 380, y: 200, type: 'banana', collected: false, bobOffset: 2 },
          { x: 440, y: 220, type: 'shield', collected: false, bobOffset: 0 },
          { x: 580, y: 190, type: 'banana', collected: false, bobOffset: 1 },
          { x: 780, y: 190, type: 'banana', collected: false, bobOffset: 2 },
          { x: 980, y: 260, type: 'coconut', collected: false, bobOffset: 3 },
          { x: 1300, y: 220, type: 'banana', collected: false, bobOffset: 0 },
          { x: 1600, y: 240, type: 'elephant', collected: false, bobOffset: 1 }, // Tantor in mid-stage!
          { x: 1880, y: 200, type: 'banana', collected: false, bobOffset: 2 },
          { x: 2060, y: 190, type: 'coconut', collected: false, bobOffset: 3 },
          { x: 2280, y: 260, type: 'banana', collected: false, bobOffset: 0 },
          { x: 2560, y: 230, type: 'banana', collected: false, bobOffset: 1 },
          { x: 2800, y: 250, type: 'idol', collected: false, bobOffset: 2 },
        ];

        s.waterfalls = [
          { x: 460, y: 0, w: 45, h: 370 },
          { x: 1540, y: 0, w: 60, h: 370 },
          { x: 2000, y: 0, w: 50, h: 370 },
        ];
      } else {
        // --- FASE 3: O TEMPLO PERDIDO DOS ANTIGOS (ANCIENT RUINS) ---
        s.platforms = [
          { x: 0, y: 320, w: 260, h: 80, type: 'ruin' },
          { x: 340, y: 290, w: 220, h: 60, type: 'ruin' },
          { x: 640, y: 260, w: 200, h: 60, type: 'ruin' },
          { x: 900, y: 300, w: 180, h: 50, type: 'bridge' },
          { x: 1140, y: 270, w: 200, h: 60, type: 'ruin' },
          { x: 1400, y: 370, w: 400, h: 50, type: 'water' }, // Deep chasm with ruins
          { x: 1480, y: 280, w: 80, h: 30, type: 'ruin' },
          { x: 1640, y: 250, w: 80, h: 30, type: 'ruin' },
          { x: 1860, y: 300, w: 240, h: 70, type: 'ruin' }, // Temple Checkpoint
          { x: 2180, y: 270, w: 200, h: 60, type: 'ruin' },
          { x: 2440, y: 240, w: 180, h: 60, type: 'ruin' },
          { x: 2700, y: 280, w: 200, h: 60, type: 'ruin' },
          { x: 2960, y: 320, w: 260, h: 90, type: 'ruin' }, // Grand Shrine
        ];

        s.vines = [
          { anchorX: 300, anchorY: 20, length: 220, angle: 0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.038 },
          { anchorX: 600, anchorY: 20, length: 210, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.54, speed: 0.038 },
          { anchorX: 860, anchorY: 20, length: 220, angle: 0.48, angularVelocity: 0, baseAngle: 0, amplitude: 0.56, speed: 0.036 },
          { anchorX: 1360, anchorY: 20, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.58, speed: 0.037 },
          { anchorX: 1580, anchorY: 20, length: 220, angle: -0.48, angularVelocity: 0, baseAngle: 0, amplitude: 0.55, speed: 0.038 },
          { anchorX: 1800, anchorY: 20, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.56, speed: 0.036 },
          { anchorX: 2400, anchorY: 20, length: 220, angle: -0.45, angularVelocity: 0, baseAngle: 0, amplitude: 0.54, speed: 0.038 },
          { anchorX: 2660, anchorY: 20, length: 230, angle: 0.5, angularVelocity: 0, baseAngle: 0, amplitude: 0.56, speed: 0.037 },
        ];

        s.enemies = [
          { x: 420, y: 266, w: 36, h: 24, vx: 1.4, minX: 360, maxX: 540, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 700, y: 236, w: 32, h: 22, vx: -1.1, minX: 660, maxX: 820, type: 'monkey', isDefeated: false, defeatTimer: 0 },
          { x: 1200, y: 246, w: 36, h: 24, vx: -1.5, minX: 1150, maxX: 1320, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 1500, y: 356, w: 52, h: 22, vx: 1.3, minX: 1420, maxX: 1760, type: 'croc', isDefeated: false, defeatTimer: 0 },
          { x: 1940, y: 276, w: 30, h: 20, vx: 0.9, minX: 1880, maxX: 2080, type: 'snake', isDefeated: false, defeatTimer: 0 },
          { x: 2240, y: 246, w: 36, h: 24, vx: -1.6, minX: 2190, maxX: 2360, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
          { x: 2500, y: 216, w: 32, h: 22, vx: 1.2, minX: 2450, maxX: 2600, type: 'monkey', isDefeated: false, defeatTimer: 0 },
          { x: 2760, y: 256, w: 36, h: 24, vx: 1.4, minX: 2710, maxX: 2880, type: 'jaguar', isDefeated: false, defeatTimer: 0 },
        ];

        s.collectibles = [
          { x: 120, y: 270, type: 'banana', collected: false, bobOffset: 0 },
          { x: 200, y: 270, type: 'coconut', collected: false, bobOffset: 1 },
          { x: 380, y: 230, type: 'shield', collected: false, bobOffset: 2 },
          { x: 500, y: 230, type: 'banana', collected: false, bobOffset: 0 },
          { x: 740, y: 200, type: 'coconut', collected: false, bobOffset: 1 },
          { x: 1000, y: 240, type: 'elephant', collected: false, bobOffset: 2 }, // Elephant rampage!
          { x: 1220, y: 210, type: 'banana', collected: false, bobOffset: 0 },
          { x: 1520, y: 220, type: 'banana', collected: false, bobOffset: 1 },
          { x: 1680, y: 190, type: 'coconut', collected: false, bobOffset: 2 },
          { x: 1920, y: 240, type: 'shield', collected: false, bobOffset: 0 },
          { x: 2260, y: 210, type: 'banana', collected: false, bobOffset: 1 },
          { x: 2520, y: 180, type: 'coconut', collected: false, bobOffset: 2 },
          { x: 2780, y: 220, type: 'banana', collected: false, bobOffset: 0 },
          { x: 2900, y: 200, type: 'idol', collected: false, bobOffset: 1 },
          { x: 3040, y: 180, type: 'idol', collected: false, bobOffset: 2 },
        ];

        s.waterfalls = [{ x: 1420, y: 0, w: 50, h: 370 }];
      }

      s.goalTemple = {
        x: 3000,
        y: 130,
        w: 180,
        h: 220,
        reached: false,
      };

      s.coconutsInAir = [];
      s.particles = [];
    },
    []
  );

  // Full Stage Setup with React HUD synchronization
  const setupStage = useCallback(
    (stageNumber: TarzanStage, preserveScore: boolean = false) => {
      initStageData(stageNumber, preserveScore);
      const s = gameStateRef.current;
      setCurrentStage(stageNumber);
      setCoconuts(s.coconuts);
      setSuperCoconuts(0);
      setLives(s.lives);
      setCombo(0);
      setHasShield(s.tarzan.hasShield);
      setHasMonkey(s.tarzan.hasMonkeyAlly);
      setElephantTime(0);
      setDistancePercent(0);
      if (stageNumber === 3) {
        setBossHp(5);
      } else {
        setBossHp(null);
      }
    },
    [initStageData]
  );

  // Full Restart Game at current stage
  const restartGame = useCallback(() => {
    setupStage(currentStage, false);
    setScore(0);
    setBananas(0);
    setCoconuts(6);
    setLives(3);
    setHasShield(false);
    setElephantTime(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPaused(false);
    setDistancePercent(0);
  }, [setupStage, currentStage]);

  // Advance to next stage upon victory
  const handleNextStage = () => {
    if (currentStage < 3) {
      const next = (currentStage + 1) as TarzanStage;
      setupStage(next, true);
    } else {
      // Finished all 3 stages! Loop or restart with bonus
      setupStage(1, true);
    }
  };

  // Throw Coconut Action (Normal or Super Flame Coconut)
  const handleThrowCoconut = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;

    const isSuper = s.superCoconuts > 0;
    if (isSuper) {
      s.superCoconuts -= 1;
      setSuperCoconuts(s.superCoconuts);
      soundManager.playTarzanSuperCoconutExplosion();
    } else {
      if (s.coconuts <= 0) return;
      s.coconuts -= 1;
      setCoconuts(s.coconuts);
      soundManager.playCoconutThrow();
    }

    const t = s.tarzan;
    const throwVx = t.facingRight ? 10.5 : -10.5;
    s.coconutsInAir.push({
      x: t.x + (t.facingRight ? t.width + 4 : -4),
      y: t.y + 16,
      vx: throwVx,
      vy: -2.5,
      isSuper,
      active: true,
    });
  }, []);

  // Tarzan Slide / Tree-Surf Action (Deslizar na Rama)
  const handleSlideAction = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    const t = s.tarzan;
    if (t.isSwinging || !t.isGrounded || t.isSliding) return;

    t.isSliding = true;
    t.slideTimer = 24; // ~0.4s slide
    t.height = 24; // crouched low height
    t.vx = t.facingRight ? 9.5 : -9.5;
    soundManager.playTarzanSlide();

    s.particles.push({
      x: t.x + 16,
      y: t.y + 24,
      text: '💨 DESLIZE!',
      life: 25,
      vy: -0.8,
      color: '#fbbf24',
    });
  }, []);

  // Toggle Tribal Jungle Percussion BGM
  const handleToggleBgm = useCallback(() => {
    const next = soundManager.toggleJungleTribalBGM();
    setIsBgmActive(next);
  }, []);

  // Change Game Difficulty
  const handleSetDifficulty = useCallback(
    (diff: 'easy' | 'normal' | 'hard') => {
      setDifficulty(diff);
      gameStateRef.current.difficulty = diff;
      setupStage(currentStage, false);
    },
    [currentStage, setupStage]
  );

  // Tarzan Jungle Cry Action (Grito da Selva)
  const handleTarzanYell = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    if (s.tarzan.yellTimer > 0) return;

    s.tarzan.yellTimer = 180;
    setCanYell(false);
    soundManager.playTarzanYell();

    s.enemies.forEach((enemy) => {
      const dist = Math.abs(enemy.x - s.tarzan.x);
      if (dist < 460 && !enemy.isDefeated) {
        enemy.isDefeated = true;
        enemy.defeatTimer = 100;
        s.score += 150;
        setScore(s.score);
        s.particles.push({
          x: enemy.x + enemy.w / 2,
          y: enemy.y - 12,
          text: '🦁 AFUGENTADO! +150',
          life: 45,
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

  // Dash / Jungle Sprint Action
  const handleTarzanDash = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    const t = s.tarzan;
    if (t.dashCooldown > 0 || t.isSwinging) return;

    t.dashTimer = 14;
    t.dashCooldown = 60; // 1 second cooldown
    t.invulnerable = Math.max(t.invulnerable, 18);
    t.vx = t.facingRight ? 11 : -11;
    soundManager.playTarzanDash();

    s.particles.push({
      x: t.x + 16,
      y: t.y + 16,
      text: '⚡ ARRANCADA!',
      life: 25,
      vy: -1.2,
      color: '#38bdf8',
    });
  }, []);

  // Jump / Double Jump handler
  const handleJumpAction = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver || s.isGameWon || s.isPaused) return;
    const t = s.tarzan;

    // If swinging on vine, release and leap forward!
    if (t.isSwinging && t.currentVineIndex !== null) {
      const vine = s.vines[t.currentVineIndex];
      t.isSwinging = false;
      t.currentVineIndex = null;
      t.isJumping = true;
      t.canDoubleJump = true;
      t.hasDoubleJumped = false;

      const tangentialSpeed = vine.angularVelocity * vine.length * 1.45;
      t.vx = Math.cos(vine.angle) * tangentialSpeed + (t.facingRight ? 4.5 : -4.5);
      t.vy = -Math.abs(Math.sin(vine.angle) * tangentialSpeed) - 9;
      soundManager.playTarzanVineRelease();

      // Check if released at optimal peak
      if (Math.abs(vine.angle) > 0.35) {
        s.score += 100;
        setScore(s.score);
        s.particles.push({
          x: t.x,
          y: t.y - 15,
          text: '⭐ SALTO PERFEITO! +100',
          life: 35,
          vy: -2,
          color: '#fbbf24',
        });
      }
      return;
    }

    // Ground jump
    if (t.isGrounded) {
      t.vy = -13.2;
      t.isGrounded = false;
      t.isJumping = true;
      t.canDoubleJump = true;
      t.hasDoubleJumped = false;
      soundManager.playTarzanJump();
      return;
    }

    // Mid-air Acrobatic Double Jump!
    if (t.canDoubleJump && !t.hasDoubleJumped && !t.isGrounded) {
      t.vy = -12;
      t.hasDoubleJumped = true;
      t.canDoubleJump = false;
      soundManager.playTarzanDoubleJump();

      s.particles.push({
        x: t.x + 16,
        y: t.y + 10,
        text: '🌀 CAMBALHOTA!',
        life: 30,
        vy: -1.8,
        color: '#4ade80',
      });
    }
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
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        e.preventDefault();
        handleJumpAction();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        handleSlideAction();
      }
      if (e.code === 'KeyX') {
        handleThrowCoconut();
      }
      if (e.code === 'KeyZ') {
        handleTarzanYell();
      }
      if (e.code === 'KeyC' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        handleTarzanDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = false;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keys.jump = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keys.slide = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleJumpAction, handleSlideAction, handleThrowCoconut, handleTarzanYell, handleTarzanDash]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    initStageData(1, false);

    let animationFrameId: number;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const s = gameStateRef.current;

      if (!s.isPaused && !s.isGameOver && !s.isGameWon) {
        const t = s.tarzan;

        // Timers & Cooldowns
        if (t.invulnerable > 0) t.invulnerable--;
        if (t.yellTimer > 0) {
          t.yellTimer--;
          if (t.yellTimer === 0) setCanYell(true);
        }
        if (t.dashCooldown > 0) t.dashCooldown--;
        if (t.tantorElephantTimer > 0) {
          t.tantorElephantTimer--;
          setElephantTime(Math.ceil(t.tantorElephantTimer / 60));
        } else {
          setElephantTime(0);
        }

        // --- DASH PHYSICS ---
        if (t.dashTimer > 0) {
          t.dashTimer--;
          t.vy = 0; // maintain horizontal altitude during dash
          t.x += t.vx;
        } else {
          // --- REGULAR HORIZONTAL MOVEMENT ---
          if (!t.isSwinging) {
            const moveSpeed = t.tantorElephantTimer > 0 ? 5.8 : 4.5;
            if (s.keys.left) {
              t.vx = -moveSpeed;
              t.facingRight = false;
              t.runFrame += 0.22;
            } else if (s.keys.right) {
              t.vx = moveSpeed;
              t.facingRight = true;
              t.runFrame += 0.22;
            } else {
              t.vx *= 0.8;
              if (Math.abs(t.vx) < 0.1) t.vx = 0;
            }
            t.x += t.vx;
          }

          // --- GRAVITY & VERTICAL PHYSICS ---
          if (!t.isSwinging) {
            t.vy += 0.65; // gravity
            if (t.vy > 13) t.vy = 13; // terminal velocity
            t.y += t.vy;
          }
        }

        // --- SWINGING VINE PHYSICS ---
        s.vines.forEach((vine) => {
          vine.angle = Math.sin(Date.now() * 0.001 * vine.speed * 60) * vine.amplitude;
          vine.angularVelocity =
            Math.cos(Date.now() * 0.001 * vine.speed * 60) * vine.amplitude * (vine.speed * 60 * 0.001);
        });

        // Vine Grab Check
        if (!t.isSwinging && t.vy > -1) {
          s.vines.forEach((vine, index) => {
            const tipX = vine.anchorX + Math.sin(vine.angle) * vine.length;
            const tipY = vine.anchorY + Math.cos(vine.angle) * vine.length;
            const dist = Math.hypot(t.x + t.width / 2 - tipX, t.y + 12 - tipY);

            if (dist < 42) {
              t.isSwinging = true;
              t.currentVineIndex = index;
              t.canDoubleJump = true;
              t.hasDoubleJumped = false;
              t.isGrounded = false;
              t.isJumping = false;
              t.vx = 0;
              t.vy = 0;
              soundManager.playTarzanVineGrab();
            }
          });
        }

        // Active Vine Position Locking
        if (t.isSwinging && t.currentVineIndex !== null) {
          const v = s.vines[t.currentVineIndex];
          t.x = v.anchorX + Math.sin(v.angle) * t.vineGrabDistance - t.width / 2;
          t.y = v.anchorY + Math.cos(v.angle) * t.vineGrabDistance - 20;

          if (v.angularVelocity > 0.01) t.facingRight = true;
          else if (v.angularVelocity < -0.01) t.facingRight = false;
        }

        // --- PLATFORMS COLLISION ---
        if (!t.isSwinging) {
          let onAnyPlatform = false;
          s.platforms.forEach((p) => {
            if (p.type === 'water') {
              // Croc Water Hazard: If Tarzan falls in water without elephant rampage
              if (
                t.x + t.width > p.x &&
                t.x < p.x + p.w &&
                t.y + t.height >= p.y + 15
              ) {
                if (t.tantorElephantTimer > 0) {
                  // Tramples water unharmed!
                  t.y = p.y - t.height;
                  t.vy = 0;
                  t.isGrounded = true;
                  onAnyPlatform = true;
                } else if (t.invulnerable <= 0) {
                  // Lose heart and respawn at checkpoint
                  s.lives -= 1;
                  setLives(s.lives);
                  soundManager.playTarzanDamage();
                  soundManager.playJungleGrowl();

                  if (s.lives <= 0) {
                    s.isGameOver = true;
                    setIsGameOver(true);
                    checkHighScore(s.score);
                  } else {
                    // Respawn at checkpoint or start
                    const respawnX = s.checkpoint.activated ? s.checkpoint.x : 80;
                    const respawnY = s.checkpoint.activated ? s.checkpoint.y : 260;
                    t.x = respawnX;
                    t.y = respawnY;
                    t.vx = 0;
                    t.vy = -6;
                    t.invulnerable = 90;
                  }
                }
              }
              return;
            }

            // Solid platforms, bridges, floating logs and ruins
            const logOffset = p.type === 'log' && p.floatOffset ? Math.sin(Date.now() / 400 + p.floatOffset) * 6 : 0;
            const platY = p.y + logOffset;

            if (
              t.x + t.width - 6 > p.x &&
              t.x + 6 < p.x + p.w &&
              t.y + t.height >= platY &&
              t.y + t.height - t.vy <= platY + 16 &&
              t.vy >= 0
            ) {
              t.y = platY - t.height;
              t.vy = 0;
              t.isGrounded = true;
              t.isJumping = false;
              t.canDoubleJump = true;
              t.hasDoubleJumped = false;
              onAnyPlatform = true;
            }
          });

          if (!onAnyPlatform) {
            t.isGrounded = false;
          } else {
            if (s.combo > 1) {
              const comboBonus = s.combo * 150;
              s.score += comboBonus;
              setScore(s.score);
              s.particles.push({
                x: t.x + 16,
                y: t.y - 18,
                text: `🔥 COMBO! +${comboBonus}`,
                life: 40,
                vy: -1.6,
                color: '#f59e0b',
              });
            }
            s.combo = 0;
            setCombo(0);
          }

          // --- BOUNCY JUNGLE MUSHROOMS ---
          s.mushrooms.forEach((m) => {
            if (m.bounceScale < 1) m.bounceScale += 0.08;
            if (
              t.x + t.width > m.x &&
              t.x < m.x + m.w &&
              t.y + t.height >= m.y &&
              t.y + t.height - t.vy <= m.y + 18 &&
              t.vy > 0
            ) {
              t.y = m.y - t.height;
              t.vy = -16.5;
              t.canDoubleJump = true;
              t.hasDoubleJumped = false;
              t.isJumping = true;
              m.bounceScale = 0.5;
              soundManager.playTarzanMushroomBounce();
              s.combo = (s.combo || 0) + 1;
              setCombo(s.combo);
              soundManager.playTarzanCombo(s.combo);
              s.particles.push({
                x: m.x + m.w / 2,
                y: m.y - 12,
                text: `🍄 SUPER SALTO! COMBO x${s.combo}`,
                life: 35,
                vy: -2,
                color: '#f43f5e',
              });
            }
          });
        }

        // Screen bottom abyss pitfall check
        if (t.y > 450) {
          s.lives -= 1;
          setLives(s.lives);
          soundManager.playTarzanDamage();

          if (s.lives <= 0) {
            s.isGameOver = true;
            setIsGameOver(true);
            checkHighScore(s.score);
          } else {
            const respawnX = s.checkpoint.activated ? s.checkpoint.x : 80;
            const respawnY = s.checkpoint.activated ? s.checkpoint.y : 260;
            t.x = respawnX;
            t.y = respawnY;
            t.vx = 0;
            t.vy = -6;
            t.invulnerable = 90;
          }
        }

        // --- CHECKPOINT TOTEM COLLISION ---
        if (!s.checkpoint.activated && Math.hypot(t.x - s.checkpoint.x, t.y - s.checkpoint.y) < 60) {
          s.checkpoint.activated = true;
          soundManager.playCheckpointSound();
          s.score += 500;
          setScore(s.score);
          s.particles.push({
            x: s.checkpoint.x,
            y: s.checkpoint.y - 30,
            text: '🗿 CHECKPOINT ATIVADO! +500',
            life: 60,
            vy: -1.5,
            color: '#38bdf8',
          });
        }

        // --- CAMERA SMOOTH TRACKING ---
        const targetCamX = t.x - canvas.width * 0.35;
        s.cameraX += (targetCamX - s.cameraX) * 0.12;
        if (s.cameraX < 0) s.cameraX = 0;
        if (s.cameraX > s.levelWidth - canvas.width) s.cameraX = s.levelWidth - canvas.width;

        // Progress percentage calculation
        const percent = Math.min(100, Math.max(0, Math.floor((t.x / (s.goalTemple.x - 50)) * 100)));
        setDistancePercent(percent);

        // --- COCONUTS IN AIR WEAPON LOGIC ---
        s.coconutsInAir.forEach((c) => {
          if (!c.active) return;
          c.vy += 0.25;
          c.x += c.vx;
          c.y += c.vy;

          s.platforms.forEach((p) => {
            if (p.type === 'water') return;
            if (c.x > p.x && c.x < p.x + p.w && c.y > p.y && c.y < p.y + p.h) {
              c.active = false;
              soundManager.playCoconutHit();
            }
          });

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
              enemy.defeatTimer = 70;
              s.score += 250;
              setScore(s.score);
              soundManager.playCoconutHit();

              if (c.isSuper) {
                // Super coconut area explosion defeats all nearby enemies within 120px!
                soundManager.playTarzanSuperCoconutExplosion();
                s.enemies.forEach((other) => {
                  if (!other.isDefeated && Math.hypot(other.x - c.x, other.y - c.y) < 120) {
                    other.isDefeated = true;
                    other.defeatTimer = 70;
                    s.score += 200;
                  }
                });
                s.particles.push({
                  x: enemy.x + enemy.w / 2,
                  y: enemy.y - 12,
                  text: '💥 EXPLOSÃO DE COCO! +450',
                  life: 40,
                  vy: -2,
                  color: '#f97316',
                });
              } else {
                s.particles.push({
                  x: enemy.x + enemy.w / 2,
                  y: enemy.y - 12,
                  text: '💥 ACERTOU! +250',
                  life: 35,
                  vy: -2,
                  color: '#f59e0b',
                });
              }
            }
          });

          // Coconut hit on Boss Sabor (Stage 3)
          if (
            s.bossSabor.active &&
            s.bossSabor.hp > 0 &&
            c.x > s.bossSabor.x &&
            c.x < s.bossSabor.x + s.bossSabor.w &&
            c.y > s.bossSabor.y &&
            c.y < s.bossSabor.y + s.bossSabor.h
          ) {
            c.active = false;
            const dmg = c.isSuper ? 2 : 1;
            s.bossSabor.hp -= dmg;
            setBossHp(Math.max(0, s.bossSabor.hp));
            s.bossSabor.state = 'hurt';
            s.bossSabor.timer = 0;
            soundManager.playTarzanBossHit();
            s.particles.push({
              x: s.bossSabor.x + s.bossSabor.w / 2,
              y: s.bossSabor.y - 14,
              text: c.isSuper ? '💥 SUPER COCO NO CHEFE! -2 HP' : '💥 COCO NO CHEFE! -1 HP',
              life: 40,
              vy: -2,
              color: '#f97316',
            });
            if (s.bossSabor.hp <= 0) {
              s.bossSabor.state = 'defeated';
              s.bossSabor.defeatTimer = 100;
              s.score += 3000;
              setScore(s.score);
              soundManager.playTarzanVictory();
            }
          }

          if (c.x < s.cameraX - 60 || c.x > s.cameraX + canvas.width + 60 || c.y > 450) {
            c.active = false;
          }
        });

        // --- WILDLIFE & ENEMIES PATROL & COLLISION ---
        s.enemies.forEach((enemy) => {
          if (enemy.isDefeated) {
            enemy.defeatTimer--;
            return;
          }

          enemy.x += enemy.vx;
          if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.vx *= -1;
          }

          // Tantor Elephant Trample Rampage!
          if (
            t.tantorElephantTimer > 0 &&
            t.x < enemy.x + enemy.w &&
            t.x + t.width > enemy.x &&
            t.y < enemy.y + enemy.h &&
            t.y + t.height > enemy.y
          ) {
            enemy.isDefeated = true;
            enemy.defeatTimer = 80;
            s.score += 350;
            setScore(s.score);
            soundManager.playElephantRoar();

            s.particles.push({
              x: enemy.x + enemy.w / 2,
              y: enemy.y - 14,
              text: '🐘 ATROPELADO! +350',
              life: 40,
              vy: -2,
              color: '#38bdf8',
            });
            return;
          }

          // Regular collision with Tarzan
          if (
            t.x < enemy.x + enemy.w &&
            t.x + t.width > enemy.x &&
            t.y < enemy.y + enemy.h &&
            t.y + t.height > enemy.y
          ) {
            // Jump stomp from above
            if (t.vy > 0 && t.y + t.height - t.vy <= enemy.y + 14) {
              enemy.isDefeated = true;
              enemy.defeatTimer = 70;
              t.vy = -11;
              t.canDoubleJump = true;
              t.hasDoubleJumped = false;
              s.score += 300;
              setScore(s.score);
              soundManager.playTarzanJump();

              s.particles.push({
                x: enemy.x + enemy.w / 2,
                y: enemy.y - 10,
                text: '🐾 PISÃO! +300',
                life: 30,
                vy: -2,
                color: '#34d399',
              });
            } else if (t.invulnerable <= 0) {
              // Check if Shield absorbs hit
              if (t.hasShield) {
                t.hasShield = false;
                setHasShield(false);
                t.invulnerable = 60;
                t.vy = -6;
                t.vx = t.facingRight ? -3 : 3;
                soundManager.playTarzanDamage();
                s.particles.push({
                  x: t.x + 16,
                  y: t.y - 10,
                  text: '🛡️ ESCUDO ABSORVEU O DANO!',
                  life: 40,
                  vy: -1.5,
                  color: '#38bdf8',
                });
              } else {
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
          }
        });

        // --- COLLECTIBLES & POWER-UPS LOGIC ---
        s.collectibles.forEach((item) => {
          if (!item.collected) {
            if (
              t.x < item.x + 24 &&
              t.x + t.width > item.x &&
              t.y < item.y + 24 &&
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
                  color: '#d97706',
                });
              } else if (item.type === 'shield') {
                t.hasShield = true;
                setHasShield(true);
                s.score += 200;
                setScore(s.score);
                soundManager.playCheckpointSound();

                s.particles.push({
                  x: item.x,
                  y: item.y,
                  text: '🛡️ ESCUDO DA SELVA!',
                  life: 45,
                  vy: -2,
                  color: '#38bdf8',
                });
              } else if (item.type === 'elephant') {
                t.tantorElephantTimer = 600; // 10 seconds of Tantor Rampage!
                s.score += 500;
                setScore(s.score);
                soundManager.playElephantRoar();

                s.particles.push({
                  x: item.x,
                  y: item.y - 15,
                  text: '🐘 FÚRIA DO ELEFANTE TANTOR!',
                  life: 60,
                  vy: -2,
                  color: '#fbbf24',
                });
              } else if (item.type === 'goldenBanana') {
                s.bananas += 5;
                s.score += 500;
                setBananas(s.bananas);
                setScore(s.score);
                soundManager.playTarzanGoldenRelic();
                s.particles.push({
                  x: item.x,
                  y: item.y - 15,
                  text: '🍌 BANANA DOURADA! +500',
                  life: 45,
                  vy: -2,
                  color: '#facc15',
                });
              } else if (item.type === 'superCoconut') {
                s.superCoconuts += 3;
                setSuperCoconuts(s.superCoconuts);
                s.score += 300;
                setScore(s.score);
                soundManager.playTarzanSuperCoconutExplosion();
                s.particles.push({
                  x: item.x,
                  y: item.y - 15,
                  text: '🔥 3X SUPER COCOS EXPLOSIVOS!',
                  life: 50,
                  vy: -2,
                  color: '#f97316',
                });
              } else if (item.type === 'monkey') {
                t.hasMonkeyAlly = true;
                setHasMonkey(true);
                s.score += 400;
                setScore(s.score);
                soundManager.playTarzanGoldenRelic();
                s.particles.push({
                  x: item.x,
                  y: item.y - 15,
                  text: '🐵 MACAQUINHO AMIGO ENTROU!',
                  life: 60,
                  vy: -2,
                  color: '#34d399',
                });
              } else if (item.type === 'idol') {
                s.score += 1000;
                setScore(s.score);
                soundManager.playTarzanVictory();

                s.particles.push({
                  x: item.x,
                  y: item.y,
                  text: '🗿 ÍDOLO SAGRADO! +1000',
                  life: 55,
                  vy: -2,
                  color: '#fbbf24',
                });
              }
            }
          }
        });

        // --- BOSS SABOR UPDATE & COMBAT (STAGE 3 CLIMAX) ---
        if (s.currentStage === 3 && s.bossSabor.active) {
          const boss = s.bossSabor;
          if (boss.defeatTimer > 0) {
            boss.defeatTimer--;
            if (boss.defeatTimer === 0) {
              boss.active = false;
            }
          } else {
            boss.timer++;

            // Boss AI: Patrol -> Roar -> Pounce
            if (boss.state === 'patrol') {
              boss.x += boss.vx;
              if (boss.x < 2640 || boss.x > 2920) {
                boss.vx *= -1;
              }
              if (boss.timer > 130) {
                boss.state = 'roar';
                boss.timer = 0;
                soundManager.playTarzanBossRoar();
                s.particles.push({
                  x: boss.x + boss.w / 2,
                  y: boss.y - 15,
                  text: '🐯 SABOR RUGE! CUIDADO!',
                  life: 35,
                  vy: -1.5,
                  color: '#ef4444',
                });
              }
            } else if (boss.state === 'roar') {
              if (boss.timer > 40) {
                boss.state = 'pounce';
                boss.timer = 0;
                const dirToTarzan = t.x < boss.x ? -1 : 1;
                boss.vx = dirToTarzan * 7;
                boss.vy = -7.5;
              }
            } else if (boss.state === 'pounce') {
              boss.x += boss.vx;
              boss.vy += 0.55;
              boss.y += boss.vy;
              if (boss.y >= 250) {
                boss.y = 250;
                boss.vy = 0;
                boss.state = 'patrol';
                boss.timer = 0;
                boss.vx = boss.x > 2780 ? -1.8 : 1.8;
              }
            } else if (boss.state === 'hurt') {
              if (boss.timer > 30) {
                boss.state = 'patrol';
                boss.timer = 0;
              }
            }

            // Sabor collision with Tarzan
            if (
              t.x < boss.x + boss.w &&
              t.x + t.width > boss.x &&
              t.y < boss.y + boss.h &&
              t.y + t.height > boss.y
            ) {
              // Stomp from above
              if (t.vy > 0 && t.y + t.height - t.vy <= boss.y + 16 && boss.state !== 'hurt') {
                boss.hp -= 1;
                setBossHp(boss.hp);
                boss.state = 'hurt';
                boss.timer = 0;
                t.vy = -12;
                t.canDoubleJump = true;
                soundManager.playTarzanBossHit();
                s.particles.push({
                  x: boss.x + boss.w / 2,
                  y: boss.y - 15,
                  text: `💥 GOLPE NO CHEFE! HP: ${boss.hp}/${boss.maxHp}`,
                  life: 40,
                  vy: -2,
                  color: '#fbbf24',
                });

                if (boss.hp <= 0) {
                  boss.state = 'defeated';
                  boss.defeatTimer = 100;
                  s.score += 3000;
                  setScore(s.score);
                  soundManager.playTarzanVictory();
                  s.particles.push({
                    x: boss.x + boss.w / 2,
                    y: boss.y - 25,
                    text: '🏆 SABOR DERROTADO! +3000',
                    life: 80,
                    vy: -2.5,
                    color: '#34d399',
                  });
                }
              } else if (t.invulnerable <= 0 && boss.state !== 'hurt') {
                if (t.hasShield) {
                  t.hasShield = false;
                  setHasShield(false);
                  t.invulnerable = 60;
                  t.vy = -6;
                  t.vx = t.facingRight ? -4 : 4;
                  soundManager.playTarzanDamage();
                } else {
                  s.lives -= 1;
                  setLives(s.lives);
                  soundManager.playTarzanDamage();
                  soundManager.playTarzanBossRoar();
                  if (s.lives <= 0) {
                    s.isGameOver = true;
                    setIsGameOver(true);
                    checkHighScore(s.score);
                  } else {
                    t.invulnerable = 90;
                    t.vy = -8;
                    t.vx = t.facingRight ? -5 : 5;
                  }
                }
              }
            }
          }
        }

        // --- GOAL TEMPLE VICTORY CHECK ---
        const temple = s.goalTemple;
        // In stage 3, if Sabor is still active and has HP, entrance is blocked!
        if (s.currentStage === 3 && s.bossSabor.active && s.bossSabor.hp > 0) {
          if (t.x + t.width >= temple.x - 10) {
            t.x = temple.x - 10 - t.width;
            t.vx = -4;
            s.particles.push({
              x: temple.x + 30,
              y: temple.y + 40,
              text: '🔒 DERROTE SABOR PRIMEIRO!',
              life: 30,
              vy: -1,
              color: '#f87171',
            });
          }
        } else if (!temple.reached && t.x + t.width >= temple.x + 30) {
          temple.reached = true;
          s.isGameWon = true;
          setIsGameWon(true);
          const bonus = 2500 + s.bananas * 60;
          s.score += bonus;
          setScore(s.score);
          checkHighScore(s.score);
          soundManager.playTarzanVictory();

          s.particles.push({
            x: temple.x + 80,
            y: temple.y + 20,
            text: `🏛️ TEMPLO CONQUISTADO! +${bonus}`,
            life: 90,
            vy: -1.2,
            color: '#34d399',
          });
        }

        // --- AMBIENT LEAVES & BUTTERFLIES UPDATE ---
        s.ambientLeaves.forEach((leaf) => {
          leaf.x += leaf.vx;
          leaf.y += leaf.vy;
          leaf.rotation += 0.03;
          if (leaf.y > 420) {
            leaf.y = -20;
            leaf.x = s.cameraX + Math.random() * canvas.width;
          }
        });

        s.butterflies.forEach((b) => {
          b.x += b.vx;
          b.y += b.vy;
          b.wingFrame += 0.25;
          if (Math.random() < 0.02) b.vx = (Math.random() - 0.5) * 1.8;
          if (Math.random() < 0.02) b.vy = (Math.random() - 0.5) * 1.2;
        });

        // Particles update
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) s.particles.splice(i, 1);
        }
      }

      // ==========================================
      // CANVAS RENDERING (HIGH DEFINITION RAINFOREST)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. Background Sky & Atmospheric Lighting ---
      const stageSkyColors: Record<TarzanStage, [string, string, string]> = {
        1: ['#064e3b', '#047857', '#022c22'], // Canopy emerald
        2: ['#0f766e', '#0284c7', '#083344'], // River rapid cyan
        3: ['#701a75', '#4c0519', '#1e1b4b'], // Mystical Twilight Ruin
      };
      const [skyTop, skyMid, skyBottom] = stageSkyColors[s.currentStage];

      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(0.5, skyMid);
      skyGrad.addColorStop(1, skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tropical Sunbeams
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#fde047';
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(80 + i * 130, 0);
        ctx.lineTo(140 + i * 130, 0);
        ctx.lineTo(280 + i * 150, canvas.height);
        ctx.lineTo(210 + i * 150, canvas.height);
        ctx.fill();
      }
      ctx.restore();

      // Distant Parallax Hills (Layer 1)
      ctx.save();
      const p1 = (s.cameraX * 0.15) % 240;
      ctx.fillStyle = '#064e3b';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (let x = -p1; x < canvas.width + 120; x += 110) {
        ctx.arc(x, 280, 85, 0, Math.PI, true);
      }
      ctx.fill();
      ctx.restore();

      // Background Waterfalls
      s.waterfalls.forEach((wf) => {
        const drawX = wf.x - s.cameraX;
        if (drawX > -100 && drawX < canvas.width + 100) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.fillRect(drawX, wf.y, wf.w, wf.h);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.5;
          const timeOffset = (Date.now() / 35) % 20;
          for (let ly = timeOffset; ly < wf.h; ly += 16) {
            ctx.beginPath();
            ctx.moveTo(drawX + 4, ly);
            ctx.lineTo(drawX + wf.w - 4, ly + 5);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(drawX + wf.w / 2, wf.h - 10, wf.w * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- WORLD TRANSLATION ---
      ctx.save();
      ctx.translate(-s.cameraX, 0);

      // --- 2. Platforms & Structures ---
      s.platforms.forEach((p) => {
        if (p.x + p.w < s.cameraX - 100 || p.x > s.cameraX + canvas.width + 100) return;

        if (p.type === 'branch') {
          ctx.fillStyle = '#451a03';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = '#15803d';
          ctx.fillRect(p.x, p.y, p.w, 10);
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(p.x, p.y, p.w, 3);

          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 2;
          for (let vx = p.x + 20; vx < p.x + p.w - 20; vx += 35) {
            ctx.beginPath();
            ctx.moveTo(vx, p.y + p.h);
            ctx.quadraticCurveTo(vx + 6, p.y + p.h + 16, vx - 4, p.y + p.h + 24);
            ctx.stroke();
          }
        } else if (p.type === 'bridge') {
          ctx.fillStyle = '#78350f';
          for (let bx = p.x; bx < p.x + p.w; bx += 14) {
            ctx.fillRect(bx, p.y + 6, 10, 12);
          }
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 12);
          ctx.quadraticCurveTo(p.x + p.w / 2, p.y + 2, p.x + p.w, p.y - 12);
          ctx.stroke();
        } else if (p.type === 'log') {
          const logOffset = p.floatOffset ? Math.sin(Date.now() / 400 + p.floatOffset) * 6 : 0;
          ctx.fillStyle = '#713f12';
          ctx.fillRect(p.x, p.y + logOffset, p.w, p.h);
          ctx.fillStyle = '#a16207';
          ctx.fillRect(p.x, p.y + logOffset, p.w, 4);
        } else if (p.type === 'ruin') {
          ctx.fillStyle = '#334155';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          for (let bx = p.x + 20; bx < p.x + p.w; bx += 30) {
            ctx.strokeRect(bx, p.y, 28, 20);
          }
          ctx.fillStyle = '#15803d';
          ctx.fillRect(p.x, p.y, p.w, 6);
        } else if (p.type === 'water') {
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          const waveShift = (Date.now() / 150) % 30;
          for (let wx = p.x + waveShift; wx < p.x + p.w; wx += 25) {
            ctx.fillRect(wx, p.y + 3, 12, 3);
          }
        }
      });

      // --- 3. Checkpoint Totem ---
      const cp = s.checkpoint;
      if (cp.x > s.cameraX - 100 && cp.x < s.cameraX + canvas.width + 100) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(cp.x - 12, cp.y - 44, 24, 44);
        ctx.fillStyle = cp.activated ? '#38bdf8' : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(cp.x, cp.y - 34, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = cp.activated ? '#38bdf8' : '#64748b';
        ctx.fillRect(cp.x - 6, cp.y - 36, 4, 4);
        ctx.fillRect(cp.x + 2, cp.y - 36, 4, 4);

        if (cp.activated) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(cp.x - 14, cp.y - 46, 28, 48);
        }
      }

      // --- 4. Goal Temple (End of Stage) ---
      const temple = s.goalTemple;
      if (temple.x + temple.w > s.cameraX - 100 && temple.x < s.cameraX + canvas.width + 100) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(temple.x, temple.y, temple.w, temple.h);
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(temple.x - 15, temple.y);
        ctx.lineTo(temple.x + temple.w / 2, temple.y - 50);
        ctx.lineTo(temple.x + temple.w + 15, temple.y);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(temple.x + temple.w / 2 - 25, temple.y + 70, 50, temple.h - 70);

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(temple.x + temple.w / 2, temple.y + 40, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 5. Swinging Vines with Peak Indicator ---
      s.vines.forEach((vine, idx) => {
        const isSwingingOnThis = s.tarzan.isSwinging && s.tarzan.currentVineIndex === idx;
        const isPeakRelease = isSwingingOnThis && Math.abs(vine.angle) > 0.35;

        const tipX = vine.anchorX + Math.sin(vine.angle) * vine.length;
        const tipY = vine.anchorY + Math.cos(vine.angle) * vine.length;

        ctx.strokeStyle = isPeakRelease ? '#facc15' : '#15803d';
        ctx.lineWidth = isPeakRelease ? 5 : 3.5;
        ctx.beginPath();
        ctx.moveTo(vine.anchorX, vine.anchorY);
        ctx.quadraticCurveTo(
          (vine.anchorX + tipX) / 2 + Math.sin(vine.angle) * 15,
          (vine.anchorY + tipY) / 2,
          tipX,
          tipY
        );
        ctx.stroke();

        ctx.fillStyle = '#166534';
        for (let l = 0.2; l < 0.9; l += 0.2) {
          const lx = vine.anchorX + (tipX - vine.anchorX) * l;
          const ly = vine.anchorY + (tipY - vine.anchorY) * l;
          ctx.beginPath();
          ctx.ellipse(lx + 5, ly, 6, 3, vine.angle, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isPeakRelease) {
          ctx.fillStyle = '#fde047';
          ctx.font = 'black 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ ÁPICE! PULE!', tipX, tipY + 28);
        }
      });

      // --- 6. Wildlife & Enemies Rendering ---
      s.enemies.forEach((enemy) => {
        if (enemy.defeatTimer > 0) {
          ctx.save();
          ctx.globalAlpha = enemy.defeatTimer / 70;
        }

        if (enemy.type === 'jaguar') {
          ctx.fillStyle = '#d97706';
          ctx.fillRect(enemy.x, enemy.y + 6, enemy.w, enemy.h - 6);
          const headX = enemy.vx > 0 ? enemy.x + enemy.w - 6 : enemy.x - 4;
          ctx.fillRect(headX, enemy.y, 10, 12);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(headX + (enemy.vx > 0 ? 6 : 2), enemy.y + 3, 2, 2);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(enemy.x + 8, enemy.y + 10, 4, 3);
          ctx.fillRect(enemy.x + 18, enemy.y + 12, 4, 3);
          ctx.fillRect(enemy.x + 28, enemy.y + 9, 3, 3);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(enemy.x + 4, enemy.y + enemy.h - 4, 4, 6);
          ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + enemy.h - 4, 4, 6);
        } else if (enemy.type === 'croc') {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(enemy.x, enemy.y + 6, enemy.w, enemy.h - 6);
          ctx.fillStyle = '#166534';
          for (let rx = enemy.x + 6; rx < enemy.x + enemy.w - 10; rx += 8) {
            ctx.beginPath();
            ctx.moveTo(rx, enemy.y + 6);
            ctx.lineTo(rx + 4, enemy.y);
            ctx.lineTo(rx + 8, enemy.y + 6);
            ctx.fill();
          }
          const snoutX = enemy.vx > 0 ? enemy.x + enemy.w : enemy.x - 8;
          ctx.fillStyle = '#14532d';
          ctx.fillRect(snoutX, enemy.y + 8, 10, 8);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(snoutX + (enemy.vx > 0 ? 2 : 6), enemy.y + 6, 3, 3);
        } else if (enemy.type === 'snake') {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#065f46';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(enemy.x + (enemy.vx > 0 ? enemy.w : -4), enemy.y + 8, 5, 2);
        } else if (enemy.type === 'monkey') {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(enemy.x + 4, enemy.y + 6, enemy.w - 8, enemy.h - 6);
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.w / 2, enemy.y + 4, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(enemy.x + (enemy.vx > 0 ? enemy.w - 4 : -2), enemy.y + 8, 4, 3);
        }

        if (enemy.defeatTimer > 0) {
          ctx.restore();
        }
      });

      // --- 7. Collectibles & Power-Ups ---
      const nowMs = Date.now() / 250;
      s.collectibles.forEach((item) => {
        if (item.collected) return;
        const bob = Math.sin(nowMs + item.bobOffset) * 4;

        if (item.type === 'banana') {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(item.x + 8, item.y + 8 + bob, 8, 0.4, 2.8);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#eab308';
          ctx.stroke();
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(item.x + 14, item.y + 4 + bob, 3, 3);
        } else if (item.type === 'coconut') {
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
        } else if (item.type === 'shield') {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10 + bob, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText('🛡️', item.x + 4, item.y + 14 + bob);
        } else if (item.type === 'elephant') {
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10 + bob, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px sans-serif';
          ctx.fillText('🐘', item.x + 2, item.y + 14 + bob);
        } else if (item.type === 'idol') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(item.x + 2, item.y + 2 + bob, 16, 20);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(item.x + 5, item.y + 6 + bob, 10, 8);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10 + bob, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'goldenBanana') {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(item.x + 8, item.y + 8 + bob, 10, 0.4, 2.8);
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#facc15';
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText('✨', item.x + 4, item.y + 12 + bob);
        } else if (item.type === 'superCoconut') {
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(item.x + 9, item.y + 9 + bob, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText('🔥', item.x + 4, item.y + 13 + bob);
        } else if (item.type === 'monkey') {
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10 + bob, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px sans-serif';
          ctx.fillText('🐵', item.x + 2, item.y + 14 + bob);
        }
      });

      // --- 8. Coconuts in Flight (Normal & Super Flame) ---
      s.coconutsInAir.forEach((c) => {
        if (!c.active) return;
        ctx.save();
        if (c.isSuper) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.stroke();
          // Flame trail particle
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(c.x - (c.vx > 0 ? 6 : -6), c.y + (Math.random() - 0.5) * 4, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      });

      // --- 9. Ambient Falling Leaves & Butterflies ---
      s.ambientLeaves.forEach((leaf) => {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size * 1.5, leaf.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      s.butterflies.forEach((b) => {
        const flap = Math.sin(b.wingFrame) * 4;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x - 3, b.y, 4, 3 + flap, 0.4, 0, Math.PI * 2);
        ctx.ellipse(b.x + 3, b.y, 4, 3 + flap, -0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 9.5 Bouncy Mushrooms ---
      s.mushrooms.forEach((m) => {
        if (m.x + m.w < s.cameraX - 50 || m.x > s.cameraX + canvas.width + 50) return;
        ctx.save();
        ctx.translate(m.x + m.w / 2, m.y + m.h);
        ctx.scale(1, m.bounceScale);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-6, -m.h, 12, m.h);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -m.h, 18, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-8, -m.h - 6, 3, 0, Math.PI * 2);
        ctx.arc(6, -m.h - 8, 3.5, 0, Math.PI * 2);
        ctx.arc(0, -m.h - 13, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- Boss Sabor Rendering (Stage 3) ---
      if (s.currentStage === 3 && s.bossSabor && s.bossSabor.active) {
        const b = s.bossSabor;
        ctx.save();
        if (b.defeatTimer > 0) {
          ctx.globalAlpha = b.defeatTimer / 100;
        }
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(b.x + b.w / 2, b.y + b.h, b.w * 0.6, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = b.state === 'hurt' ? '#fca5a5' : '#ea580c';
        ctx.fillRect(b.x, b.y + 6, b.w, b.h - 6);

        ctx.fillStyle = '#431407';
        ctx.fillRect(b.x + 8, b.y + 12, 5, 4);
        ctx.fillRect(b.x + 20, b.y + 10, 6, 4);
        ctx.fillRect(b.x + 34, b.y + 14, 5, 4);

        const headX = b.vx > 0 ? b.x + b.w - 6 : b.x - 8;
        ctx.fillStyle = b.state === 'hurt' ? '#fca5a5' : '#c2410c';
        ctx.fillRect(headX, b.y, 16, 16);

        ctx.fillStyle = '#facc15';
        ctx.fillRect(headX + (b.vx > 0 ? 10 : 2), b.y + 4, 4, 3);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(headX + (b.vx > 0 ? 12 : 3), b.y + 5, 2, 2);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(headX + (b.vx > 0 ? 12 : 0), b.y + 12, 3, 5);

        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const tailX = b.vx > 0 ? b.x : b.x + b.w;
        ctx.moveTo(tailX, b.y + 10);
        ctx.quadraticCurveTo(tailX + (b.vx > 0 ? -12 : 12), b.y - 10, tailX + (b.vx > 0 ? -18 : 18), b.y + 4);
        ctx.stroke();

        if (b.hp > 0) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(b.x - 10, b.y - 20, b.w + 20, 8);
          ctx.fillStyle = '#ef4444';
          const hpWidth = Math.max(0, ((b.w + 18) * b.hp) / b.maxHp);
          ctx.fillRect(b.x - 9, b.y - 19, hpWidth, 6);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`🐯 SABOR ${b.hp}/${b.maxHp}`, b.x + b.w / 2, b.y - 24);
        }
        ctx.restore();
      }

      // --- 10. Tarzan Character Rendering ---
      const t = s.tarzan;
      if (t.invulnerable <= 0 || Math.floor(Date.now() / 60) % 2 === 0) {
        ctx.save();
        ctx.translate(t.x + t.width / 2, t.y + t.height / 2);

        if (!t.facingRight) ctx.scale(-1, 1);

        if (t.isSwinging && t.currentVineIndex !== null) {
          const vine = s.vines[t.currentVineIndex];
          ctx.rotate(vine.angle * 0.7);
        } else if (t.isJumping && t.hasDoubleJumped) {
          ctx.rotate(t.somersaultAngle);
        }

        // Tantor Rampage Aura or Dash Ghost Aura
        if (t.tantorElephantTimer > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Shield Aura
        if (t.hasShield) {
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Monkey Companion Ally (Terk/Chita)
        if (t.hasMonkeyAlly) {
          const mX = -20;
          const mY = -8 + Math.sin(Date.now() / 200) * 3;
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(mX, mY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(mX + 2, mY + 1, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (t.isSliding) {
          // --- Sliding Tree-Surf Pose ---
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-12, 0, 24, 10);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(-6, 2, 12, 8);
          // Head low
          ctx.fillStyle = '#fcd34d';
          ctx.beginPath();
          ctx.arc(10, 2, 7, 0, Math.PI * 2);
          ctx.fill();
          // Wild Hair blowing back
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.moveTo(6, -2);
          ctx.lineTo(-14, -6);
          ctx.lineTo(-2, 4);
          ctx.fill();
          // Legs trailing back
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-18, 4, 10, 5);
        } else {
          // --- Regular Stand / Run / Jump Pose ---
          // Head
          ctx.fillStyle = '#fcd34d';
          ctx.beginPath();
          ctx.arc(0, -14, 8, 0, Math.PI * 2);
          ctx.fill();

          // Green Headband
          ctx.fillStyle = '#15803d';
          ctx.fillRect(-8, -17, 16, 3);
          // Feather
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.moveTo(-7, -17);
          ctx.lineTo(-12, -26);
          ctx.lineTo(-5, -20);
          ctx.fill();

          // Wild Hair
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.moveTo(-8, -18);
          ctx.quadraticCurveTo(-15, -6, -11, 4);
          ctx.lineTo(-4, -10);
          ctx.lineTo(4, -18);
          ctx.fill();

          // Muscular Torso with shading
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-6, -6, 12, 16);
          ctx.fillStyle = '#d97706';
          ctx.fillRect(-1, -4, 2, 12); // chest abs line

          // Leopard Print Loincloth
          ctx.fillStyle = '#eab308';
          ctx.fillRect(-7, 8, 14, 10);
          ctx.fillStyle = '#451a03';
          ctx.fillRect(-4, 11, 3, 2);
          ctx.fillRect(2, 13, 3, 2);

          // Arms
          ctx.fillStyle = '#f59e0b';
          if (t.isSwinging) {
            ctx.fillRect(-2, -26, 4, 18);
            ctx.fillRect(2, -24, 4, 16);
          } else if (t.isJumping) {
            ctx.fillRect(4, -10, 14, 4);
            ctx.fillRect(-14, -8, 12, 4);
          } else {
            const armSwing = Math.sin(t.runFrame) * 6;
            ctx.fillRect(2, -4 + armSwing, 4, 12);
            ctx.fillRect(-6, -4 - armSwing, 4, 12);
          }

          // Legs
          if (t.isSwinging) {
            ctx.fillRect(-5, 18, 4, 12);
            ctx.fillRect(1, 16, 4, 10);
          } else if (t.isJumping) {
            ctx.fillRect(-8, 16, 5, 12);
            ctx.fillRect(4, 14, 5, 14);
          } else {
            const legSwing = Math.sin(t.runFrame) * 7;
            ctx.fillRect(-5, 18 + legSwing, 4, 12);
            ctx.fillRect(1, 18 - legSwing, 4, 12);
          }
        }

        ctx.restore();
      }

      // --- 11. Floating Particles & Score Popups ---
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
    return () => {
      cancelAnimationFrame(animationFrameId);
      soundManager.stopJungleTribalBGM();
    };
  }, [initStageData, checkHighScore]);

  // Touch handlers for mobile buttons
  const handleTouchStart = (action: 'left' | 'right' | 'jump' | 'slide') => {
    const s = gameStateRef.current;
    if (action === 'left') s.keys.left = true;
    if (action === 'right') s.keys.right = true;
    if (action === 'jump') handleJumpAction();
    if (action === 'slide') handleSlideAction();
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump' | 'slide') => {
    const s = gameStateRef.current;
    if (action === 'left') s.keys.left = false;
    if (action === 'right') s.keys.right = false;
    if (action === 'jump') s.keys.jump = false;
    if (action === 'slide') s.keys.slide = false;
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

  const stageNames: Record<TarzanStage, string> = {
    1: 'Fase 1: Copa das Árvores 🌿',
    2: 'Fase 2: Corredeiras dos Crocodilos 🐊',
    3: 'Fase 3: O Templo Perdido 🏛️',
  };

  const maxLivesByDiff = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 2 : 3;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Stage Bar Selector & Difficulty */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-2.5 sm:p-3 mb-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mr-1 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5" />
            Fase:
          </span>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setupStage(num as TarzanStage, true)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                currentStage === num
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {stageNames[num as TarzanStage]}
            </button>
          ))}
        </div>

        {/* Difficulty Selector & BGM Toggle */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <div className="flex items-center bg-slate-950/70 p-0.5 rounded-xl border border-emerald-950">
            {(['easy', 'normal', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => handleSetDifficulty(d)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  difficulty === d
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Dificuldade: ${d === 'easy' ? 'Fácil (5 Vidas)' : d === 'normal' ? 'Normal (3 Vidas)' : 'Rei da Selva (2 Vidas)'}`}
              >
                {d === 'easy' ? '🌿 Fácil' : d === 'normal' ? '🌴 Normal' : '👑 Difícil'}
              </button>
            ))}
          </div>

          <button
            onClick={handleToggleBgm}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 border transition-all cursor-pointer text-[11px] ${
              isBgmActive
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar Batucada da Selva (Percussão Tribal BGM)"
          >
            <Music className="w-3 h-3 text-amber-400" />
            <span>{isBgmActive ? '🥁 Batucada ON' : '🥁 Batucada OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main HUD Card */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-3 sm:p-4 mb-2 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
          {/* Hearts / Lives */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>VIDAS</span>
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-white flex gap-0.5">
              {Array.from({ length: maxLivesByDiff }).map((_, i) => (
                <span
                  key={i}
                  className={i < lives ? 'text-rose-500' : 'text-slate-700 opacity-30'}
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
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <span>COCOS</span>
              {superCoconuts > 0 && <span className="text-rose-400 font-extrabold animate-pulse">🔥{superCoconuts}</span>}
            </div>
            <div className="text-base sm:text-xl font-mono font-black text-amber-500 flex items-center gap-1 justify-center">
              <span>🥥 {coconuts}</span>
            </div>
          </div>

          {/* Score & Combo */}
          <div className="bg-slate-950/70 border border-emerald-950 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <span>PONTOS</span>
              {combo > 1 && <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">x{combo}!</span>}
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
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title={isPaused ? 'Continuar' : 'Pausar'}
              id="tarzan-btn-pause"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title={isMuted ? 'Ativar Sons da Selva' : 'Silenciar'}
              id="tarzan-btn-sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={restartGame}
              className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 transition-colors cursor-pointer"
              title="Reiniciar Floresta"
              id="tarzan-btn-restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boss Bar & Active Power-Ups Banner */}
        <div className="mt-2.5 pt-2 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center flex-wrap gap-1.5">
            {hasShield && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 font-bold">
                <Shield className="w-3 h-3 fill-current text-sky-400" />
                Escudo Ativo
              </span>
            )}
            {elephantTime > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold animate-pulse">
                🐘 Fúria Tantor: {elephantTime}s
              </span>
            )}
            {hasMonkey && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                🐵 Macaquinho Aliado (Imã de Bananas)
              </span>
            )}
            {superCoconuts > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
                🔥 Super Cocos Explosivos: {superCoconuts}
              </span>
            )}
          </div>

          {/* Boss Encounter HUD indicator */}
          {bossHp !== null && bossHp > 0 && (
            <div className="flex items-center gap-2 bg-rose-950/50 border border-rose-800/60 px-3 py-1 rounded-xl">
              <span className="font-black text-rose-300 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Sabor, o Leopardo:
              </span>
              <div className="w-24 bg-slate-950 h-3 rounded-full overflow-hidden border border-rose-700/60">
                <div
                  className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(bossHp / 5) * 100}%` }}
                />
              </div>
              <span className="font-mono font-bold text-amber-300 text-[11px]">{bossHp}/5</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini-map level tracker */}
      <div className="w-full max-w-4xl px-3 py-1 mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 font-bold text-emerald-400">
          <span>🌿 Início</span>
        </span>
        <div className="flex-1 mx-3 h-2 bg-slate-900 rounded-full overflow-hidden border border-emerald-950 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-100"
            style={{ width: `${distancePercent}%` }}
          />
          {/* Checkpoint mark at 50% */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-sky-400/80 -translate-x-1/2" title="Checkpoint Totem" />
        </div>
        <span className="flex items-center gap-1 font-bold text-amber-300">
          <span>{currentStage === 3 ? '🐯 Chefe / 🏛️ Templo' : '🏛️ Templo'}</span>
        </span>
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
                A selva venceu desta vez! Pontuação Final:{' '}
                <strong className="text-amber-400 font-mono">{score}</strong>
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer"
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
                VITÓRIA NA SELVA! 🌴
              </div>
              <p className="text-slate-300 text-sm mb-5">
                Você conquistou a {stageNames[currentStage]} e recuperou o Ídolo Sagrado! Pontuação:{' '}
                <strong className="text-amber-400 font-mono text-base">{score} pts</strong>
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNextStage}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white font-black text-sm shadow-xl transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>{currentStage < 3 ? 'Avançar para Próxima Fase' : 'Jogar Novamente'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={restartGame}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                >
                  Repetir Fase
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons Bar (Desktop Quick-Triggers & Mobile On-Screen Controls) */}
      <div className="w-full max-w-4xl mt-3 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-3">
        {/* Special Actions: Throw Coconut, Jungle Yell, Dash */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleThrowCoconut}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/40 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md cursor-pointer"
            title="Lançar Coco (Tecla X)"
            id="btn-throw-coconut"
          >
            <span>🥥 Atirar Coco</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(X)</span>
          </button>

          <button
            onClick={handleTarzanYell}
            disabled={!canYell}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md cursor-pointer ${
              canYell
                ? 'bg-emerald-700/30 hover:bg-emerald-700/50 border-emerald-500/40 text-emerald-200'
                : 'bg-slate-800 border-slate-700 text-slate-500 opacity-60'
            }`}
            title="Grito da Selva (Tecla Z)"
            id="btn-jungle-yell"
          >
            <span>📢 Grito da Selva</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(Z)</span>
          </button>

          <button
            onClick={handleTarzanDash}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-sky-700/30 hover:bg-sky-700/50 border border-sky-500/40 text-sky-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md cursor-pointer"
            title="Arrancada / Esquiva (Tecla C ou Shift)"
            id="btn-jungle-dash"
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>⚡ Dash</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(C)</span>
          </button>
          <button
            onClick={handleSlideAction}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md cursor-pointer"
            title="Deslizar na Rama (Tecla S ou Seta Baixo)"
            id="btn-jungle-slide"
          >
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
            <span>💨 Deslizar</span>
            <span className="text-[10px] opacity-60 hidden sm:inline">(S/↓)</span>
          </button>
        </div>

        {/* Directional, Slide & Jump Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            className="p-3 rounded-xl bg-slate-800 active:bg-emerald-700 border border-slate-700 text-slate-200 select-none touch-none shadow-md cursor-pointer"
            aria-label="Mover para esquerda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onTouchStart={() => handleTouchStart('slide')}
            onTouchEnd={() => handleTouchEnd('slide')}
            onMouseDown={() => handleTouchStart('slide')}
            onMouseUp={() => handleTouchEnd('slide')}
            className="p-3 rounded-xl bg-slate-800 active:bg-amber-700 border border-slate-700 text-amber-300 select-none touch-none shadow-md cursor-pointer"
            aria-label="Deslizar"
            title="Deslizar"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            className="p-3 rounded-xl bg-slate-800 active:bg-emerald-700 border border-slate-700 text-slate-200 select-none touch-none shadow-md cursor-pointer"
            aria-label="Mover para direita"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={() => handleTouchEnd('jump')}
            onMouseDown={() => handleTouchStart('jump')}
            onMouseUp={() => handleTouchEnd('jump')}
            className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 active:from-emerald-700 active:to-teal-700 text-white font-black text-sm select-none touch-none flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
            id="btn-tarzan-jump"
          >
            <ArrowUp className="w-4 h-4" />
            <span>PULAR / DUPLO SALTO 🌀</span>
          </button>
        </div>
      </div>

      {/* Instructions & Record Banner */}
      <div className="w-full max-w-4xl mt-3 p-3 bg-emerald-950/40 border border-emerald-800/30 rounded-xl text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-emerald-400 font-bold">🌿 Movimentos & Recursos:</span>
          <span>
            [Espaço/W] <strong>Salto Duplo</strong> • [S/↓] <strong>💨 Deslize</strong> • [C/Shift] <strong>⚡ Dash</strong> •
            [X] <strong>🥥 Atirar Coco (🔥 Super Coco)</strong> • [Z] <strong>📢 Grito</strong> •
            🍄 <strong>Cogumelos Saltitantes</strong> • 🐵 <strong>Macaquinho Aliado</strong> • 🐯 <strong>Chefe Sabor (Fase 3)</strong>!
          </span>
        </div>
        <div className="flex items-center space-x-1 font-bold text-amber-300 shrink-0">
          <Trophy className="w-3.5 h-3.5" />
          <span>Recorde Selva: {highScore > 0 ? `${highScore} pts` : '--'}</span>
        </div>
      </div>
    </div>
  );
};
