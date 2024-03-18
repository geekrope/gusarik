"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core;
(function (Core) {
    class DataTransferObjectValidator {
        static validateObjectKeys(source, target) {
            const keys = Object.keys(target);
            keys.forEach((key) => {
                const value = source[key];
                if (value === undefined) {
                    throw new Error(`Field ${key} in source `);
                }
                else {
                    target[key] = this.validateRecursive(source[key], value);
                }
            });
            return target;
        }
        static validateRecursive(source, target) {
            const sourceType = typeof source;
            const targetType = typeof target;
            const sourceAsArray = source instanceof Array;
            const targetAsArray = target instanceof Array;
            switch (targetType) {
                case "boolean":
                case "number":
                case "string":
                    if (sourceType != targetType) {
                        throw new TypeError(`Type ${sourceType} is not assignable to a variable of type ${targetType}`);
                    }
                    return source;
                default:
                    if (sourceAsArray && targetAsArray) {
                        source.forEach((item) => {
                            target.push(item); //??? validattion
                        });
                    }
                    else if (sourceAsArray != targetAsArray) {
                        throw new TypeError(`Type ${sourceType} is not assignable to a variable of type ${targetType}`);
                    }
                    return this.validateObjectKeys(source, target);
            }
        }
        static validate(ctor, source) {
            const target = new ctor();
            return this.validateRecursive(source, target);
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
        GamePhase[GamePhase["ended"] = 2] = "ended";
    })(GamePhase = Core.GamePhase || (Core.GamePhase = {}));
    class Game {
        get registeredPlayers() {
            return this._registeredPlayers;
        }
        addEventListener(type, eventHandler) {
            switch (type) {
                case "onPlayerRegistered":
                    this._onPlayerRegistered.push(eventHandler);
                    break;
                default:
                    throw new Error(`Unknown event type: ${type}`);
            }
        }
        registerPlayer(name) {
            if (this._playersCount === undefined || this._registeredPlayers.length < this._playersCount) {
                const player = new Player(this._tokenGenerator.next(), name);
                this._registeredPlayers.push(player);
                this._onPlayerRegistered.forEach((eventHandler) => {
                    eventHandler(player);
                });
                return player;
            }
            throw new Error("Unable to register new player: maximum number of players have already registered");
        }
        constructor(tokenGenerator, playersCount = undefined) {
            this._registeredPlayers = [];
            this._onPlayerRegistered = [];
            this._tokenGenerator = tokenGenerator;
            this._playersCount = playersCount;
        }
    }
    Core.Game = Game;
    class RandomTokenGenerator {
        next() {
            return (++this._counter).toString();
        }
        constructor() {
            this._counter = 0;
        }
    }
    Core.RandomTokenGenerator = RandomTokenGenerator;
    class GameRegister {
        requestGame(id) {
            if (this._games.has(id)) {
                return this._games.get(id);
            }
            else {
                throw new Error(`Game is not found. id: ${id}`);
            }
        }
        registerGame(game) {
            const id = this._tokenGenerator.next();
            this._games.set(id, game);
            return id;
        }
        constructor(tokenGenerator) {
            this._games = new Map();
            this._tokenGenerator = tokenGenerator;
        }
    }
    Core.GameRegister = GameRegister;
})(Core || (Core = {}));
exports.default = Core;
//# sourceMappingURL=core.js.map