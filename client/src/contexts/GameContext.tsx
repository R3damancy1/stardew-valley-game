/* Pixel Art Nostalgia - Game State Management
 * Centralized game state using React Context
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { GameState, Player, Tile, Position, ToolType, CropType, Direction } from '@/types/game';
import { GRID_WIDTH, GRID_HEIGHT, CROP_GROWTH_TIME, SEED_COST, CROP_PRICES } from '@/types/game';

interface GameContextType {
  gameState: GameState;
  movePlayer: (direction: Direction) => void;
  selectTool: (tool: ToolType) => void;
  useTool: (position: Position) => void;
  advanceDay: () => void;
  buySeeds: (cropType: CropType, amount: number) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const createInitialTiles = (): Tile[][] => {
  const tiles: Tile[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    tiles[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      tiles[y][x] = {
        position: { x, y },
        isPlowed: false,
        isWatered: false,
        crop: null,
        cropStage: 0,
      };
    }
  }
  return tiles;
};

const createInitialPlayer = (): Player => ({
  position: { x: 8, y: 6 },
  direction: 'down',
  currentTool: 'hoe',
  inventory: {
    seeds: {
      wheat: 10,
      carrot: 5,
      tomato: 3,
      corn: 2,
      potato: 5,
    },
    harvested: {
      wheat: 0,
      carrot: 0,
      tomato: 0,
      corn: 0,
      potato: 0,
    },
    water: 100,
  },
  energy: 100,
  money: 100,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    player: createInitialPlayer(),
    tiles: createInitialTiles(),
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    selectedTile: null,
    day: 1,
    time: 6, // Start at 6 AM
  });

  const movePlayer = useCallback((direction: Direction) => {
    setGameState((prev) => {
      const newPos = { ...prev.player.position };
      
      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, newPos.y - 1);
          break;
        case 'down':
          newPos.y = Math.min(GRID_HEIGHT - 1, newPos.y + 1);
          break;
        case 'left':
          newPos.x = Math.max(0, newPos.x - 1);
          break;
        case 'right':
          newPos.x = Math.min(GRID_WIDTH - 1, newPos.x + 1);
          break;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          position: newPos,
          direction,
        },
      };
    });
  }, []);

  const selectTool = useCallback((tool: ToolType) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        currentTool: tool,
      },
    }));
  }, []);

  const useTool = useCallback((position: Position) => {
    setGameState((prev) => {
      const { x, y } = position;
      if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return prev;

      const newTiles = prev.tiles.map(row => row.map(tile => ({ ...tile })));
      const tile = newTiles[y][x];
      const newPlayer = { ...prev.player };

      switch (prev.player.currentTool) {
        case 'hoe':
          if (!tile.isPlowed && newPlayer.energy >= 5) {
            tile.isPlowed = true;
            newPlayer.energy -= 5;
          }
          break;

        case 'wateringCan':
          if (tile.isPlowed && !tile.isWatered && newPlayer.inventory.water > 0 && newPlayer.energy >= 3) {
            tile.isWatered = true;
            newPlayer.inventory.water -= 1;
            newPlayer.energy -= 3;
          }
          break;

        case 'seeds':
          // For now, plant wheat by default. In full version, would have seed selection
          if (tile.isPlowed && !tile.crop && newPlayer.inventory.seeds.wheat > 0 && newPlayer.energy >= 5) {
            tile.crop = 'wheat';
            tile.cropStage = 1;
            newPlayer.inventory.seeds.wheat -= 1;
            newPlayer.energy -= 5;
          }
          break;

        case 'hand':
          if (tile.crop && tile.cropStage === 3 && newPlayer.energy >= 5) {
            const cropType = tile.crop;
            newPlayer.inventory.harvested[cropType] += 1;
            newPlayer.money += CROP_PRICES[cropType];
            tile.crop = null;
            tile.cropStage = 0;
            tile.isWatered = false;
            newPlayer.energy -= 5;
          }
          break;
      }

      return {
        ...prev,
        tiles: newTiles,
        player: newPlayer,
      };
    });
  }, []);

  const advanceDay = useCallback(() => {
    setGameState((prev) => {
      const newTiles = prev.tiles.map(row =>
        row.map(tile => {
          const newTile = { ...tile };
          
          // Grow crops if watered
          if (newTile.crop && newTile.isWatered && newTile.cropStage < 3) {
            newTile.cropStage = Math.min(3, newTile.cropStage + 1) as 0 | 1 | 2 | 3;
          }
          
          // Reset water status
          newTile.isWatered = false;
          
          return newTile;
        })
      );

      return {
        ...prev,
        tiles: newTiles,
        day: prev.day + 1,
        time: 6,
        player: {
          ...prev.player,
          energy: 100,
          inventory: {
            ...prev.player.inventory,
            water: 100,
          },
        },
      };
    });
  }, []);

  const buySeeds = useCallback((cropType: CropType, amount: number): boolean => {
    const cost = SEED_COST[cropType] * amount;
    
    if (gameState.player.money >= cost) {
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          money: prev.player.money - cost,
          inventory: {
            ...prev.player.inventory,
            seeds: {
              ...prev.player.inventory.seeds,
              [cropType]: prev.player.inventory.seeds[cropType] + amount,
            },
          },
        },
      }));
      return true;
    }
    return false;
  }, [gameState.player.money]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        movePlayer,
        selectTool,
        useTool,
        advanceDay,
        buySeeds,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
