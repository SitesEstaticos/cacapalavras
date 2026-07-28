// Componentes de Modais

import React from 'react'
import { Button } from './BaseComponents'
import DisplayAd from './DisplayAd'
import { WordSegment } from '@/types'
import { contentRegistry } from '@/services/ContentRegistry'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:text-secondary transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 text-light">{children}</div>

        <div className="flex gap-3 justify-end">
          {actions || (
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface HintModalProps {
  isOpen: boolean
  onClose: () => void
  onUseHint: () => void
  onWatchAd: () => void
  hintsRemaining: number
  hint: string
  isLoading?: boolean
  isCooldownActive?: boolean
  cooldownSeconds?: number
  statusMessage?: string
  canUseHint?: boolean
  showAdSlot?: boolean
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  onUseHint,
  onWatchAd,
  hintsRemaining,
  hint,
  isLoading = false,
  isCooldownActive = false,
  cooldownSeconds = 0,
  statusMessage,
  canUseHint = true,
  showAdSlot = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dica">
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary bg-opacity-20 border border-secondary">
          <p className="text-lg font-medium whitespace-pre-line">{hint}</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-secondary font-medium">Carregando anúncio...</p>
        ) : isCooldownActive ? (
          <p className="text-sm text-secondary font-medium">
            Disponível em {cooldownSeconds} segundo{cooldownSeconds === 1 ? '' : 's'}.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted">
              {canUseHint
                ? `Você tem ${hintsRemaining} dica${hintsRemaining !== 1 ? 's' : ''} disponível${hintsRemaining !== 1 ? 's' : ''} para esta partida.`
                : 'Suas dicas gratuitas de hoje acabaram.'}
            </p>
            <p className="text-sm text-secondary font-medium">
              {canUseHint
                ? 'Use uma dica agora.'
                : 'Assista a um anúncio para ganhar +1 dica!'}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {canUseHint && (
                <Button variant="primary" onClick={onUseHint} className="flex-1">
                  Usar Dica
                </Button>
              )}
              {!canUseHint && (
                <Button variant="secondary" onClick={onWatchAd} className="flex-1">
                  📺 Assistir Anúncio
                </Button>
              )}
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </>
        )}

        {showAdSlot && !isLoading && !isCooldownActive && !canUseHint && (
          <div className="rounded-lg border border-secondary/30 bg-dark/60 p-3 mt-3">
            <p className="text-xs uppercase tracking-wide text-muted mb-2">Anúncio patrocinado</p>
            <div className="min-h-[250px]">
              <DisplayAd slot="7716746018" className="w-full" style={{ minHeight: '250px' }} />
            </div>
          </div>
        )}

        {statusMessage && !isLoading && (
          <p className="text-sm text-secondary font-medium">{statusMessage}</p>
        )}
      </div>
    </Modal>
  )
}

interface GameOverModalProps {
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  onBackToMenu?: () => void 
  score: number
  time: number
  wordsFound: number
  totalWords: number
  isVictory: boolean
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  onBackToMenu,
  score,
  time,
  wordsFound,
  totalWords,
  isVictory,
}) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const accuracy = totalWords > 0 ? Math.round((wordsFound / totalWords) * 100) : 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVictory ? '🎉 Vitória!' : '⏸️ Jogo Pausado'}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-white bg-opacity-5">
            <p className="text-xs text-muted mb-1">Pontos</p>
            <p className="text-3xl font-bold text-secondary">{score}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white bg-opacity-5">
            <p className="text-xs text-muted mb-1">Tempo</p>
            <p className="text-3xl font-bold text-secondary">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white bg-opacity-5">
            <p className="text-xs text-muted mb-1">Palavras</p>
            <p className="text-3xl font-bold text-secondary">
              {wordsFound}/{totalWords}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white bg-opacity-5">
            <p className="text-xs text-muted mb-1">Acurácia</p>
            <p className="text-3xl font-bold text-secondary">
              {accuracy}%
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onRestart} className="flex-1">
            Novo Jogo
          </Button>
          {/* 💡 Botão agora executa onBackToMenu se fornecido, ou apenas fecha o modal */}
          <Button variant="ghost" onClick={onBackToMenu || onClose} className="flex-1">
            Menu
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface DifficultyModalProps {
  isOpen: boolean
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({ isOpen, onSelect }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="text-2xl font-bold text-secondary mb-6">Escolha a Dificuldade</h2>

        <div className="space-y-3">
          <button
            onClick={() => onSelect('easy')}
            className="w-full p-4 rounded-xl bg-green-500 bg-opacity-20 border border-green-500 hover:bg-opacity-30 transition-all text-left"
          >
            <p className="font-bold text-green-400">🟢 Fácil</p>
            <p className="text-sm text-muted">Horizontal e Vertical</p>
          </button>

          <button
            onClick={() => onSelect('medium')}
            className="w-full p-4 rounded-xl bg-yellow-500 bg-opacity-20 border border-yellow-500 hover:bg-opacity-30 transition-all text-left"
          >
            <p className="font-bold text-yellow-400">🟡 Médio</p>
            <p className="text-sm text-muted">+ Diagonais</p>
          </button>

          <button
            onClick={() => onSelect('hard')}
            className="w-full p-4 rounded-xl bg-red-500 bg-opacity-20 border border-red-500 hover:bg-opacity-30 transition-all text-left"
          >
            <p className="font-bold text-red-400">🔴 Difícil</p>
            <p className="text-sm text-muted">+ Palavras invertidas</p>
          </button>
        </div>
      </div>
    </div>
  )
}

interface SegmentModalProps {
  isOpen: boolean
  onSelect: (segment: WordSegment) => void
}

export const SegmentModal: React.FC<SegmentModalProps> = ({ isOpen, onSelect }) => {
  if (!isOpen) return null

  const categories = contentRegistry?.getCategories ? contentRegistry.getCategories() : []

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="text-2xl font-bold text-secondary mb-2">Escolha o Segmento</h2>
        <p className="text-sm text-muted mb-6">Selecione o tema das palavras deste jogo.</p>

        <div className="space-y-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id as WordSegment)}
              className="w-full p-4 rounded-xl bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 transition-all text-left"
            >
              <p className="font-bold text-secondary">{cat.name}</p>
              {cat.description && (
                <p className="text-sm text-muted">{cat.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}