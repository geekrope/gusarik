"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core;
(function (Core) {
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
    Core.StringParameter = StringParameter;
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
    Core.NumericalParameter = NumericalParameter;
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
    Core.QueryAdapter = QueryAdapter;
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
    Core.GameRegister = GameRegister;
})(Core || (Core = {}));
exports.default = Core;
//# sourceMappingURL=core.js.map