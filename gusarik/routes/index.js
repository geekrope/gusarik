"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const core_1 = require("./core");
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
            if (x instanceof core_1.default.NumericalParameter && y instanceof core_1.default.NumericalParameter) {
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
const game = new TicTacGame();
core_1.default.GameRegister.instance.register(228, game);
router.get('/', (_req, res) => {
    res.sendFile(__dirname + `\\index.html`);
});
router.get('/state', (req, res) => {
    var _a;
    const query = new core_1.default.QueryAdapter(req.query);
    const id = query.getParameter("id");
    if (id && id instanceof core_1.default.NumericalParameter) {
        const state = (_a = core_1.default.GameRegister.instance.request(id.value)) === null || _a === void 0 ? void 0 : _a.getState(query);
        res.send(JSON.stringify(state));
    }
});
router.get('/act', (req, _res) => {
    const query = new core_1.default.QueryAdapter(req.query);
    const id = query.getParameter("id");
    if (id) {
        const game = core_1.default.GameRegister.instance.request(id.value);
        game === null || game === void 0 ? void 0 : game.processAction(query);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map