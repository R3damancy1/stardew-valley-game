/* Pixel Art Nostalgia - Game Canvas Component
 * Main game rendering using HTML5 Canvas with pixel-perfect rendering
 */

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { TILE_SIZE } from '@/types/game';
import type { Tile, CropStage } from '@/types/game';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const { gameState, useTool } = useGame();
  
  const canvasWidth = gameState.gridWidth * TILE_SIZE;
  const canvasHeight = gameState.gridHeight * TILE_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = '#6B8E23';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grass pattern
    for (let y = 0; y < gameState.gridHeight; y++) {
      for (let x = 0; x < gameState.gridWidth; x++) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        
        // Grass texture with slight variation
        const isLight = (x + y) % 2 === 0;
        ctx.fillStyle = isLight ? '#7BA428' : '#6B8E23';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        
        // Add some random darker spots for texture
        if ((x * 7 + y * 11) % 5 === 0) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(px + 4, py + 4, 8, 8);
        }
        
        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }

    // Draw tiles (plowed land, crops, etc.)
    gameState.tiles.forEach((row) => {
      row.forEach((tile) => {
        drawTile(ctx, tile);
      });
    });

    // Draw hover indicator
    if (hoveredTile) {
      const px = hoveredTile.x * TILE_SIZE;
      const py = hoveredTile.y * TILE_SIZE;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }

    // Draw player
    drawPlayer(ctx, gameState.player.position.x, gameState.player.position.y, gameState.player.direction);
  }, [gameState, canvasWidth, canvasHeight, hoveredTile]);

  const drawTile = (ctx: CanvasRenderingContext2D, tile: Tile) => {
    const px = tile.position.x * TILE_SIZE;
    const py = tile.position.y * TILE_SIZE;

    // Draw plowed land
    if (tile.isPlowed) {
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      
      // Furrow lines
      ctx.strokeStyle = '#6D5A47';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(px + 4, py + 8 + i * 8);
        ctx.lineTo(px + TILE_SIZE - 4, py + 8 + i * 8);
        ctx.stroke();
      }
      
      // Add some texture dots
      ctx.fillStyle = '#6D5A47';
      for (let i = 0; i < 4; i++) {
        const dotX = px + 6 + (i % 2) * 12;
        const dotY = py + 6 + Math.floor(i / 2) * 12;
        ctx.fillRect(dotX, dotY, 2, 2);
      }
    }

    // Draw water indicator
    if (tile.isWatered) {
      ctx.fillStyle = 'rgba(100, 150, 200, 0.35)';
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      
      // Water droplet effect
      ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
      ctx.fillRect(px + 8, py + 8, 3, 3);
      ctx.fillRect(px + 18, py + 14, 3, 3);
      ctx.fillRect(px + 14, py + 20, 3, 3);
    }

    // Draw crop
    if (tile.crop && tile.cropStage > 0) {
      drawCrop(ctx, px, py, tile.crop, tile.cropStage);
    }
  };

  const drawCrop = (ctx: CanvasRenderingContext2D, px: number, py: number, cropType: string, stage: CropStage) => {
    const centerX = px + TILE_SIZE / 2;
    const centerY = py + TILE_SIZE / 2;

    // Simplified crop rendering with more detail
    switch (stage) {
      case 1: // Sprout
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(centerX - 2, centerY + 2, 4, 6);
        ctx.fillStyle = '#7CCD7C';
        ctx.fillRect(centerX - 1, centerY + 3, 2, 4);
        break;
        
      case 2: // Growing
        ctx.fillStyle = '#228B22';
        ctx.fillRect(centerX - 5, centerY - 2, 10, 12);
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(centerX - 3, centerY, 6, 8);
        // Leaves
        ctx.fillStyle = '#3CB371';
        ctx.fillRect(centerX - 6, centerY + 2, 3, 3);
        ctx.fillRect(centerX + 3, centerY + 2, 3, 3);
        break;
        
      case 3: // Harvestable
        ctx.fillStyle = '#228B22';
        ctx.fillRect(centerX - 7, centerY, 14, 10);
        
        // Leaves detail
        ctx.fillStyle = '#2E8B57';
        ctx.fillRect(centerX - 8, centerY + 2, 4, 4);
        ctx.fillRect(centerX + 4, centerY + 2, 4, 4);
        
        // Crop-specific color
        let fruitColor = '#FFD700';
        if (cropType === 'tomato') fruitColor = '#DC143C';
        if (cropType === 'carrot') fruitColor = '#FF8C00';
        if (cropType === 'corn') fruitColor = '#F0E68C';
        if (cropType === 'potato') fruitColor = '#D2B48C';
        
        // Main produce
        ctx.fillStyle = fruitColor;
        ctx.fillRect(centerX - 4, centerY - 6, 8, 8);
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(centerX - 3, centerY - 5, 3, 3);
        break;
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, direction: string) => {
    const px = x * TILE_SIZE + TILE_SIZE / 2;
    const py = y * TILE_SIZE + TILE_SIZE / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(px - 6, py + 12, 12, 3);

    // Body (blue overalls)
    ctx.fillStyle = '#1976D2';
    ctx.fillRect(px - 6, py - 2, 12, 10);
    
    // Overalls straps
    ctx.fillStyle = '#1565C0';
    ctx.fillRect(px - 4, py - 2, 2, 6);
    ctx.fillRect(px + 2, py - 2, 2, 6);

    // Head (skin tone)
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(px - 5, py - 10, 10, 8);

    // Hat (golden straw)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(px - 7, py - 14, 14, 4);
    ctx.fillRect(px - 5, py - 16, 10, 2);
    
    // Hat detail
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(px - 6, py - 13, 12, 1);

    // Eyes (direction indicator)
    ctx.fillStyle = '#000000';
    if (direction === 'down') {
      ctx.fillRect(px - 3, py - 7, 2, 2);
      ctx.fillRect(px + 1, py - 7, 2, 2);
    } else if (direction === 'up') {
      ctx.fillRect(px - 3, py - 8, 2, 1);
      ctx.fillRect(px + 1, py - 8, 2, 1);
    } else if (direction === 'left') {
      ctx.fillRect(px - 3, py - 7, 2, 2);
    } else if (direction === 'right') {
      ctx.fillRect(px + 1, py - 7, 2, 2);
    }

    // Legs
    ctx.fillStyle = '#1565C0';
    ctx.fillRect(px - 5, py + 8, 4, 6);
    ctx.fillRect(px + 1, py + 8, 4, 6);
    
    // Shoes
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(px - 5, py + 12, 4, 2);
    ctx.fillRect(px + 1, py + 12, 4, 2);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);

    useTool({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);

    if (x >= 0 && x < gameState.gridWidth && y >= 0 && y < gameState.gridHeight) {
      setHoveredTile({ x, y });
    } else {
      setHoveredTile(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredTile(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleCanvasMouseLeave}
      className="pixel-border bg-background cursor-crosshair"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
