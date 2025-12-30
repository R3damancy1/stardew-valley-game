/* Pixel Art Nostalgia - Shop Component
 * Buy seeds and supplies
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import type { CropType } from '@/types/game';
import { SEED_COST } from '@/types/game';
import { toast } from 'sonner';

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

export default function Shop() {
  const { gameState, buySeeds } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const handleBuy = (cropType: CropType) => {
    const amount = 5;
    const cost = SEED_COST[cropType] * amount;
    
    if (buySeeds(cropType, amount)) {
      toast.success(`购买成功！`, {
        description: `${cropEmojis[cropType]} ${cropNames[cropType]}种子 x${amount} (-${cost}金币)`,
      });
    } else {
      toast.error('金币不足！', {
        description: `需要 ${cost} 金币`,
      });
    }
  };

  return (
    <div className="pixel-panel p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs" style={{ fontFamily: 'var(--font-pixel-title)' }}>
          🏪 商店
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          {isOpen ? '收起' : '展开'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          <p className="text-[9px] text-muted-foreground">
            每次购买5个种子
          </p>
          {(Object.keys(SEED_COST) as CropType[]).map((crop) => (
            <div
              key={crop}
              className="pixel-border p-2 bg-card flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{cropEmojis[crop]}</span>
                <div>
                  <div className="text-[10px]">{cropNames[crop]}</div>
                  <div className="text-[9px] text-muted-foreground">
                    {SEED_COST[crop]}金币/个
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleBuy(crop)}
                disabled={gameState.player.money < SEED_COST[crop] * 5}
                className="pixel-border px-2 py-1 bg-accent hover:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground text-[9px] transition-colors"
              >
                买5个
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
