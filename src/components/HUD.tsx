// Componente HUD (Heads-Up Display)

import React from 'react'
import { HUDItem, ProgressBar, Tooltip } from './BaseComponents'

interface HUDProps {
  score: number
  time: number
  wordsFound: number
  totalWords: number
  hintsAvailable: number
  difficulty: string
  onHintClick?: () => void
  hintButtonLabel?: string
  hintButtonDisabled?: boolean
  hintStatusText?: string
}

export const HUD: React.FC<HUDProps> = ({
  score,
  time,
  wordsFound,
  totalWords,
  hintsAvailable,
  difficulty,
  onHintClick,
  hintButtonLabel,
  hintButtonDisabled,
  hintStatusText,
}) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const percentProgress = Math.round((wordsFound / totalWords) * 100)

  return (
    <div className="space-y-4">
      {/* Scores and Stats Row */}
      <div className="hud">
        <HUDItem label="Pontos" value={score} />
        <HUDItem label="Tempo" value={timeFormatted} />
        <HUDItem label="Palavras" value={`${wordsFound}/${totalWords}`} />
        <div className="hud-section">
          <Tooltip text={`Dificuldade: ${difficulty}`}>
            <span className="hud-label">Dificuldade</span>
          </Tooltip>
          <span className="badge badge-primary text-xs">{difficulty}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card-lg">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-muted">Progresso</span>
          <span className="text-sm font-bold text-secondary">{percentProgress}%</span>
        </div>
        <ProgressBar current={wordsFound} total={totalWords} animated />
      </div>

      {/* Hints Section */}
      <div className="card-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-sm text-muted block">Dicas disponíveis</span>
          <span className="text-2xl font-bold text-secondary">{hintsAvailable}</span>
          <p className="text-xs text-muted mt-1">{hintStatusText || 'Use uma dica para revelar o início de uma palavra.'}</p>
        </div>
        {onHintClick && (
          <button
            onClick={onHintClick}
            disabled={hintButtonDisabled}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              hintButtonDisabled
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
                : 'bg-secondary text-dark hover:scale-105'
            }`}
          >
            {hintButtonLabel || `💡 Dica (${hintsAvailable})`}
          </button>
        )}
      </div>
    </div>
  )
}
