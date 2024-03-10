"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core;
(function (Core) {
    class DataTransferObjectValidator {
        static validate(ctor, object) {
            const result = new ctor();
            const keys = Object.keys(result);
            keys.forEach((key) => {
                const value = object[key];
                if (value === undefined /*|| typeof object[key] != typeof result[key]*/) {
                    throw new Error(`Type ${typeof object} is not assignable to a variable of type ${typeof result}`);
                }
                else {
                    result[key] = value;
                }
            });
            return result;
        }
    }
    Core.DataTransferObjectValidator = DataTransferObjectValidator;
    class EmptyDataTransferObject {
        new() {
            return new EmptyDataTransferObject();
        }
    }
    Core.EmptyDataTransferObject = EmptyDataTransferObject;
    class Player {
        get id() {
            return this._id;
        }
        get name() {
            return this._name;
        }
        constructor(id, name) {
            this._id = id;
            this._name = name;
        }
    }
    Core.Player = Player;
    let GamePhase;
    (function (GamePhase) {
        GamePhase[GamePhase["waitingForOthers"] = 0] = "waitingForOthers";
        GamePhase[GamePhase["started"] = 1] = "started";
    })(GamePhase = Core.GamePhase || (Core.GamePhase = {}));
    class RandomGuidGenerator {
        next() {
            return (++this._counter).toString();
        }
        constructor() {
            this._counter = 0;
        }
    }
    Core.RandomGuidGenerator = RandomGuidGenerator;
    class GameRegister {
        request(id) {
            if (this._games.has(id)) {
                return this._games.get(id);
            }
            else {
                throw new Error(`Game is not found. id: ${id}`);
            }
        }
        register(game) {
            const id = this._guidGenerator.next();
            this._games.set(id, game);
            return id;
        }
        constructor(guidGenerator) {
            this._games = new Map();
            this._guidGenerator = guidGenerator;
        }
    }
    Core.GameRegister = GameRegister;
})(Core || (Core = {}));
exports.default = Core;
//# sourceMappingURL=core.js.map