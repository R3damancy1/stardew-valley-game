/* Pixel Art Nostalgia - Toolbar Component
 * Tool selection UI with pixel art styling
 */

import { useGame } from '@/contexts/GameContext';
import type { ToolType } from '@/types/game';

const tools: { type: ToolType; name: string; icon: string }[] = [
  { type: 'hoe', name: '锄头', icon: '⚒️' },
  { type: 'wateringCan', name: '洒水壶', icon: '💧' },
  { type: 'seeds', name: '种子', icon: '🌱' },
  { type: 'hand', name: '收获', icon: '✋' },
];

export default function Toolbar() {
  const { gameState, selectTool } = useGame();

  return (
    <div className="pixel-panel p-3 space-y-2">
      <h3 className="text-xs text-center mb-3" style={{ fontFamily: 'var(--font-pixel-title)' }}>
        工具栏
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => selectTool(tool.type)}
            className={`
              pixel-border p-3 transition-colors text-center
              ${
                gameState.player.currentTool === tool.type
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground hover:bg-muted'
              }
            `}
          >
            <div className="text-2xl mb-1">{tool.icon}</div>
            <div className="text-[10px]" style={{ fontFamily: 'var(--font-pixel-body)' }}>
              {tool.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
