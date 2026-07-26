import React from 'react'
import { Card, Button } from '@components/index'

interface PrivacyPolicyProps {
  onClose?: () => void // Função para voltar ao menu ou fechar a modal
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-muted leading-relaxed text-sm pb-12">
      
      {/* Botão de Voltar no Topo */}
      {onClose && (
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            className="py-2 px-4 text-xs flex items-center gap-2"
            onClick={onClose}
          >
            ← Voltar ao Menu
          </Button>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-light mb-2">Política de Privacidade</h1>
        <p className="text-xs text-muted">Última atualização: 2026</p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-secondary">1. Informações Gerais</h2>
        <p>
          A sua privacidade é extremamente importante para nós. Esta Política de Privacidade explica como o 
          <strong> Caça Palavras Online</strong> lida com as informações ao utilizar nosso site e serviços.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-secondary">2. Coleta de Dados Pessoais</h2>
        <p>
          Nosso jogo <strong>não exige nenhum tipo de cadastro, login ou fornecimento de dados pessoais</strong> (como nome, e-mail ou telefone) para jogar. Seu progresso, pontuações e melhores tempos são armazenados localmente no seu próprio navegador através da tecnologia <em>LocalStorage</em>.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-secondary">3. Cookies e Tecnologias de Rastreamento</h2>
        <p>
          Utilizamos cookies essenciais para salvar suas preferências de navegação e configurações do jogo. Além disso, terceiros podem utilizar cookies para fins estatísticos ou de exibição de anúncios.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-secondary">4. Anúncios e Google AdSense</h2>
        <p>
          Este site exibe anúncios fornecidos pela rede <strong>Google AdSense</strong>. O Google utiliza cookies (como o cookie DART) para veicular anúncios com base nas visitas anteriores feitas a este e a outros sites da Internet.
        </p>
        <p>
          Você pode desativar a publicidade personalizada acessando as{' '}
          <a 
            href="https://adssettings.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-secondary underline hover:opacity-80"
          >
            Configurações de Anúncios do Google
          </a>.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-secondary">5. Alterações nesta Política</h2>
        <p>
          Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente para garantir a conformidade com alterações legais e técnicas. Recomendamos a revisão desta página regularmente.
        </p>
      </Card>

      {/* Botão de Fechar no Rodapé */}
      {onClose && (
        <div className="pt-4 flex justify-center">
          <Button 
            variant="primary" 
            className="w-full max-w-xs py-3"
            onClick={onClose}
          >
            Entendi e Voltar
          </Button>
        </div>
      )}
    </div>
  )
}