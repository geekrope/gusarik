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
			const keys = Object.keys(result);

			keys.forEach((key) =>
			{
				const value = object[key];

				if (value === undefined/*|| typeof object[key] != typeof result[key]*/)
				{
					throw new Error(`Type ${typeof object} is not assignable to a variable of type ${typeof result}`)
				}
				else
				{
					result[key] = value;
				}
			});

			return result;
		}
	}

	export class EmptyDataTransferObject
	{
		new(): EmptyDataTransferObject
		{
			return new EmptyDataTransferObject();
		}
	}

	export class Player
	{
		private _id: string;
		private _name: string;

		public get id(): string
		{
			return this._id;
		}
		public get name(): string
		{
			return this._name;
		}

		public constructor(id: string, name: string)
		{
			this._id = id;
			this._name = name;
		}
	}

	export interface GameState
	{
		get gamePhase(): GamePhase;
	}

	export enum GamePhase
	{
		"waitingForOthers", "started"
	}

	export interface Game
	{
		get registeredPlayers(): string[]

		getState(parameters: any): GameState;
		processAction(actionType: string, parameters: any): any;
		join(name: string): string;
	}

	export interface GuidGenerator
	{
		next(): string;
	}

	export class RandomGuidGenerator implements GuidGenerator
	{
		private _counter: number;

		public next(): string
		{
			return (++this._counter).toString();
		}

		public constructor()
		{
			this._counter = 0;
		}
	}

	export class GameRegister
	{
		private _games: Map<string, Game>;
		private _guidGenerator: GuidGenerator;

		public request(id: string): Game
		{
			if (this._games.has(id))
			{
				return this._games.get(id)!;
			}
			else
			{
				throw new Error(`Game is not found. id: ${id}`);
			}
		}
		public register(game: Game): string
		{
			const id = this._guidGenerator.next();
			this._games.set(id, game);

			return id;
		}

		public constructor(guidGenerator: GuidGenerator)
		{
			this._games = new Map<string, Game>();
			this._guidGenerator = guidGenerator;
		}
	}
}

export default Core;