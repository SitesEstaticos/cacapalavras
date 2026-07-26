// Página de Menu

import React from 'react'
import { Button, Card } from '@components/index'
import { useStats } from '@hooks/index'

interface MenuPageProps {
  onStartGame: () => void
  onOpenStats?: () => void
  onOpenPrivacy?: () => void
}

export const MenuPage: React.FC<MenuPageProps> = ({ 
  onStartGame, 
  onOpenStats, 
  onOpenPrivacy 
}) => {
  const { stats } = useStats()

  // Dados do e-mail
  const email = "m3technology.br@gmail.com"
  const subject = encodeURIComponent("Contato - Caça Palavras Online")
  const body = encodeURIComponent("Olá! Gostaria de enviar uma mensagem:")

  // Link direto para abrir a tela de composição no Web Gmail
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-secondary mb-2">🔍</h1>
          <h1 className="text-4xl font-bold text-light">Caça Palavras</h1>
          <p className="text-muted mt-2">Jogo Moderno de Palavras</p>
        </div>

        {/* Estatísticas resumidas */}
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Jogos</p>
              <p className="text-2xl font-bold text-secondary">{stats.gamesPlayed}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Melhor Score</p>
              <p className="text-2xl font-bold text-secondary">{stats.bestScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Melhor Tempo</p>
              <p className="text-2xl font-bold text-secondary">
                {stats.bestTime > 0 ? `${Math.floor(stats.bestTime / 60)}m` : '-'}
              </p>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button variant="primary" className="w-full py-3" onClick={onStartGame}>
            🎮 Novo Jogo
          </Button>

          <Button variant="secondary" className="w-full py-3" onClick={onOpenStats}>
            📊 Estatísticas
          </Button>

          <Button variant="outline" className="w-full py-3">
            ⚙️ Configurações
          </Button>

          <Button variant="ghost" className="w-full py-3">
            🏆 Conquistas
          </Button>
        </div>

        {/* Seção Explicativa Expandida */}
        <Card className="mt-8 text-left space-y-6">
          {/* Sobre o Jogo */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Sobre o Caça Palavras Online</h2>
            <p className="text-sm text-muted leading-relaxed">
              Bem-vindo ao <strong>Caça Palavras Online</strong>! Nosso objetivo é oferecer um passatempo educativo, divertido e gratuito para exercitar sua mente, aprimorar a concentração e expandir seu vocabulário na língua portuguesa.
            </p>
          </div>

          <hr className="border-gray-800" />

          {/* Como Jogar */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">Como Jogar</h3>
            <ul className="list-disc list-inside text-sm text-muted space-y-1 leading-relaxed">
              <li>Encontre as palavras escondidas no tabuleiro de letras.</li>
              <li>As palavras podem estar na <strong>horizontal, vertical ou diagonal</strong> (no sentido normal ou invertido).</li>
              <li>Arraste ou clique sobre as letras para formar a palavra.</li>
              <li>Encontre todas as palavras da lista no menor tempo possível!</li>
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Sistema de Dicas */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">💡 Sistema de Dicas Inteligente</h3>
            <p className="text-sm text-muted leading-relaxed mb-2">
              Travou em alguma palavra? Nosso sistema de dicas foi pensado para te ajudar a aprender enquanto joga:
            </p>
            <ul className="list-disc list-inside text-sm text-muted space-y-1 leading-relaxed">
              <li><strong>Significado da Palavra:</strong> Ao solicitar uma dica, exibimos o significado/conceito da palavra para ajudar você a deduzi-la.</li>
              <li><strong>Destaque no Tabuleiro:</strong> A <strong>primeira letra</strong> da palavra correspondente é destacada diretamente na grade de letras.</li>
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Sistema de Estatísticas */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">📈 Estatísticas e Progresso</h3>
            <p className="text-sm text-muted leading-relaxed">
              O jogo conta com um sistema automático que salva os dados de suas partidas. Acompanhe o total de jogos, pontuações e melhores tempos para monitorar sua evolução e superar seus próprios recordes!
            </p>
          </div>

          <hr className="border-gray-800" />

          {/* Benefícios para a Mente */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">🧠 Benefícios para a Mente</h3>
            <p className="text-sm text-muted leading-relaxed">
              Jogar caça-palavras estimula o raciocínio rápido, auxilia na retenção de memória e desenvolve a atenção aos detalhes. É uma ótima opção de entretenimento e exercício mental para todas as idades.
            </p>
          </div>

          <hr className="border-gray-800" />

          {/* Desenvolvedora */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">🚀 Sobre a Desenvolvedora</h3>
            <p className="text-sm text-muted leading-relaxed">
              O Caça Palavras Online é desenvolvido pela <strong>M³ Technology</strong>. Somos uma empresa de desenvolvimento focada na experiência de usuário, jogos educativos e na criação de soluções digitais modernas e acessíveis. Caso queira colaborar com feedbacks, entre em contato conosco!
             </p>
          </div>
        </Card>

        {/* Rodapé com Política de Privacidade e Redirecionamento Direto para o Gmail */}
        <div className="text-center text-xs text-muted mt-8 border-t border-gray-800 pt-6 space-y-3">
          <div className="flex justify-center items-center gap-3">
            <button 
              onClick={onOpenPrivacy} 
              className="text-secondary hover:underline transition-colors font-medium"
            >
              Política de Privacidade
            </button>
            
            <span>•</span>

            {/* Redireciona diretamente para o site do Gmail numa nova aba */}
            <a 
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline transition-colors font-medium flex items-center gap-1"
            >
              Entrar em Contato
            </a>
          </div>
          
          <p>Versão 1.0.0</p>
          <p>© 2026 M³ Technology - Desenvolvido com carinho</p>
        </div>
      </div>
    </div>
  )
}