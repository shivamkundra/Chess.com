"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        //this will disconnect the users for now 
        // need to add reconnection logic in future
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === Messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    // we have 2 players we can start the game
                    // remove the pending user
                    // match these 2 players -> pending + newUser
                    const player1 = this.pendingUser;
                    this.pendingUser = null;
                    const player2 = socket;
                    const game = new Game_1.Game(player1, player2);
                    this.games.push(game);
                }
                else
                    this.pendingUser = socket;
            }
            if (message.type === Messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
