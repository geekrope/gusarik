"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const core_1 = require("./core");
class PlaceAction {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.playerId = "0";
    }
}
class TicTacState {
    constructor(turn) {
        this.board = [];
        this.turn = turn;
        this.gamePhase = core_1.default.GamePhase.waitingForOthers;
        for (let i = 0; i < 3; i++) {
            this.board.push(new Array(3));
        }
    }
}
class TicTacGame extends core_1.default.Game {
    getState(_parameters) {
        return this.state;
    }
    processAction(actionType, action) {
        if (this.state.gamePhase == core_1.default.GamePhase.started) {
            if (actionType == "place") {
                const placeAction = core_1.default.DataTransferObjectValidator.validate(PlaceAction, action);
                if (placeAction.playerId == (this.state.turn == 1 ? this.registeredPlayers[0].id : this.registeredPlayers[1].id)) {
                    this.state.board[placeAction.x][placeAction.y] = this.state.turn;
                }
                else {
                    throw new Error("Not your turn");
                }
            }
        }
        else {
            throw new Error("Game hasn't started yet: waiting for others to join");
        }
        this.state.turn = this.state.turn == 1 ? 2 : 1;
        return new core_1.default.EmptyDataTransferObject();
    }
    constructor(tokenGenerator) {
        super(tokenGenerator);
        this.state = new TicTacState(1);
        this.addEventListener("onPlayerRegistered", () => {
            if (this._registeredPlayers.length == 2) {
                this.state.gamePhase = core_1.default.GamePhase.started;
            }
        });
    }
}
const game = new TicTacGame(new core_1.default.RandomTokenGenerator());
const register = new core_1.default.GameRegister(new core_1.default.RandomTokenGenerator());
const id = register.registerGame(game);
router.get('/', (_req, res) => {
    res.sendFile(__dirname + `\\index.html`);
});
router.get('/join', (req, res) => {
    const gameId = req.query["id"];
    const name = req.query["name"];
    if (gameId && name) {
        const game = register.requestGame(id.toString());
        res.send(game.registerPlayer(name.toString()).id);
    }
});
router.get('/state', (req, res) => {
    var _a;
    const gameId = req.query["id"];
    if (gameId) {
        const state = (_a = register.requestGame(gameId.toString())) === null || _a === void 0 ? void 0 : _a.getState(new core_1.default.EmptyDataTransferObject());
        res.send(state);
    }
});
router.get('/act', (req, _res) => {
    const playerId = req.query["playerId"];
    const gameId = req.query["gameId"];
    if (playerId && gameId) {
        const game = register.requestGame(gameId.toString());
        game.processAction("place", req.query);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map