// src/pages/AboutPage.tsx

import React from 'react'
import { Card, Button } from '@components/index'

interface AboutPageProps {
  onBack: () => void
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=m3technology.br@gmail.com&su=Contato%20-%20Ca%C3%A7a%20Palavras'

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6 pb-12">
        
        {/* Botão de Voltar */}
        <div className="flex justify-start pt-4">
          <Button 
            variant="outline" 
            className="py-2 px-4 text-xs flex items-center gap-2 cursor-pointer"
            onClick={onBack}
          >
            ← Voltar ao Menu
          </Button>
        </div>

        <div className="text-center my-6">
          <h1 className="text-3xl md:text-4xl font-bold text-light mb-2">
            Sobre o Caça Palavras Online
          </h1>
          <p className="text-sm text-muted">Conheça mais sobre o jogo e suas funcionalidades</p>
        </div>

        <Card className="text-left space-y-6">
          {/* Apresentação */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Sobre o Jogo</h2>
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
              <li>
                As palavras podem estar na <strong>horizontal, vertical ou diagonal</strong> (no sentido normal ou invertido).
              </li>
              <li>Arraste ou clique sobre as letras para formar a palavra.</li>
              <li>Encontre todas as palavras da lista no menor tempo possível!</li>
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Sistema de Dicas */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">
              💡 Sistema de Dicas Inteligente
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-2">
              Travou em alguma palavra? Nosso sistema de dicas foi pensado para te ajudar a aprender enquanto joga:
            </p>
            <ul className="list-disc list-inside text-sm text-muted space-y-1 leading-relaxed">
              <li>
                <strong>Significado da Palavra:</strong> Exibimos o significado/conceito da palavra para ajudar você a deduzi-la.
              </li>
              <li>
                <strong>Destaque no Tabuleiro:</strong> A <strong>primeira letra</strong> da palavra correspondente é destacada diretamente na grade de letras.
              </li>
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Sistema de Estatísticas */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">
              📈 Estatísticas e Progresso
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              O jogo conta com um sistema automático que salva os dados de suas partidas. Acompanhe o total de jogos, pontuações e melhores tempos para monitorar sua evolução!
            </p>
          </div>

          <hr className="border-gray-800" />

          {/* Benefícios */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">
              🧠 Benefícios para a Mente
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Jogar caça-palavras estimula o raciocínio rápido, auxilia na retenção de memória e desenvolve a atenção aos detalhes. É uma ótima opção de entretenimento e exercício mental.
            </p>
          </div>

          <hr className="border-gray-800" />

          {/* Desenvolvedora */}
          <div>
            <h3 className="text-md font-semibold text-light mb-2">
              🚀 Sobre a Desenvolvedora
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              O Caça Palavras Online é desenvolvido pela <strong>M³ Technology</strong>. Somos uma empresa focada em jogos educativos e soluções digitais modernas.
            </p>
          </div>
        </Card>

        {/* Links do Rodapé */}
        <div className="text-center text-xs text-muted pt-4 space-y-3">
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline transition-colors font-medium inline-block"
          >
            Entrar em Contato via Gmail
          </a>
          <p>&copy; 2026 M³ Technology. Todos os direitos reservados.</p>
        </div>

      </div>
    </div>
  )
}