module Core
{
	export interface DataTransferObjectConstructor<T>
	{
		new(): T; //instantiates DataTransferObject
	}

	export class DataTransferObjectValidator
	{
		private static validateObjectKeys(source: any, target: any): any
		{
			const keys = Object.keys(target);

			keys.forEach((key) =>
			{
				const value = source[key];

				if (value === undefined)
				{
					throw new Error(`Field ${key} in source `)
				}
				else
				{
					target[key] = this.validateRecursive(source[key], value);
				}
			});

			return target;
		}
		private static validateRecursive(source: any, target: any): any
		{
			const sourceType = typeof source;
			const targetType = typeof target;
			const sourceAsArray = source instanceof Array;
			const targetAsArray = target instanceof Array;

			switch (targetType)
			{
				case "boolean":
				case "number":
				case "string":
					if (sourceType != targetType)
					{
						throw new TypeError(`Type ${sourceType} is not assignable to a variable of type ${targetType}`)
					}
					return source;
				default:
					if (sourceAsArray && targetAsArray)
					{
						source.forEach((item) =>
						{
							target.push(item); //??? array generic type validation
						})
					}
					else if (sourceAsArray != targetAsArray)
					{
						throw new TypeError(`Type ${sourceType} is not assignable to a variable of type ${targetType}`);
					}

					return this.validateObjectKeys(source, target);
			}
		}

		public static validate<T>(ctor: DataTransferObjectConstructor<T>, source: any): T
		{
			const target = new ctor();

			return this.validateRecursive(source, target);
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
		//...
	}

	export enum GamePhase
	{
		"waitingForOthers", "started", "ended"
	}

	export abstract class Game
	{
		protected _registeredPlayers: Player[];
		protected _tokenGenerator: TokenGenerator;
		protected _onPlayerRegistered: ((player: Player) => void)[];
		protected _playersCount: number | undefined

		public get registeredPlayers(): ReadonlyArray<Player>
		{
			return this._registeredPlayers as ReadonlyArray<Player>;
		}

		abstract getState(parameters: any): GameState;
		abstract processAction(actionType: string, parameters: any): any;
		public addEventListener(type: "onPlayerRegistered", eventHandler: (player: Player) => void): void
		public addEventListener(type: string, eventHandler: any): void
		{
			switch (type)
			{
				case "onPlayerRegistered":
					this._onPlayerRegistered.push(eventHandler);
					break;
				default:
					throw new Error(`Unknown event type: ${type}`);
			}
		}
		public registerPlayer(name: string): Player
		{
			if (this._playersCount === undefined || this._registeredPlayers.length < this._playersCount)
			{
				const player = new Player(this._tokenGenerator.next(), name);
				this._registeredPlayers.push(player);

				this._onPlayerRegistered.forEach((eventHandler) =>
				{
					eventHandler(player);
				});

				return player;
			}

			throw new Error("Unable to register new player: maximum number of players have already registered");
		}

		public constructor(tokenGenerator: TokenGenerator, playersCount: number | undefined = undefined)
		{
			this._registeredPlayers = [];
			this._onPlayerRegistered = [];
			this._tokenGenerator = tokenGenerator;
			this._playersCount = playersCount;
		}
	}

	export interface TokenGenerator
	{
		next(): string;
	}

	export class RandomTokenGenerator implements TokenGenerator
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
		private _tokenGenerator: TokenGenerator;

		public requestGame(id: string): Game
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
		public registerGame(game: Game): string
		{
			const id = this._tokenGenerator.next();
			this._games.set(id, game);

			return id;
		}

		public constructor(tokenGenerator: TokenGenerator)
		{
			this._games = new Map<string, Game>();
			this._tokenGenerator = tokenGenerator;
		}
	}
}

export default Core;