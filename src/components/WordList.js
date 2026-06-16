// Componente WordList - Lista de palavras a encontrar
import React from 'react';
export const WordList = ({ words, foundWords, onWordClick }) => {
    const found = words.filter(w => foundWords.includes(w.id));
    const remaining = words.filter(w => !foundWords.includes(w.id));
    return (<div className="card-lg space-y-4">
      <h3 className="text-lg font-bold text-secondary">
        Palavras ({found.length}/{words.length})
      </h3>

      {/* Palavras Encontradas */}
      {found.length > 0 && (<div>
          <h4 className="text-xs uppercase text-muted mb-2">Encontradas</h4>
          <div className="word-list">
            {found.map(word => (<div key={word.id} className="word-item-found cursor-pointer text-center font-medium text-sm" onClick={() => onWordClick?.(word.id)}>
                {word.text}
              </div>))}
          </div>
        </div>)}

      {/* Palavras Restantes */}
      {remaining.length > 0 && (<div>
          <h4 className="text-xs uppercase text-muted mb-2">
            {found.length > 0 ? 'Ainda faltam' : 'Encontre estas palavras'}
          </h4>
          <div className="word-list">
            {remaining.map(word => (<div key={word.id} className="word-item cursor-pointer hover:bg-white hover:bg-opacity-10 text-center font-medium text-sm" onClick={() => onWordClick?.(word.id)}>
                {word.text}
              </div>))}
          </div>
        </div>)}

      {/* Mensagem de Conclusão */}
      {found.length === words.length && words.length > 0 && (<div className="mt-4 p-4 rounded-lg bg-success bg-opacity-20 border border-success">
          <p className="text-success font-bold text-center">🎉 Parabéns! Jogo completo!</p>
        </div>)}
    </div>);
};
