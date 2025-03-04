import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./Messages";
import { Game } from "./Game";


export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null;// will make new user class as addition
    private users: WebSocket[];
    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
        //this will disconnect the users for now 
        // need to add reconnection logic in future
    }

    private addHandler(socket:WebSocket){

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // we have 2 players we can start the game
                    // remove the pending user
                    // match these 2 players -> pending + newUser

                    const player1 = this.pendingUser;
                    this.pendingUser = null;
                    const player2 = socket;
                    const game = new Game(player1,player2);
                    this.games.push(game)
                } else this.pendingUser = socket;
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        })

    }
}