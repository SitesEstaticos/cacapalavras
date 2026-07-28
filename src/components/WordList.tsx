// Componente WordList - Lista de palavras a encontrar

import React from 'react'
import { Word, WordDirection, GameMode } from '@/types'

interface WordListProps {
  words: Word[]
  foundWords: string[]
  hintedDirections?: Record<string, string>
  gameMode?: GameMode
  onWordClick?: (wordId: string) => void
}

const DIRECTION_ARROWS: Record<string, string> = {
  horizontal: '➔',
  reverse_horizontal: '⬅',
  vertical: '⬇',
  reverse_vertical: '⬆',
  diagonal_down: '↘',
  reverse_diagonal_down: '↖',
  diagonal_up: '↗',
  reverse_diagonal_up: '↙',
}

export const WordList: React.FC<WordListProps> = ({
  words,
  foundWords,
  hintedDirections = {},
  gameMode = GameMode.CLASSIC,
  onWordClick,
}) => {
  const found = words.filter(w => foundWords.includes(w.id))
  const remaining = words.filter(w => !foundWords.includes(w.id))
  const isChallenge = gameMode === GameMode.CHALLENGE

  return (
    <div className="card-lg space-y-4">
      <h3 className="text-lg font-bold text-secondary">
        {isChallenge ? 'Desafio de Misteriosas' : 'Palavras'} ({found.length}/{words.length})
      </h3>

      {/* Palavras Encontradas */}
      {found.length > 0 && (
        <div>
          <h4 className="text-xs uppercase text-muted mb-2">Encontradas</h4>
          <div className="word-list space-y-1">
            {found.map(word => (
              <div
                key={word.id}
                className="word-item-found cursor-pointer text-center font-medium text-sm flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40"
                onClick={() => onWordClick?.(word.id)}
              >
                <span className="line-through text-emerald-500 font-bold">{word.text}</span>
                <span className="text-xs">✅</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Palavras Restantes */}
      {remaining.length > 0 && (
        <div>
          <h4 className="text-xs uppercase text-muted mb-2">
            {found.length > 0
              ? 'Ainda faltam'
              : isChallenge
              ? 'Palavras ocultas'
              : 'Encontre estas palavras'}
          </h4>
          <div className="word-list space-y-1">
            {remaining.map((word, index) => {
              const directionHint = hintedDirections[word.id] as WordDirection | undefined

              return (
                <div
                  key={word.id}
                  className="word-item cursor-pointer hover:bg-white hover:bg-opacity-10 text-left font-medium text-sm flex items-center justify-between gap-2 p-2 rounded-lg border border-gray-800 bg-dark-card"
                  onClick={() => onWordClick?.(word.id)}
                >
                  <span className="truncate">
                    {isChallenge ? `❓ Palavra Misteriosa #${index + 1}` : word.text}
                  </span>

                  {directionHint && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold shrink-0">
                      {DIRECTION_ARROWS[directionHint] || '💡'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mensagem de Conclusão */}
      {found.length === words.length && words.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-success bg-opacity-20 border border-success">
          <p className="text-success font-bold text-center">🎉 Parabéns! Jogo completo!</p>
        </div>
      )}
    </div>
  )
}