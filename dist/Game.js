"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // check if :
        // 1. this is current users move
        // 2. is this move valid
        if (this.board.moves.length % 2 === 0 && socket !== this.player1)
            return;
        if (this.board.moves.length % 2 === 1 && socket !== this.player2)
            return;
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        // if yes:
        // check if game is over
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: Messages_1.GAME_OVER,
                playload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        if (this.board.moves.length % 2 === 0) {
            this.player2.emit(JSON.stringify({
                type: Messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.emit(JSON.stringify({
                type: Messages_1.MOVE,
                payload: move
            }));
        }
        // send the updated board to both players
    }
}
exports.Game = Game;
