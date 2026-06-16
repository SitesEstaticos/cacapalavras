// Guia de Testes

/*

## 🧪 Estratégia de Testes

### Tipos de Testes

1. **Unit Tests** (GameEngine, Services)
2. **Integration Tests** (Services + Adapters)
3. **Component Tests** (Components React)
4. **E2E Tests** (Fluxos completos)

## ✅ Exemplos de Testes

### GameEngine Tests

```typescript
describe('GameEngine', () => {
  let engine: GameEngine

  beforeEach(() => {
    engine = new GameEngine()
  })

  test('generateBoard cria tabuleiro com tamanho correto', () => {
    const board = engine.generateBoard(GameDifficulty.EASY)
    expect(board.grid).toHaveLength(10)
    expect(board.grid[0]).toHaveLength(10)
  })

  test('generateBoard cria número correto de palavras', () => {
    const board = engine.generateBoard(GameDifficulty.EASY)
    expect(board.words).toHaveLength(5)

    const mediumBoard = engine.generateBoard(GameDifficulty.MEDIUM)
    expect(mediumBoard.words).toHaveLength(8)

    const hardBoard = engine.generateBoard(GameDifficulty.HARD)
    expect(hardBoard.words).toHaveLength(12)
  })

  test('validateSelection reconhece palavras válidas', () => {
    const board = engine.generateBoard(GameDifficulty.EASY)
    const firstWord = board.words[0]

    const positions = [
      firstWord.startPos,
      firstWord.endPos,
    ]

    const wordId = engine.validateSelection(positions)
    expect(wordId).toBe(firstWord.id)
  })

  test('validateSelection rejeita seleção inválida', () => {
    engine.generateBoard(GameDifficulty.EASY)
    const positions = [
      { row: 0, col: 0 },
      { row: 9, col: 9 },
    ]

    const wordId = engine.validateSelection(positions)
    expect(wordId).toBeNull()
  })

  test('markWordAsFound marca palavra como encontrada', () => {
    const board = engine.generateBoard(GameDifficulty.EASY)
    const word = board.words[0]

    expect(word.found).toBe(false)

    engine.markWordAsFound(word.id)
    expect(word.found).toBe(true)
  })

  test('isGameComplete retorna true quando todas palavras encontradas', () => {
    const board = engine.generateBoard(GameDifficulty.EASY)

    expect(engine.isGameComplete()).toBe(false)

    board.words.forEach(word => {
      engine.markWordAsFound(word.id)
    })

    expect(engine.isGameComplete()).toBe(true)
  })
})
```

### ScoreService Tests

```typescript
describe('ScoreService', () => {
  let scoreService: ScoreService

  beforeEach(() => {
    scoreService = new ScoreService()
  })

  test('calculateScore retorna pontos base para palavra encontrada', () => {
    const score = scoreService.calculateScore(
      GameDifficulty.EASY,
      120, // 2 minutos
      5,   // palavra com 5 letras
      180  // 3 minutos ideais
    )

    expect(score).toBeGreaterThan(0)
  })

  test('calculateScore oferece bônus de tempo', () => {
    const scoreFast = scoreService.calculateScore(
      GameDifficulty.MEDIUM,
      60, // Rápido
      5,
      300
    )

    const scoreSlow = scoreService.calculateScore(
      GameDifficulty.MEDIUM,
      250, // Lento
      5,
      300
    )

    expect(scoreFast).toBeGreaterThan(scoreSlow)
  })

  test('calculateScore multiplica por tamanho da palavra', () => {
    const scoreShort = scoreService.calculateScore(
      GameDifficulty.HARD,
      120,
      3, // Palavra curta
      600
    )

    const scoreLong = scoreService.calculateScore(
      GameDifficulty.HARD,
      120,
      10, // Palavra longa
      600
    )

    expect(scoreLong).toBeGreaterThan(scoreShort)
  })

  test('getMaxScore retorna valor esperado', () => {
    const maxScore = scoreService.getMaxScore(GameDifficulty.EASY, 5)
    expect(maxScore).toBe(1000) // 100 * 5 * 2
  })
})
```

### HintService Tests

```typescript
describe('HintService', () => {
  let hintService: HintService
  let mockStorage: MockStorageAdapter

  beforeEach(() => {
    mockStorage = new MockStorageAdapter()
    hintService = new HintService(mockStorage)
  })

  test('getDailyHints retorna 3 dicas no primeiro acesso', async () => {
    const hints = await hintService.getDailyHints()
    expect(hints.dailyHints).toBe(3)
  })

  test('useHint decrementa dicas disponíveis', async () => {
    let hints = await hintService.getDailyHints()
    expect(hints.dailyHints).toBe(3)

    await hintService.useHint()
    hints = await hintService.getDailyHints()
    expect(hints.dailyHints).toBe(2)
  })

  test('useHint retorna false quando dicas zeradas', async () => {
    await hintService.useHint()
    await hintService.useHint()
    await hintService.useHint()

    const result = await hintService.useHint()
    expect(result).toBe(false)
  })

  test('canUseAd retorna true enquanto limite não atingido', async () => {
    const result = await hintService.canUseAd()
    expect(result).toBe(true)
  })
})
```

### Component Tests

```typescript
describe('Board Component', () => {
  test('renderiza grid corretamente', () => {
    const mockGrid = [
      [
        { letter: 'A', wordIds: [], isSelected: false },
        { letter: 'B', wordIds: [], isSelected: false },
      ],
      [
        { letter: 'C', wordIds: [], isSelected: false },
        { letter: 'D', wordIds: [], isSelected: false },
      ],
    ]

    const { container } = render(
      <Board
        grid={mockGrid}
        selectedCells={[]}
        foundWords={[]}
        words={[]}
        onCellClick={jest.fn()}
      />
    )

    expect(container.querySelectorAll('[role="button"]')).toHaveLength(4)
  })

  test('chama onCellClick quando célula é clicada', () => {
    const onCellClick = jest.fn()
    const mockGrid = [
      [{ letter: 'A', wordIds: [], isSelected: false }],
    ]

    const { container } = render(
      <Board
        grid={mockGrid}
        selectedCells={[]}
        foundWords={[]}
        words={[]}
        onCellClick={onCellClick}
      />
    )

    fireEvent.click(container.querySelector('[role="button"]')!)
    expect(onCellClick).toHaveBeenCalledWith(0, 0)
  })
})
```

## 🚀 Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Teste específico
npm test -- GameEngine.test.ts

# Com padrão
npm test -- --testNamePattern="validateSelection"
```

## 📊 Cobertura de Testes

Objetivo: > 80% de cobertura

```
Statements   : 85.5% ( 162/189 )
Branches     : 82.3% ( 47/57 )
Functions    : 88.1% ( 37/42 )
Lines        : 85.2% ( 158/185 )
```

*/
