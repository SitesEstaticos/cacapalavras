// Componente do Tabuleiro

import React, { useEffect, useRef, useState } from 'react'
import { Cell } from './BaseComponents'
import { BoardCell, Position, Word } from '@/types'

interface BoardProps {
  grid: BoardCell[][]
  selectedCells: Position[]
  foundWords: string[]
  foundWordColors: Record<string, string>
  words: Word[]
  disabled?: boolean
  onSelectionStart: (row: number, col: number) => void
  onSelectionMove: (row: number, col: number) => void
  onSelectionEnd?: () => void
  onSelectionCancel?: () => void
}

export const Board: React.FC<BoardProps> = ({
  grid,
  selectedCells,
  foundWords,
  foundWordColors,
  words,
  disabled = false,
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  onSelectionCancel,
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const activePointerId = useRef<number | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!disabled) return

    if (activePointerId.current !== null && boardRef.current?.hasPointerCapture(activePointerId.current)) {
      boardRef.current.releasePointerCapture(activePointerId.current)
    }
    setIsDrawing(false)
    activePointerId.current = null
  }, [disabled])

  const getWordIdAtCell = (row: number, col: number): string[] => {
    return grid[row]?.[col]?.wordIds || []
  }

  const getFoundWordIdAtCell = (row: number, col: number): string | undefined => {
    const wordIds = getWordIdAtCell(row, col)
    return wordIds.find(id => foundWords.includes(id))
  }

  const isCellFound = (row: number, col: number): boolean => {
    return Boolean(getFoundWordIdAtCell(row, col))
  }

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(pos => pos.row === row && pos.col === col)
  }

  const getCellFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = document.elementFromPoint(event.clientX, event.clientY)
    const cell = element?.closest<HTMLElement>('[data-board-cell="true"]')

    if (!cell || !boardRef.current?.contains(cell)) return null

    return {
      row: Number(cell.dataset.row),
      col: Number(cell.dataset.col),
    }
  }

  const releaseCapturedPointer = (pointerId: number | null) => {
    if (!boardRef.current || pointerId === null) return

    try {
      if (boardRef.current.hasPointerCapture(pointerId)) {
        boardRef.current.releasePointerCapture(pointerId)
      }
    } catch {
      // Ignore if browser already released capture
    }
  }

  const clearSelectionState = (shouldValidate = false) => {
    releaseCapturedPointer(activePointerId.current)
    setIsDrawing(false)
    activePointerId.current = null

    if (shouldValidate) {
      onSelectionEnd?.()
    }
  }

  const finishSelectionState = () => {
    clearSelectionState(true)
  }

  const cancelSelectionState = () => {
    clearSelectionState(false)
    onSelectionCancel?.()
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return

    if (activePointerId.current !== null) {
      cancelSelectionState()
    }

    const cell = getCellFromPointer(event)
    if (!cell) return

    event.preventDefault()
    activePointerId.current = event.pointerId

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Ignore capture failures on some browsers or rapid pointer changes
    }

    setIsDrawing(true)
    onSelectionStart(cell.row, cell.col)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !isDrawing || activePointerId.current !== event.pointerId) return

    event.preventDefault()
    const cell = getCellFromPointer(event)
    if (cell) onSelectionMove(cell.row, cell.col)
  }

  const finishSelection = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    event.preventDefault()
    finishSelectionState()
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    event.preventDefault()
    cancelSelectionState()
  }

  const handleLostPointerCapture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    cancelSelectionState()
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    event.preventDefault()
    cancelSelectionState()
  }

  useEffect(() => {
    if (!isDrawing || activePointerId.current === null) return

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (activePointerId.current !== event.pointerId) return
      cancelSelectionState()
    }

    const handleWindowPointerCancel = (event: PointerEvent) => {
      if (activePointerId.current !== event.pointerId) return
      cancelSelectionState()
    }

    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerCancel)
    window.addEventListener('lostpointercapture', handleWindowPointerCancel)

    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerCancel)
      window.removeEventListener('lostpointercapture', handleWindowPointerCancel)
    }
  }, [isDrawing])

  const boardWidth = grid[0]?.length || 0

  return (
    <div
      ref={boardRef}
      className={`word-search-board relative w-full max-w-full overflow-x-auto ${
        disabled ? 'opacity-75' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSelection}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <div
        className="word-search-grid grid gap-1 p-2 sm:p-4 card mx-auto"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
        }}
        aria-label={`Tabuleiro com ${words.length} palavras`}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const foundWordId = getFoundWordIdAtCell(rowIndex, colIndex)

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-board-cell="true"
                data-row={rowIndex}
                data-col={colIndex}
              >
                <Cell
                  letter={cell.letter}
                  isSelected={isCellSelected(rowIndex, colIndex)}
                  isFound={isCellFound(rowIndex, colIndex)}
                  isError={false}
                  foundColor={foundWordId ? foundWordColors[foundWordId] : undefined}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
