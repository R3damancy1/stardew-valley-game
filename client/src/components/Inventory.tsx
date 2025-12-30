/* Pixel Art Nostalgia - Inventory Component
 * Display seeds and harvested crops
 */

import { useGame } from '@/contexts/GameContext';
import type { CropType } from '@/types/game';

const cropEmojis: { [key in CropType]: string } = {
  wheat: '🌾',
  carrot: '🥕',
  tomato: '🍅',
  corn: '🌽',
  potato: '🥔',
};

const cropNames: { [key in CropType]: string } = {
  wheat: '小麦',
  carrot: '胡萝卜',
  tomato: '番茄',
  corn: '玉米',
  potato: '土豆',
};

export default function Inventory() {
  const { gameState } = useGame();
  const { player } = gameState;

  return (
    <div className="pixel-panel p-4 space-y-3">
      <h3 className="text-xs text-center mb-3" style={{ fontFamily: 'var(--font-pixel-title)' }}>
        背包
      </h3>

      {/* Seeds */}
      <div>
        <h4 className="text-[10px] mb-2 text-muted-foreground">种子</h4>
        <div className="space-y-1">
          {(Object.keys(player.inventory.seeds) as CropType[]).map((crop) => (
            <div
              key={crop}
              className="pixel-border p-2 bg-card flex justify-between items-center text-xs"
            >
              <span>
                {cropEmojis[crop]} {cropNames[crop]}
              </span>
              <span className="font-bold">{player.inventory.seeds[crop]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Harvested */}
      <div>
        <h4 className="text-[10px] mb-2 text-muted-foreground">收获</h4>
        <div className="space-y-1">
          {(Object.keys(player.inventory.harvested) as CropType[]).map((crop) => {
            const amount = player.inventory.harvested[crop];
            if (amount === 0) return null;
            return (
              <div
                key={crop}
                className="pixel-border p-2 bg-card flex justify-between items-center text-xs"
              >
                <span>
                  {cropEmojis[crop]} {cropNames[crop]}
                </span>
                <span className="font-bold text-accent-foreground">{amount}</span>
              </div>
            );
          })}
          {Object.values(player.inventory.harvested).every((v) => v === 0) && (
            <div className="text-[10px] text-muted-foreground text-center py-2">
              还没有收获
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
