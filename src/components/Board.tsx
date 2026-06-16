// Componente do Tabuleiro

import React, { useEffect, useState, useRef } from 'react'
import { Cell } from './BaseComponents'
import { BoardCell, Position, Word } from '@types/index'

interface BoardProps {
  grid: BoardCell[][]
  selectedCells: Position[]
  foundWords: string[]
  words: Word[]
  onCellClick: (row: number, col: number) => void
  onCellMouseEnter?: (row: number, col: number) => void
  onSelectionEnd?: () => void
}

export const Board: React.FC<BoardProps> = ({
  grid,
  selectedCells,
  foundWords,
  words,
  onCellClick,
  onCellMouseEnter,
  onSelectionEnd,
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && selectedCells.length > 0) {
      drawSelectionLine()
    }
  }, [selectedCells])

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDrawing) {
        setIsDrawing(false)
        onSelectionEnd?.()
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [isDrawing, onSelectionEnd])

  const drawSelectionLine = () => {
    if (selectedCells.length < 2 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const cellSize = 56 // w-14 = 56px
    const cellGap = 4 // gap-1 = 4px
    const cellTotal = cellSize + cellGap

    ctx.strokeStyle = '#4ECDC4'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = 0.6

    const start = selectedCells[0]
    const startX = start.col * cellTotal + cellSize / 2
    const startY = start.row * cellTotal + cellSize / 2

    ctx.beginPath()
    ctx.moveTo(startX, startY)

    for (let i = 1; i < selectedCells.length; i++) {
      const cell = selectedCells[i]
      const x = cell.col * cellTotal + cellSize / 2
      const y = cell.row * cellTotal + cellSize / 2
      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }

  const getWordIdAtCell = (row: number, col: number): string[] => {
    return grid[row]?.[col]?.wordIds || []
  }

  const isCellFound = (row: number, col: number): boolean => {
    const wordIds = getWordIdAtCell(row, col)
    return wordIds.some(id => foundWords.includes(id))
  }

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(pos => pos.row === row && pos.col === col)
  }

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true)
    onCellClick(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      onCellMouseEnter?.(row, col)
    }
  }

  const boardWidth = grid[0]?.length || 0
  const boardHeight = grid.length
  const cellSize = 56
  const gap = 4
  const totalWidth = boardWidth * cellSize + (boardWidth - 1) * gap
  const totalHeight = boardHeight * cellSize + (boardHeight - 1) * gap

  return (
    <div
      ref={boardRef}
      className="relative inline-block"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => {
        setIsDrawing(false)
        onSelectionEnd?.()
      }}
    >
      <canvas
        ref={canvasRef}
        width={totalWidth}
        height={totalHeight}
        className="absolute inset-0 pointer-events-none"
      />

      <div
        className="grid gap-1 p-4 card"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              letter={cell.letter}
              isSelected={isCellSelected(rowIndex, colIndex)}
              isFound={isCellFound(rowIndex, colIndex)}
              isError={false}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  )
}
