// Exemplo de Integração - Como tudo funciona junto

/*

## 🔗 Fluxo Completo: Iniciando um Jogo

### 1. Usuário clica em "Novo Jogo"

→ pages/GamePage.tsx
```typescript
const handleStartGame = () => {
  setDifficulty(GameDifficulty.EASY)
}
```

### 2. Dificuldade é selecionada

→ useGameLogic hook é ativado
```typescript
const gameLogic = useGameLogic(difficulty)
```

### 3. GameEngine gera o tabuleiro

→ services/GameEngine.ts
```typescript
const engine = new GameEngine()
const board = engine.generateBoard(GameDifficulty.EASY)
// Cria 10x10 com 5 palavras aleatórias
```

### 4. Componentes renderizam

→ components/Board.tsx
```typescript
<Board
  grid={board.grid}
  onCellClick={handleCellClick}
  onSelectionEnd={handleSelectionEnd}
/>
```

### 5. Usuário seleciona letras

→ Canvas detecta movimento
```typescript
const path = calculatePositionsPath(start, end)
setSelectedCells(path)
```

### 6. Validar seleção

→ GameEngine.validateSelection()
```typescript
const wordId = engine.validateSelection(selectedCells)
if (wordId) {
  // Palavra encontrada!
  engine.markWordAsFound(wordId)
  updateScore()
}
```

### 7. Atualizar HUD

→ components/HUD.tsx mostra:
- Pontos aumentados
- Progresso atualizado
- Tempo passando

### 8. Usar dica

→ useHints hook
```typescript
const { hintsAvailable, useHint } = useHints(storageService)
await useHint()
```

### 9. Salvar progresso

→ StorageService.saveGameSession()
```typescript
await storageService.saveGameSession({
  id: sessionId,
  difficulty,
  score,
  foundWords,
  // ...
})
```

### 10. Jogo completo

→ GameOverModal mostra estatísticas
→ Salvar achievement se aplicável

---

## 🏗️ Estrutura de Dados em Tempo de Execução

### State do Hook
```typescript
const gameState = {
  board: BoardCell[][], // Grid com letras
  selectedCells: Position[], // Células selecionadas
  foundWords: string[], // IDs das palavras encontradas
  score: 1250,
  time: 145, // segundos
  isRunning: true,
  words: Word[], // Array de palavras do tabuleiro
  isGameComplete: false,
}
```

### Fluxo de Dados
```
GamePage (componente raiz)
    ↓
useGameLogic + useHints (estado)
    ↓
Board, HUD, WordList (componentes)
    ↓
GameEngine, HintService (lógica)
    ↓
StorageService (persistência)
    ↓
WebStorageAdapter (localStorage)
```

---

## 🔄 Integração com Anúncios

### Sequência quando dicas acabam:

```
1. User clica em "Usar Dica"
   ↓
2. HintService.useHint() retorna false
   ↓
3. Modal HintModal abre
   ↓
4. User clica "Assistir Anúncio"
   ↓
5. MonetizationManager.showRewardedAd()
   ↓
6. MockRewardedAdProvider simula anúncio
   ↓
7. Callback onAdRewarded dispara
   ↓
8. HintService.addHintFromAd()
   ↓
9. Score atualizado
   ↓
10. AnalyticsService.logAdRewarded()
```

---

## 🎯 Integração com Analytics

```typescript
// Cada ação importante é rastreada

// Ao iniciar jogo
AnalyticsService.logGameStart(difficulty)

// Ao encontrar palavra
AnalyticsService.logWordFound(word, timeSeconds)

// Ao terminar jogo
AnalyticsService.logGameComplete(difficulty, time, score, wordsFound)

// Ao usar dica
AnalyticsService.logHintUsed(strategy)

// Ao assistir anúncio
AnalyticsService.logAdShown('rewarded_ad')
AnalyticsService.logAdRewarded('rewarded_ad')
```

---

## 🔐 Integridade de Dados

### Todas as mudanças passam por serviços

```
Componente UI
    ↓
Hook (validação de estado)
    ↓
Service (lógica de negócio)
    ↓
Adapter (persistência segura)
    ↓
Storage
```

Nunca direto:
```typescript
// ❌ Não fazer
localStorage.setItem('score', score)

// ✅ Fazer
storageService.saveUserProgress(progress)
```

---

## 🧪 Testando a Integração

```typescript
// Teste sem UI
const engine = new GameEngine()
const board = engine.generateBoard(GameDifficulty.EASY)

// Simular seleção
const firstWord = board.words[0]
const validWordId = engine.validateSelection([
  firstWord.startPos,
  firstWord.endPos,
])

// Validar
expect(validWordId).toBe(firstWord.id)

// Marcar como encontrada
engine.markWordAsFound(firstWord.id)
expect(firstWord.found).toBe(true)
```

---

## 📱 Para React Native

O mesmo fluxo funciona! Apenas mude os adapters:

```typescript
// Web
const adapter = new WebStorageAdapter()

// React Native
const adapter = new ReactNativeStorageAdapter(AsyncStorage)

// Tudo else é igual!
const gameEngine = new GameEngine()
const board = gameEngine.generateBoard(difficulty)
```

*/
