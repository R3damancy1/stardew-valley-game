/* Pixel Art Nostalgia - Main Game Page
 * Layout: Fixed grid with game canvas center, UI panels on sides
 * Design: Pixel-perfect alignment, retro gaming aesthetic
 */

import GameCanvas from '@/components/GameCanvas';
import Toolbar from '@/components/Toolbar';
import PlayerStats from '@/components/PlayerStats';
import Inventory from '@/components/Inventory';
import GameControls from '@/components/GameControls';
import Shop from '@/components/Shop';

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #E8F5E9 100%)',
      }}
    >
      {/* Header */}
      <header className="pixel-border bg-card border-b-4 border-border">
        <div className="container py-4">
          <h1 
            className="text-center text-xs sm:text-sm md:text-base"
            style={{ fontFamily: 'var(--font-pixel-title)' }}
          >
            🌾 星露谷农场 🌾
          </h1>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 container py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-3 md:gap-4 items-start max-w-[1400px] mx-auto">
          {/* Left Panel - Tools and Stats */}
          <div className="space-y-3 md:space-y-4 order-2 lg:order-1">
            <Toolbar />
            <PlayerStats />
          </div>

          {/* Center - Game Canvas */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="inline-block w-full max-w-full overflow-auto">
              <div className="inline-block min-w-min">
                <GameCanvas />
              </div>
              <div className="mt-3 pixel-panel p-2 md:p-3 bg-card">
                <p className="text-[9px] md:text-[10px] text-center text-muted-foreground">
                  点击地块使用当前工具 | 使用方向键或WASD移动角色
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Inventory and Controls */}
          <div className="space-y-3 md:space-y-4 order-3">
            <Inventory />
            <Shop />
            <GameControls />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pixel-border bg-card border-t-4 border-border">
        <div className="container py-2 md:py-3">
          <p className="text-[9px] md:text-[10px] text-center text-muted-foreground">
            像素艺术怀旧主义 | 受星露谷物语启发的农场模拟游戏
          </p>
        </div>
      </footer>
    </div>
  );
}
