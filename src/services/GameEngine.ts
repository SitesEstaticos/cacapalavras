// Game Engine - Core da lógica do jogo

import {
  GameBoard,
  GameDifficulty,
  WordSegment,
  Word,
  WordDirection,
  Position,
  BoardCell,
} from '@/types'
import { contentRegistry } from '@/services/ContentRegistry'
import type { CategoryWord } from '@/types/Category'

interface BoardWordCandidate {
  text: string
  hint: string
}

const MAX_WORDS_PER_BOARD = 12
const MAX_WORD_PLACEMENT_ATTEMPTS = 400
const WORD_COUNTS_BY_DIFFICULTY = {
  [GameDifficulty.EASY]: 6,
  [GameDifficulty.MEDIUM]: 9,
  [GameDifficulty.HARD]: 12,
} as const

export class GameEngine {
  private board: GameBoard
  private words: Word[]

  constructor() {
    this.board = this.initializeBoard(10, 10)
    this.words = []
  }

  private initializeBoard(width: number, height: number): GameBoard {
    const grid: BoardCell[][] = Array(height)
      .fill(null)
      .map(() =>
        Array(width)
          .fill(null)
          .map(() => ({
            letter: '',
            wordIds: [],
            isSelected: false,
            isHinted: false,
          }))
      )

    return {
      grid,
      width,
      height,
      words: [],
    }
  }

  generateBoard(
    difficulty: GameDifficulty,
    segment: WordSegment = WordSegment.AGROPECUARIA,
    width: number = 10,
    height: number = 10
  ): GameBoard {
    this.board = this.initializeBoard(width, height)
    this.words = []

    const availableWords = this.getWordCandidates(segment)
    const wordCount = this.getWordCountByDifficulty(difficulty, availableWords.length)
    const selectedWords = this.selectRandomWords(wordCount, segment)

    // Inserir palavras no tabuleiro
    for (const word of selectedWords) {
      let attempts = 0

      while (attempts < MAX_WORD_PLACEMENT_ATTEMPTS) {
        const direction = this.getRandomDirectionByDifficulty(difficulty)
        const position = this.getRandomPosition()

        if (this.canPlaceWord(word.text, position, direction)) {
          this.placeWord(word, position, direction)
          break
        }

        attempts++
      }
    }

    // Preencher espaços vazios com letras aleatórias
    this.fillEmptySpaces()

    this.board.words = this.words

    return this.board
  }

  private getWordCountByDifficulty(difficulty: GameDifficulty, availableWordCount: number): number {
    const baseCount = WORD_COUNTS_BY_DIFFICULTY[difficulty] ?? WORD_COUNTS_BY_DIFFICULTY[GameDifficulty.MEDIUM]
    return Math.min(baseCount, Math.min(availableWordCount, MAX_WORDS_PER_BOARD))
  }

  private getWordCandidates(segment: WordSegment): BoardWordCandidate[] {
    const categories = contentRegistry.getCategories()
    
    const targetCategory = categories.find(
      category => String(category.id).toLowerCase() === String(segment).toLowerCase()
    )

    const selectedCategory = targetCategory || categories[0]

    if (!selectedCategory) {
      return []
    }

    return selectedCategory.words.map((word: CategoryWord) => ({
      text: word.word.toUpperCase(),
      hint: word.hint,
    }))
  }

  private selectRandomWords(count: number, segment: WordSegment): BoardWordCandidate[] {
    const candidates = this.getWordCandidates(segment)
    const shuffled = [...candidates].sort(() => Math.random() - 0.5)

    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  private getRandomDirectionByDifficulty(difficulty: GameDifficulty): WordDirection {
    const random = Math.random()

    if (difficulty === GameDifficulty.EASY) {
      return random > 0.5 ? WordDirection.HORIZONTAL : WordDirection.VERTICAL
    } else if (difficulty === GameDifficulty.MEDIUM) {
      if (random < 0.33) return WordDirection.HORIZONTAL
      if (random < 0.66) return WordDirection.VERTICAL
      return random > 0.83 ? WordDirection.DIAGONAL_DOWN : WordDirection.DIAGONAL_UP
    } else {
      const directions = Object.values(WordDirection)
      return directions[Math.floor(Math.random() * directions.length)]
    }
  }

  private getRandomPosition(): Position {
    return {
      row: Math.floor(Math.random() * this.board.height),
      col: Math.floor(Math.random() * this.board.width),
    }
  }

  private canPlaceWord(word: string, startPos: Position, direction: WordDirection): boolean {
    const positions = this.getWordPositions(word, startPos, direction)

    if (!positions) return false

    for (const pos of positions) {
      if (this.board.grid[pos.row]?.[pos.col]?.letter !== '') {
        const existingLetter = this.board.grid[pos.row][pos.col].letter
        if (existingLetter !== word[positions.indexOf(pos)]) {
          return false
        }
      }
    }

    return true
  }

  private getWordPositions(
    word: string,
    startPos: Position,
    direction: WordDirection
  ): Position[] | null {
    const positions: Position[] = []
    let row = startPos.row
    let col = startPos.col

    const wordToPlace =
      direction.startsWith('reverse_') ? word.split('').reverse().join('') : word

    for (let i = 0; i < wordToPlace.length; i++) {
      if (row < 0 || row >= this.board.height || col < 0 || col >= this.board.width) {
        return null
      }

      positions.push({ row, col })

      switch (direction) {
        case WordDirection.HORIZONTAL:
        case WordDirection.REVERSE_HORIZONTAL:
          col++
          break
        case WordDirection.VERTICAL:
        case WordDirection.REVERSE_VERTICAL:
          row++
          break
        case WordDirection.DIAGONAL_DOWN:
        case WordDirection.REVERSE_DIAGONAL_DOWN:
          row++
          col++
          break
        case WordDirection.DIAGONAL_UP:
        case WordDirection.REVERSE_DIAGONAL_UP:
          row--
          col++
          break
      }
    }

    return positions
  }

  private placeWord(word: BoardWordCandidate, startPos: Position, direction: WordDirection): void {
    const positions = this.getWordPositions(word.text, startPos, direction)
    if (!positions) return

    const wordId = `word_${this.words.length}`
    const wordToPlace =
      direction.startsWith('reverse_') ? word.text.split('').reverse().join('') : word.text

    for (let i = 0; i < wordToPlace.length; i++) {
      const pos = positions[i]
      this.board.grid[pos.row][pos.col].letter = wordToPlace[i]
      this.board.grid[pos.row][pos.col].wordIds.push(wordId)
    }

    this.words.push({
      id: wordId,
      text: word.text,
      startPos,
      endPos: positions[positions.length - 1],
      direction,
      hint: word.hint,
      found: false,
    })
  }

  private fillEmptySpaces(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let row = 0; row < this.board.height; row++) {
      for (let col = 0; col < this.board.width; col++) {
        if (this.board.grid[row][col].letter === '') {
          this.board.grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  }

  /**
   * Aplica a dica no tabuleiro.
   * Marca a PRIMEIRA LETRA REAL da palavra com isHinted = true
   * e retorna as informações necessárias (Texto, Dica e Direção).
   */
  public applyHint(): { wordId: string; wordText: string; hint: string; direction: WordDirection } | null {
    const remainingWords = this.getRemainingWords()

    if (remainingWords.length === 0) return null

    // Sorteia uma palavra restante que ainda não teve a dica aplicada
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)]

    // Obtém as posições exatas
    const positions = this.getWordPositions(randomWord.text, randomWord.startPos, randomWord.direction)

    if (positions && positions.length > 0) {
      // Se for palavra invertida, a primeira letra original da palavra fica na última posição calculada!
      const firstLetterPos = randomWord.direction.startsWith('reverse_')
        ? positions[positions.length - 1]
        : positions[0]

      if (this.board.grid[firstLetterPos.row]?.[firstLetterPos.col]) {
        this.board.grid[firstLetterPos.row][firstLetterPos.col].isHinted = true
      }
    }

    return {
      wordId: randomWord.id,
      wordText: randomWord.text,
      hint: randomWord.hint,
      direction: randomWord.direction,
    }
  }

  validateSelection(positions: Position[]): string | null {
    if (positions.length === 0) return null

    const selectionText = positions.map(pos => this.board.grid[pos.row][pos.col].letter).join('')

    for (const word of this.words) {
      if (!word.found) {
        if (word.text === selectionText || word.text === selectionText.split('').reverse().join('')) {
          return word.id
        }
      }
    }

    return null
  }

  markWordAsFound(wordId: string): boolean {
    const word = this.words.find(w => w.id === wordId)
    if (word) {
      word.found = true

      // Obtém todas as posições da palavra e remove o estado de dica (isHinted = false)
      const positions = this.getWordPositions(word.text, word.startPos, word.direction)
      if (positions) {
        positions.forEach(pos => {
          if (this.board.grid[pos.row]?.[pos.col]) {
            this.board.grid[pos.row][pos.col].isHinted = false
          }
        })
      }

      return true
    }
    return false
  }

  getBoard(): GameBoard {
    return this.board
  }

  getWords(): Word[] {
    return this.words
  }

  getRemainingWords(): Word[] {
    return this.words.filter(w => !w.found)
  }

  isGameComplete(): boolean {
    return this.words.every(w => w.found)
  }

  calculatePositionsPath(start: Position, end: Position): Position[] {
    const path: Position[] = []
    const dx = Math.sign(end.col - start.col)
    const dy = Math.sign(end.row - start.row)

    let current = { ...start }

    while (true) {
      path.push({ ...current })

      if (current.row === end.row && current.col === end.col) break

      if (current.row !== end.row) current.row += dy
      if (current.col !== end.col) current.col += dx
    }

    return path
  }
}