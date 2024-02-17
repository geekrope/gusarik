"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const core_1 = require("./core");
var TicTac;
(function (TicTac) {
    class State {
        get players() {
            return [];
        }
        get nexPlayers() {
            return [];
        }
        get winners() {
            return [];
        }
        constructor(turn) {
            this.board = [];
            this.turn = turn;
            for (let i = 0; i < 3; i++) {
                this.board.push(new Array(3));
            }
        }
    }
    TicTac.State = State;
    class Game {
        getState(_parameters) {
            return this.state;
        }
        processAction(actionType, actionData) {
            if (actionType == "place") {
                if (!actionData)
                    throw new Error("The place action requires actionData");
                const placeAction = core_1.default.DataTransferObjectValidator.validate(PlaceActionConstructor, actionData);
                this.state.board[placeAction.x][placeAction.y] = this.turn;
            }
            this.turn = this.turn == 1 ? 2 : 1;
            return new core_1.default.EmptyDataTransferObject();
        }
        constructor() {
            this.turn = 1;
            this.state = new State(this.turn);
        }
    }
    TicTac.Game = Game;
    class PlaceActionConstructor {
        new() {
            return { x: -1, y: -1, turn: -1 };
        }
    }
})(TicTac || (TicTac = {}));
class Server {
    constructor() {
        this.gameRegister = new core_1.default.GameRegister();
    }
    getTokenFromRequest(req) {
        var _a, _b;
        const gameToken = (_b = (_a = req.query["id"]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "No valid token";
        return gameToken;
    }
}
const server = new Server();
router.post('/init', (_req, res) => {
    const token = '{33990F06-1217-42C9-B23D-14904E12DF03}';
    const game = new TicTac.Game();
    server.gameRegister.register(token, game);
    res.send({ token: token });
});
router.get('/state', (req, res) => {
    var _a;
    try {
        const gameToken = server.getTokenFromRequest(req);
        const state = (_a = server.gameRegister.request(gameToken)) === null || _a === void 0 ? void 0 : _a.getState(null);
        res.send(state);
    }
    catch (e) {
        res.sendStatus(500);
    }
});
router.get('/act', (req, res) => {
    try {
        const gameToken = server.getTokenFromRequest(req);
        const game = server.gameRegister.request(gameToken);
        game === null || game === void 0 ? void 0 : game.processAction("place", req.query);
    }
    catch (e) {
        res.sendStatus(500);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map