"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
class StringParameter {
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }
}
class NumericalParameter {
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }
}
class QueryAdapter {
    getParameter(name) {
        const value = this._adaptee[name];
        const asNumber = Number(value);
        if (value && !isNaN(asNumber)) {
            return new NumericalParameter(name, asNumber);
        }
        else if (value) {
            return new StringParameter(name, value);
        }
        return undefined;
    }
    constructor(query) {
        this._adaptee = query;
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
                return !this.state.board[x.value][y.value];
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
        return [];
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
const game = new TicTacGame();
GameRegister.instance.register(228, game);
router.get('/', (_req, res) => {
    res.sendFile(__dirname + `\\index.html`);
});
router.get('/state', (req, res) => {
    var _a;
    const query = new QueryAdapter(req.query);
    const id = query.getParameter("id");
    if (id && id instanceof NumericalParameter) {
        const state = (_a = GameRegister.instance.request(id.value)) === null || _a === void 0 ? void 0 : _a.getState(query);
        res.send(JSON.stringify(state));
    }
});
router.get('/act', (req, _res) => {
    const query = new QueryAdapter(req.query);
    const id = query.getParameter("id");
    if (id) {
        const game = GameRegister.instance.request(id.value);
        game === null || game === void 0 ? void 0 : game.processAction(query);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map