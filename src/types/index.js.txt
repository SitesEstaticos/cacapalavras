// Types para o jogo de caça-palavras
export var GameDifficulty;
(function (GameDifficulty) {
    GameDifficulty["EASY"] = "easy";
    GameDifficulty["MEDIUM"] = "medium";
    GameDifficulty["HARD"] = "hard";
})(GameDifficulty || (GameDifficulty = {}));
export var WordDirection;
(function (WordDirection) {
    WordDirection["HORIZONTAL"] = "horizontal";
    WordDirection["VERTICAL"] = "vertical";
    WordDirection["DIAGONAL_DOWN"] = "diagonal_down";
    WordDirection["DIAGONAL_UP"] = "diagonal_up";
    WordDirection["REVERSE_HORIZONTAL"] = "reverse_horizontal";
    WordDirection["REVERSE_VERTICAL"] = "reverse_vertical";
    WordDirection["REVERSE_DIAGONAL_DOWN"] = "reverse_diagonal_down";
    WordDirection["REVERSE_DIAGONAL_UP"] = "reverse_diagonal_up";
})(WordDirection || (WordDirection = {}));
