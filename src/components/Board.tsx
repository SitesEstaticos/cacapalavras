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

    // Impede rolagem e seleção de texto ao tocar
    if (event.cancelable) event.preventDefault()

    activePointerId.current = event.pointerId

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Ignore capture failures on some browsers
    }

    setIsDrawing(true)
    onSelectionStart(cell.row, cell.col)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !isDrawing || activePointerId.current !== event.pointerId) return

    if (event.cancelable) event.preventDefault()

    const cell = getCellFromPointer(event)
    if (cell) onSelectionMove(cell.row, cell.col)
  }

  const finishSelection = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    if (event.cancelable) event.preventDefault()
    finishSelectionState()
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

    if (event.cancelable) event.preventDefault()
    cancelSelectionState()
  }

  const handleLostPointerCapture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activePointerId.current !== event.pointerId) return

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
      className={`word-search-board relative w-full max-w-full overflow-x-auto select-none ${
        disabled ? 'opacity-75' : ''
      }`}
      style={{
        touchAction: 'none', // 💡 Impede scroll, pull-to-refresh e gestos no celular
        WebkitUserSelect: 'none', // 💡 Desativa seleção de texto no iOS/Safari
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSelection}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <div
        className="word-search-grid grid gap-1 p-2 sm:p-4 card mx-auto select-none"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
          touchAction: 'none',
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
                className="select-none"
                style={{
                  touchAction: 'none',
                  WebkitTapHighlightColor: 'transparent', // 💡 Elimina o escurecido/flash cinza ao clicar
                }}
              >
                <Cell
                  letter={cell.letter}
                  isSelected={isCellSelected(rowIndex, colIndex)}
                  isFound={isCellFound(rowIndex, colIndex)}
                  isHinted={cell.isHinted}
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