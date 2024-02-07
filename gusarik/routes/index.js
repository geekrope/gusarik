"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/', (_req, res) => {
    res.sendFile(__dirname + `\\index.html`);
});
class StringParameter {
    get value() {
        return this._value;
    }
    constructor(value) {
        this._value = value;
    }
}
class NumericalParameter {
    get value() {
        return this._value;
    }
    constructor(value) {
        this._value = value;
    }
}
class NullResponse {
    forEach(_action) {
    }
}
class TicTacState {
    constructor(turn) {
        this.board = [];
        this.turn = turn;
        for (let i = 0; i < 3; i++) {
            this.board.push(new Array(3));
        }
    }
}
class TicTacGame {
    validateAction(action) {
        const type = action.getParameter("type");
        const turn = action.getParameter("turn");
        if (type.value == "place") {
            const x = action.getParameter("x");
            const y = action.getParameter("y");
            if (turn.value != this.turn) {
                return false;
            }
            if (x instanceof NumericalParameter && y instanceof NumericalParameter) {
                return this.state.board[x.value][y.value] == 0;
            }
        }
        return false;
    }
    getState(_parameters) {
        return this.state;
    }
    processAction(parameters) {
        if (this.validateAction(parameters)) {
            const type = parameters.getParameter("type");
            if (type.value == "place") {
                const x = parameters.getParameter("x");
                const y = parameters.getParameter("y");
                this.state.board[x.value][y.value] = this.turn;
            }
        }
        this.turn = this.turn == 1 ? 2 : 1;
        return new NullResponse();
    }
    constructor() {
        this.turn = 1;
        this.state = new TicTacState(this.turn);
    }
}
class GameRegister {
    static get instance() {
        return (this._instance == undefined ? this._instance = new GameRegister() : this._instance);
    }
    request(id) {
        if (this._games.has(id)) {
            return this._games.get(id);
        }
        return undefined;
    }
    register(id, game) {
        this._games.set(id, game);
    }
    constructor() {
        this._games = new Map();
    }
}
exports.default = router;
//# sourceMappingURL=index.js.map