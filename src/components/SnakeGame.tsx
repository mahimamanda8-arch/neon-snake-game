import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const nextDirection = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') nextDirection.current = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') nextDirection.current = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') nextDirection.current = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') nextDirection.current = 'RIGHT'; break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        setDirection(nextDirection.current);

        switch (nextDirection.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check walls
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00f3ff' : '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = i === 0 ? '#00f3ff' : '#ff00ff';
      ctx.fillRect(segment.x * cellSize + 2, segment.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });

    // Food
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Glitch effect on canvas occasionally
    if (Math.random() > 0.95) {
      ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 50, 2);
    }
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center p-4 glitch-border bg-black/40 backdrop-blur-sm">
      <div className="w-full flex justify-between mb-4 font-mono text-xl text-cyan-400 uppercase tracking-widest">
        <span>SCORE: {score.toString().padStart(5, '0')}</span>
        <span>STATUS: {isGameOver ? 'TERMINATED' : isPaused ? 'HALTED' : 'OPERATIONAL'}</span>
      </div>
      
      <div className="relative border border-cyan-500/30 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-5xl font-mono text-magenta-500 glitch-text mb-4">CRITICAL FAILURE</h2>
            <p className="text-cyan-400 mb-8 font-mono">CONNECTION TERMINATED. SCORE SAVED: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-900/30 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-4xl font-mono text-cyan-400 animate-pulse uppercase tracking-[0.5em]">SYSTEM_PAUSED</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs font-mono text-cyan-700 uppercase tracking-tight text-center">
        ARROWS to NAVIGATE // SPACE to PAUSE // COLLISION = FATAL
      </div>
    </div>
  );
}
