/* Pixel Art Nostalgia - Player Stats Component
 * Display player status information
 */

import { useGame } from '@/contexts/GameContext';

export default function PlayerStats() {
  const { gameState } = useGame();
  const { player, day, time } = gameState;

  return (
    <div className="pixel-panel p-4 space-y-3">
      <h3 className="text-xs text-center mb-3" style={{ fontFamily: 'var(--font-pixel-title)' }}>
        玩家状态
      </h3>
      
      <div className="space-y-2 text-xs">
        {/* Day and Time */}
        <div className="pixel-border p-2 bg-card">
          <div className="flex justify-between items-center">
            <span>第 {day} 天</span>
            <span>{time}:00</span>
          </div>
        </div>

        {/* Money */}
        <div className="pixel-border p-2 bg-card">
          <div className="flex justify-between items-center">
            <span>💰 金币</span>
            <span className="text-accent-foreground font-bold">{player.money}</span>
          </div>
        </div>

        {/* Energy */}
        <div className="pixel-border p-2 bg-card">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>⚡ 能量</span>
              <span>{player.energy}/100</span>
            </div>
            <div className="h-3 pixel-border bg-muted overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${player.energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Water */}
        <div className="pixel-border p-2 bg-card">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>💧 水量</span>
              <span>{player.inventory.water}/100</span>
            </div>
            <div className="h-3 pixel-border bg-muted overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ 
                  width: `${player.inventory.water}%`,
                  backgroundColor: '#87CEEB'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
