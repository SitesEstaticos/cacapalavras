// Componentes de Modais
import React from 'react';
import { Button } from './BaseComponents';
export const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen)
        return null;
    return (<div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none hover:text-secondary transition-colors">
            ✕
          </button>
        </div>

        <div className="mb-6 text-light">{children}</div>

        <div className="flex gap-3 justify-end">
          {actions || (<Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>)}
        </div>
      </div>
    </div>);
};
export const HintModal = ({ isOpen, onClose, onUseHint, onWatchAd, hintsRemaining, hint, }) => {
    return (<Modal isOpen={isOpen} onClose={onClose} title="Dica">
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary bg-opacity-20 border border-secondary">
          <p className="text-lg font-medium">{hint}</p>
        </div>

        {hintsRemaining > 0 ? (<>
            <p className="text-sm text-muted">
              Você tem <span className="text-secondary font-bold">{hintsRemaining}</span> dica
              {hintsRemaining !== 1 ? 's' : ''} gratuita{hintsRemaining !== 1 ? 's' : ''} hoje.
            </p>
            <div className="flex gap-2">
              <Button variant="primary" onClick={onUseHint} className="flex-1">
                Usar Dica
              </Button>
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </>) : (<>
            <p className="text-sm text-muted">Suas dicas gratuitas de hoje acabaram.</p>
            <p className="text-sm text-secondary font-medium">
              Assista a um anúncio para ganhar +1 dica!
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onWatchAd} className="flex-1">
                📺 Assistir Anúncio
              </Button>
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </>)}
      </div>
    </Modal>);
};
export const GameOverModal = ({ isOpen, onClose, onRestart, score, time, wordsFound, totalWords, isVictory, }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (<Modal isOpen={isOpen} onClose={onClose} title={isVictory ? '🎉 Vitória!' : '⏸️ Jogo Pausado'}>
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
              {Math.round((wordsFound / totalWords) * 100)}%
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onRestart} className="flex-1">
            Novo Jogo
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Menu
          </Button>
        </div>
      </div>
    </Modal>);
};
export const DifficultyModal = ({ isOpen, onSelect }) => {
    if (!isOpen)
        return null;
    return (<div className="modal-overlay">
      <div className="modal">
        <h2 className="text-2xl font-bold text-secondary mb-6">Escolha a Dificuldade</h2>

        <div className="space-y-3">
          <button onClick={() => onSelect('easy')} className="w-full p-4 rounded-xl bg-green-500 bg-opacity-20 border border-green-500 hover:bg-opacity-30 transition-all text-left">
            <p className="font-bold text-green-400">🟢 Fácil</p>
            <p className="text-sm text-muted">Horizontal e Vertical</p>
          </button>

          <button onClick={() => onSelect('medium')} className="w-full p-4 rounded-xl bg-yellow-500 bg-opacity-20 border border-yellow-500 hover:bg-opacity-30 transition-all text-left">
            <p className="font-bold text-yellow-400">🟡 Médio</p>
            <p className="text-sm text-muted">+ Diagonais</p>
          </button>

          <button onClick={() => onSelect('hard')} className="w-full p-4 rounded-xl bg-red-500 bg-opacity-20 border border-red-500 hover:bg-opacity-30 transition-all text-left">
            <p className="font-bold text-red-400">🔴 Difícil</p>
            <p className="text-sm text-muted">+ Palavras invertidas</p>
          </button>
        </div>
      </div>
    </div>);
};
