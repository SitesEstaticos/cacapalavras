# 🎮 Caça Palavras Moderno

Um jogo de caça-palavras altamente interativo, responsivo e preparado para monetização, desenvolvido com React, TypeScript e Vite.

## 🚀 Características Principais

- ✅ **Geração Automática**: Algoritmo inteligente para gerar tabuleiros
- 🎯 **Interação Fluida**: Seleção via clique/arrasto e gestos touch
- 💡 **Sistema de Dicas**: 3 dicas gratuitas/dia + anúncios recompensados
- 💰 **Monetização**: Sistema desacoplado de anúncios (preparado para produção)
- 📱 **React Native Ready**: Adaptadores para futura migração
- ⚙️ **Clean Architecture**: SOLID e separação de camadas
- 🎨 **Visual Premium**: Design moderno com TailwindCSS
- 🌙 **Tema Escuro/Claro**: Suporte completo

## 📋 Stack Tecnológico

### Frontend Web
- React 18+
- TypeScript 5
- Vite
- TailwindCSS
- Zustand (gerenciamento de estado)

### Preparado para
- React Native + Expo
- PWA
- Aplicativos mobile nativos

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Aplicação principal
├── core/               # Lógica central do jogo
├── domain/             # Modelos de domínio
├── services/           # Serviços (GameEngine, HintService, etc)
├── hooks/              # Hooks customizados React
├── components/         # Componentes React
│   ├── BaseComponents  # Componentes básicos
│   ├── Board          # Tabuleiro
│   ├── HUD            # Interface de jogo
│   ├── WordList       # Lista de palavras
│   └── Modals         # Modais
├── features/          # Features/features
├── pages/             # Páginas
├── shared/            # Utilitários compartilhados
├── styles/            # CSS global e temas
├── types/             # Tipos TypeScript
├── utils/             # Funções utilitárias
├── adapters/          # Adaptadores (Storage, Ads, Analytics)
└── main.tsx           # Entrada da aplicação
```

## 🎮 Como Jogar

### Web
- **Clique e arraste** para selecionar letras
- **Clique na primeira e última letra** como alternativa
- **Dicas**: Use 3 dicas gratuitas por dia ou assista anúncios

### Mobile (preparado para)
- **Swipe** entre letras
- **Gestos touch** para seleção
- **Feedback tátil** customizado

## 🔧 Configuração

### Requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/caca-palavras.git
cd caca-palavras

# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Preview
npm run preview
```

## 🎯 Dificuldades

### 🟢 Fácil
- Palavras horizontais e verticais
- Tabuleiro 10x10
- 5 palavras

### 🟡 Médio
- Adiciona diagonais
- Tabuleiro 12x12
- 8 palavras

### 🔴 Difícil
- Palavras invertidas
- Tabuleiro 14x14
- 12 palavras

## 💡 Sistema de Dicas

```
Por dia:
- 3 dicas gratuitas
- Após consumir, assista anúncios para mais
- Máximo 10 anúncios/dia
- Reset automático à meia-noite

Tipos de dicas:
- Primeira letra
- Direção da palavra
- Palavra parcialmente revelada
- Área destacada
```

## 📊 Sistema de Pontuação

```
Pontos base:
- Fácil: 100 pontos/palavra
- Médio: 250 pontos/palavra
- Difícil: 500 pontos/palavra

Bônus:
- Multiplicador por comprimento da palavra
- Bônus por tempo (até 50% do score)
- Bônus por dificuldade
- Multiplicador por sequência diária
```

## 💰 Monetização

### Arquitetura Desacoplada

```typescript
// Interfaces para diferentes provedores
IRewardedAdProvider    // Anúncios recompensados
IBannerAdProvider      // Banners
IInterstitialProvider  // Anúncios intersticiais

// Gestão centralizada
MonetizationManager    // Orquestra anúncios
```

### Fluxo

1. Dicas gratuitas consumidas
2. Modal oferecendo assistir anúncio
3. Anúncio é exibido
4. Usuário ganha +1 dica
5. Controle de frequência ativa

## 🔄 Adaptadores para React Native

```typescript
// Storage
WebStorageAdapter → localStorage
ReactNativeStorageAdapter → AsyncStorage

// Analytics
MockAnalyticsAdapter → Firebase, Mixpanel, etc

// Ads
MockRewardedAdProvider → AdMob, Meta Ads, etc
```

## 🎨 Paleta de Cores

```
Cor Principal:     #1A535C (Azul-petróleo)
Cor Secundária:    #4ECDC4 (Turquesa)
Fundo:             #0B1220 (Azul escuro)
Branco:            #FFFFFF
Cinza Claro:       #CBD5E1
Sucesso:           #10B981 (Verde)
Erro:              #EF4444 (Vermelho)
Aviso:             #F59E0B (Laranja)
```

## 📱 Persistência de Dados

```json
{
  "user_progress": {
    "totalGamesPlayed": 42,
    "totalWordsFound": 234,
    "totalScore": 12500,
    "bestTime": 145,
    "currentStreak": 5,
    "achievements": [],
    "statistics": {}
  },
  "game_hints_data": {
    "dailyHints": 2,
    "totalHintsUsed": 5,
    "lastResetDate": "2024-01-15",
    "adsWatched": 1
  },
  "game_sessions": []
}
```

## 🚀 Próximas Melhorias

- [ ] Ranking online
- [ ] Multiplayer
- [ ] Loja com skins
- [ ] Assinatura premium
- [ ] Novos modos de jogo
- [ ] Temas personalizados
- [ ] Sistema de achievements avançado
- [ ] Integração social

## 📝 Desenvolvido com SOLID

- **S**ingle Responsibility: Cada serviço tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces desacopladas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependência em abstrações

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️

---

**Nota**: Este é um projeto de produção pronto para ser escalado e migrado para React Native sem necessidade de reescrever a lógica central.