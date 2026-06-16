// Game Engine - Core da lógica do jogo
import { GameDifficulty, WordDirection, } from '@types/index';
const WORD_DICTIONARY = [
    'TYPESCRIPT',
    'JAVASCRIPT',
    'REACT',
    'VITE',
    'TAILWIND',
    'DATABASE',
    'ALGORITMO',
    'DESENVOLVIMENTO',
    'INTERFACE',
    'COMPONENTE',
    'FUNÇÃO',
    'ESTADO',
    'CONTEXTO',
    'MIDDLEWARE',
    'PERFORMANCE',
    'OTIMIZAÇÃO',
    'SEGURANÇA',
    'VALIDAÇÃO',
    'AUTENTICAÇÃO',
    'AUTORIZAÇÃO',
    'CRIPTOGRAFIA',
    'SESSÃO',
    'TOKEN',
    'SERVIDOR',
    'CLIENTE',
    'PROTOCOLO',
    'REQUISIÇÃO',
    'RESPOSTA',
    'ERRO',
    'EXCEÇÃO',
];
export class GameEngine {
    constructor() {
        Object.defineProperty(this, "board", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "words", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.board = this.initializeBoard(10, 10);
        this.words = [];
    }
    initializeBoard(width, height) {
        const grid = Array(height)
            .fill(null)
            .map(() => Array(width)
            .fill(null)
            .map(() => ({
            letter: '',
            wordIds: [],
            isSelected: false,
        })));
        return {
            grid,
            width,
            height,
            words: [],
        };
    }
    generateBoard(difficulty, width = 10, height = 10) {
        this.board = this.initializeBoard(width, height);
        this.words = [];
        const wordCount = this.getWordCountByDifficulty(difficulty);
        const selectedWords = this.selectRandomWords(wordCount);
        // Inserir palavras no tabuleiro
        for (const word of selectedWords) {
            let attempts = 0;
            const maxAttempts = 50;
            while (attempts < maxAttempts) {
                const direction = this.getRandomDirectionByDifficulty(difficulty);
                const position = this.getRandomPosition();
                if (this.canPlaceWord(word, position, direction)) {
                    this.placeWord(word, position, direction);
                    break;
                }
                attempts++;
            }
        }
        // Preencher espaços vazios com letras aleatórias
        this.fillEmptySpaces();
        this.board.words = this.words;
        return this.board;
    }
    getWordCountByDifficulty(difficulty) {
        switch (difficulty) {
            case GameDifficulty.EASY:
                return 5;
            case GameDifficulty.MEDIUM:
                return 8;
            case GameDifficulty.HARD:
                return 12;
            default:
                return 8;
        }
    }
    selectRandomWords(count) {
        const selected = [];
        const shuffled = [...WORD_DICTIONARY].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    getRandomDirectionByDifficulty(difficulty) {
        const random = Math.random();
        if (difficulty === GameDifficulty.EASY) {
            // Apenas horizontal e vertical
            return random > 0.5 ? WordDirection.HORIZONTAL : WordDirection.VERTICAL;
        }
        else if (difficulty === GameDifficulty.MEDIUM) {
            // Adicionar diagonais
            if (random < 0.33)
                return WordDirection.HORIZONTAL;
            if (random < 0.66)
                return WordDirection.VERTICAL;
            return random > 0.83 ? WordDirection.DIAGONAL_DOWN : WordDirection.DIAGONAL_UP;
        }
        else {
            // Difícil: todas as direções incluindo invertidas
            const directions = Object.values(WordDirection);
            return directions[Math.floor(Math.random() * directions.length)];
        }
    }
    getRandomPosition() {
        return {
            row: Math.floor(Math.random() * this.board.height),
            col: Math.floor(Math.random() * this.board.width),
        };
    }
    canPlaceWord(word, startPos, direction) {
        const positions = this.getWordPositions(word, startPos, direction);
        if (!positions)
            return false;
        for (const pos of positions) {
            if (this.board.grid[pos.row]?.[pos.col]?.letter !== '') {
                const existingLetter = this.board.grid[pos.row][pos.col].letter;
                if (existingLetter !== word[positions.indexOf(pos)]) {
                    return false;
                }
            }
        }
        return true;
    }
    getWordPositions(word, startPos, direction) {
        const positions = [];
        let row = startPos.row;
        let col = startPos.col;
        const wordToPlace = direction.startsWith('reverse_') ? word.split('').reverse().join('') : word;
        for (let i = 0; i < wordToPlace.length; i++) {
            if (row < 0 || row >= this.board.height || col < 0 || col >= this.board.width) {
                return null;
            }
            positions.push({ row, col });
            switch (direction) {
                case WordDirection.HORIZONTAL:
                case WordDirection.REVERSE_HORIZONTAL:
                    col++;
                    break;
                case WordDirection.VERTICAL:
                case WordDirection.REVERSE_VERTICAL:
                    row++;
                    break;
                case WordDirection.DIAGONAL_DOWN:
                case WordDirection.REVERSE_DIAGONAL_DOWN:
                    row++;
                    col++;
                    break;
                case WordDirection.DIAGONAL_UP:
                case WordDirection.REVERSE_DIAGONAL_UP:
                    row--;
                    col++;
                    break;
            }
        }
        return positions;
    }
    placeWord(word, startPos, direction) {
        const positions = this.getWordPositions(word, startPos, direction);
        if (!positions)
            return;
        const wordId = `word_${this.words.length}`;
        const wordToPlace = direction.startsWith('reverse_') ? word.split('').reverse().join('') : word;
        for (let i = 0; i < wordToPlace.length; i++) {
            const pos = positions[i];
            this.board.grid[pos.row][pos.col].letter = wordToPlace[i];
            this.board.grid[pos.row][pos.col].wordIds.push(wordId);
        }
        this.words.push({
            id: wordId,
            text: word,
            startPos,
            endPos: positions[positions.length - 1],
            direction,
            hint: `Procure: ${word}`,
            found: false,
        });
    }
    fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let row = 0; row < this.board.height; row++) {
            for (let col = 0; col < this.board.width; col++) {
                if (this.board.grid[row][col].letter === '') {
                    this.board.grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
    validateSelection(positions) {
        if (positions.length === 0)
            return null;
        const selectionText = positions.map(pos => this.board.grid[pos.row][pos.col].letter).join('');
        // Procurar a palavra exatamente como está
        for (const word of this.words) {
            if (!word.found) {
                if (word.text === selectionText || word.text === selectionText.split('').reverse().join('')) {
                    return word.id;
                }
            }
        }
        return null;
    }
    markWordAsFound(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (word) {
            word.found = true;
            return true;
        }
        return false;
    }
    getBoard() {
        return this.board;
    }
    getWords() {
        return this.words;
    }
    getRemainingWords() {
        return this.words.filter(w => !w.found);
    }
    isGameComplete() {
        return this.words.every(w => w.found);
    }
    calculatePositionsPath(start, end) {
        const path = [];
        const dx = Math.sign(end.col - start.col);
        const dy = Math.sign(end.row - start.row);
        let current = { ...start };
        while (true) {
            path.push({ ...current });
            if (current.row === end.row && current.col === end.col)
                break;
            if (current.row !== end.row)
                current.row += dy;
            if (current.col !== end.col)
                current.col += dx;
        }
        return path;
    }
}
