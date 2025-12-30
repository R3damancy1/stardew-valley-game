/* Pixel Art Nostalgia - Game Controls Component
 * Controls for day advancement and keyboard movement
 */

import { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import type { Direction } from '@/types/game';

export default function GameControls() {
  const { gameState, movePlayer, advanceDay } = useGame();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: Direction } = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        movePlayer(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="pixel-panel p-4 space-y-3">
      <h3 className="text-xs text-center mb-3" style={{ fontFamily: 'var(--font-pixel-title)' }}>
        游戏控制
      </h3>

      {/* Movement buttons */}
      <div>
        <h4 className="text-[10px] mb-2 text-muted-foreground">移动</h4>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => movePlayer('up')}
            className="pixel-border p-2 bg-card hover:bg-muted text-center text-lg"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => movePlayer('left')}
            className="pixel-border p-2 bg-card hover:bg-muted text-center text-lg"
          >
            ←
          </button>
          <button
            onClick={() => movePlayer('down')}
            className="pixel-border p-2 bg-card hover:bg-muted text-center text-lg"
          >
            ↓
          </button>
          <button
            onClick={() => movePlayer('right')}
            className="pixel-border p-2 bg-card hover:bg-muted text-center text-lg"
          >
            →
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground text-center mt-2">
          或使用方向键/WASD
        </p>
      </div>

      {/* Day advancement */}
      <div>
        <button
          onClick={advanceDay}
          disabled={gameState.player.energy < 20}
          className="w-full pixel-border p-3 bg-accent hover:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground text-xs transition-colors"
        >
          🌙 睡觉 (进入下一天)
        </button>
        {gameState.player.energy < 20 && (
          <p className="text-[9px] text-destructive text-center mt-1">
            能量不足，无法睡觉
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="pixel-border p-3 bg-card">
        <h4 className="text-[10px] mb-2 font-bold">操作说明</h4>
        <ul className="text-[9px] space-y-1 text-muted-foreground">
          <li>1. 选择工具</li>
          <li>2. 点击地块使用工具</li>
          <li>3. 锄地 → 浇水 → 种植</li>
          <li>4. 每天浇水促进生长</li>
          <li>5. 成熟后收获作物</li>
        </ul>
      </div>
    </div>
  );
}
