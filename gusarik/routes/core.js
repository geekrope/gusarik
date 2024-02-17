"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core;
(function (Core) {
    class DataTransferObjectValidator {
        static validate(ctor, object) {
            const result = new ctor();
            for (const key in Object.keys(result)) {
                const value = object[key];
                if (value === undefined || typeof object[key] != typeof result[key]) {
                    throw new TypeError('The object argument is not assignable to type T');
                }
            }
            return object;
        }
    }
    Core.DataTransferObjectValidator = DataTransferObjectValidator;
    class EmptyDataTransferObject {
        constructor() {
        }
    }
    Core.EmptyDataTransferObject = EmptyDataTransferObject;
    class GameRegister {
        constructor() {
            this._games = new Map();
        }
        request(id) {
            const game = this._games.get(id);
            if (game)
                return game;
            throw new Error('');
        }
        register(id, game) {
            this._games.set(id, game);
        }
    }
    Core.GameRegister = GameRegister;
})(Core || (Core = {}));
exports.default = Core;
//# sourceMappingURL=core.js.map