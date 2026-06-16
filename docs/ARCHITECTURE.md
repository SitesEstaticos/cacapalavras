// Arquitetura Clean Architecture

/*

## 🏗️ Estrutura de Camadas

### 1. ADAPTERS (Camada Externa)
Responsável pela comunicação com o mundo externo:

```
src/adapters/
├── StorageAdapter (localStorage, AsyncStorage, etc)
├── RewardedAdProvider (Google Ads, Meta Ads, etc)
├── BannerAdProvider
├── InterstitialProvider
└── AnalyticsAdapter (Firebase, Mixpanel, etc)
```

Características:
- Completamente desacoplado da lógica de negócio
- Fácil de mockar para testes
- Implementações diferentes para Web e Mobile
- Segue o padrão Adapter

### 2. DOMAIN (Camada de Domínio)
Define as regras de negócio centrais:

```
src/domain/
├── GameEngine
├── GameRules
├── WordValidation
└── ScoringRules
```

Características:
- Não conhece nada sobre React, Web ou Mobile
- Pure TypeScript classes
- Lógica pura e reutilizável
- Independente de frameworks

### 3. SERVICES (Camada de Aplicação)
Orquestra a lógica de negócio:

```
src/services/
├── GameEngine              # Gerencia o jogo
├── HintService            # Gerencia dicas
├── StorageService         # Persistência
├── ScoreService           # Cálculo de pontos
├── RewardService          # Recompensas
├── AnalyticsService       # Eventos
└── MonetizationManager    # Anúncios
```

Características:
- Orquestra o uso dos adapters
- Implementa lógica de regras
- Reutilizável em web e mobile
- Testável isoladamente

### 4. HOOKS (Camada React)
Encapsula a lógica de estado React:

```
src/hooks/
├── useGameLogic          # Estado do jogo
├── useHints              # Estado de dicas
├── useTimer              # Timer
└── useTheme              # Tema
```

Características:
- Usam services internamente
- Gerenciam estado local
- Executam side effects
- Específicos do React

### 5. COMPONENTS (Camada de UI)
Componentes React puros:

```
src/components/
├── BaseComponents         # Buttons, Cards, etc
├── Board                 # Tabuleiro de jogo
├── HUD                   # Interface de jogo
├── WordList              # Lista de palavras
└── Modals                # Diálogos
```

Características:
- Recebem props apenas
- Sem chamadas HTTP ou storage
- Compostos de componentes menores
- Fáceis de testar

### 6. PAGES (Camada de Roteamento)
Páginas da aplicação:

```
src/pages/
├── GamePage              # Tela principal do jogo
├── MenuPage              # Menu inicial
├── SettingsPage          # Configurações
└── StatisticsPage        # Estatísticas
```

Características:
- Orquestram componentes
- Usam hooks para estado
- Lidam com roteamento
- Conectam tudo junto

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────┐
│ PÁGINAS (Pages)                             │
│ - GamePage, MenuPage, etc                   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│ COMPONENTES (Components)                    │
│ - Board, HUD, WordList, Modals              │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│ HOOKS (Hooks)                               │
│ - useGameLogic, useHints, useTimer, etc     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│ SERVICES (Services)                         │
│ - GameEngine, HintService, StorageService   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│ ADAPTERS (Adapters)                         │
│ - Storage, Ads, Analytics                   │
└─────────────────────────────────────────────┘
```

## 🧪 Testabilidade

### GameEngine (100% testável)
```typescript
// Teste sem dependências externas
const engine = new GameEngine()
const board = engine.generateBoard(GameDifficulty.EASY)
expect(board.words).toHaveLength(5)
```

### ScoreService (100% testável)
```typescript
const scoreService = new ScoreService()
const score = scoreService.calculateScore(
  GameDifficulty.MEDIUM,
  120, // 2 minutos
  10,  // palavra com 10 letras
  300  // tempo perfeito 5 minutos
)
expect(score).toBeGreaterThan(0)
```

### HintService (testável com mock)
```typescript
const mockStorage = new MockStorageAdapter()
const hintService = new HintService(mockStorage)
const used = await hintService.useHint()
expect(used).toBe(true)
```

## 🔒 Princípios SOLID

### S - Single Responsibility
- `GameEngine`: apenas gera e valida palavras
- `HintService`: apenas gerencia dicas
- `ScoreService`: apenas calcula pontos

### O - Open/Closed
- Services abertos para extensão
- Fechados para modificação
- Novos adaptadores sem alterar código existente

### L - Liskov Substitution
- `IStorageAdapter` pode ser qualquer implementação
- `IRewardedAdProvider` intercambiável
- Contracts bem definidos

### I - Interface Segregation
- `IRewardedAdProvider` para anúncios recompensados
- `IBannerAdProvider` para banners
- `IInterstitialProvider` para intersticiais
- Não uma única `IAdProvider` grande

### D - Dependency Inversion
- Services recebem adaptadores injetados
- `GamePage` não conhece `WebStorageAdapter`
- Depende de abstrações, não de implementações concretas

## 🚀 Vantagens da Arquitetura

1. **Testabilidade**: GameEngine pode ser testado sem UI
2. **Reutilização**: Mesma lógica em Web e Mobile
3. **Manutenção**: Mudanças isoladas por camada
4. **Escalabilidade**: Fácil adicionar novos adapters
5. **Independência**: Trocar tecnologias sem reescrever lógica
6. **Compreensão**: Cada camada tem responsabilidade clara

*/
