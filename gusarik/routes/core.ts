module Core
{
    export interface DataTransferObjectConstructor<T>
    {
        new(): T; //instantiates DataTransferObject
    }

    export class DataTransferObjectValidator
    {
        public static validate<T>(ctor: DataTransferObjectConstructor<T>, object: any): T
        {
            const result: any = new ctor();

            for (const key in Object.keys(result))
            {
                const value = object[key];

                //typeof works only for basic structures (integer, string, boolean etc.)
                if (value === undefined || typeof object[key] != typeof result[key])
                {
                    throw new TypeError('The object argument is not assignable to type T');
                }
            }

            return object as T;
        }
    }

    export class EmptyDataTransferObject
    {
        constructor()
        {
        }
    }

    export interface Player
    {
        get name(): string;
        get id(): string;
    }

    export interface GameState
    {
        get players(): Player[];
        get nexPlayers(): Player[]
        get winners(): Player[];
    }

    export interface Game
    {
        getState(parameters?: any): GameState;
        processAction(actionType: string, actionData?: any): any;
    }

    export type GameToken = string;

    export class GameRegister
    {
        private readonly _games: Map<GameToken, Game> = new Map<GameToken, Game>();

        public request(id: GameToken): Game
        {
            const game = this._games.get(id);
            if (game)
                return game;

            throw new Error('');
        }

        public register(id: GameToken, game: Game)
        {
            this._games.set(id, game);
        }
    }
}

export default Core;