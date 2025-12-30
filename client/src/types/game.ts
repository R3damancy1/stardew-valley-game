/* Pixel Art Nostalgia - Game Type Definitions
 * Core data structures for the farming game
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export type ToolType = 'hoe' | 'wateringCan' | 'seeds' | 'hand';

export type CropType = 'wheat' | 'carrot' | 'tomato' | 'corn' | 'potato';

export type CropStage = 0 | 1 | 2 | 3; // 0: empty, 1-2: growing, 3: harvestable

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  direction: Direction;
  currentTool: ToolType;
  inventory: Inventory;
  energy: number;
  money: number;
}

export interface Inventory {
  seeds: { [key in CropType]: number };
  harvested: { [key in CropType]: number };
  water: number;
}

export interface Tile {
  position: Position;
  isPlowed: boolean;
  isWatered: boolean;
  crop: CropType | null;
  cropStage: CropStage;
}

export interface GameState {
  player: Player;
  tiles: Tile[][];
  gridWidth: number;
  gridHeight: number;
  selectedTile: Position | null;
  day: number;
  time: number; // 0-24 hours
}

export const TILE_SIZE = 32; // pixels
export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 12;

export const CROP_PRICES: { [key in CropType]: number } = {
  wheat: 10,
  carrot: 15,
  tomato: 20,
  corn: 25,
  potato: 12,
};

export const CROP_GROWTH_TIME: { [key in CropType]: number } = {
  wheat: 3, // days
  carrot: 4,
  tomato: 5,
  corn: 6,
  potato: 4,
};

export const SEED_COST: { [key in CropType]: number } = {
  wheat: 5,
  carrot: 8,
  tomato: 10,
  corn: 12,
  potato: 6,
};
