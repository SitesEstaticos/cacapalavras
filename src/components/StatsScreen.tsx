import React, { useState } from 'react'
import { Card, Button } from './BaseComponents'
import { useStats, GameHistoryItem } from '@/hooks/useStats'

interface StatsScreenProps {
  onBack: () => void
}

// Auxiliar para formatar segundos em mm:ss
const formatTime = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds === 0) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Auxiliar para formatar a data da partida
const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const { stats, isLoading, clearStats } = useStats()
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL')

  const history = stats.history || []

  // Filtra as partidas pela dificuldade selecionada
  const filteredHistory = history.filter(item => {
    if (filterDifficulty === 'ALL') return true
    return item.difficulty.toUpperCase() === filterDifficulty.toUpperCase()
  })

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-300">
        Carregando estatísticas...
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            📊 Minhas Estatísticas
          </h1>
          <p className="text-sm text-gray-400">Acompanhe seu desempenho e histórico de jogadas</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Voltar ao Menu
        </Button>
      </div>

      {/* Cards de Métricas Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-800/80 text-center border border-gray-700/50">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Jogos Concluídos</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.gamesPlayed}</div>
        </Card>

        <Card className="p-4 bg-slate-800/80 text-center border border-gray-700/50">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Melhor Tempo</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatTime(stats.bestTime)}
          </div>
        </Card>

        <Card className="p-4 bg-slate-800/80 text-center border border-gray-700/50">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Tempo Médio</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {formatTime(stats.averageTime)}
          </div>
        </Card>

        <Card className="p-4 bg-slate-800/80 text-center border border-gray-700/50">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Melhor Pontuação</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{stats.bestScore}</div>
        </Card>
      </div>

      {/* Lista / Histórico de Partidas */}
      <Card className="p-5 bg-slate-800/60 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-white">Histórico de Partidas</h2>

          {/* Filtros por dificuldade */}
          <div className="flex gap-1.5 text-xs">
            {[
              { id: 'ALL', label: 'Todas' },
              { id: 'EASY', label: 'Fácil' },
              { id: 'MEDIUM', label: 'Médio' },
              { id: 'HARD', label: 'Difícil' },
            ].map(diff => (
              <button
                key={diff.id}
                onClick={() => setFilterDifficulty(diff.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterDifficulty === diff.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/70 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Histórico */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nenhuma partida encontrada no histórico.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Dificuldade</th>
                  <th className="py-3 px-4">Tema</th>
                  <th className="py-3 px-4 text-center">Tempo</th>
                  <th className="py-3 px-4 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredHistory.map((item: GameHistoryItem) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-xs text-gray-400">{formatDate(item.date)}</td>
                    <td className="py-3 px-4 font-medium text-white capitalize">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          item.difficulty.toLowerCase().includes('easy') ||
                          item.difficulty.toLowerCase().includes('fácil')
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : item.difficulty.toLowerCase().includes('medium') ||
                              item.difficulty.toLowerCase().includes('médio')
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize">{item.segment || 'Geral'}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-300">
                      ⏱️ {formatTime(item.timeInSeconds)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      +{item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Botão de limpar dados */}
      {history.length > 0 && (
        <div className="text-right">
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja apagar todo o seu histórico de estatísticas?')) {
                clearStats()
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 underline transition-colors"
          >
            Limpar Histórico de Estatísticas
          </button>
        </div>
      )}
    </div>
  )
}