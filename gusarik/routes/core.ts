module Core
{
	export interface DataTransferObjectConstructor<T>
	{
		new(): T; //instantiates DataTransferObject
	}

	export class DataTransferObjectValidator
	{
		public static validate<T>(ctor: DataTransferObjectConstructor<T>, object: any): T | undefined
		{
			const result: any = new ctor();

			for (const key in Object.keys(result))
			{
				const value = object[key];

				//typeof works only for basic structures (integer, string, boolean etc.)
				if (value === undefined || typeof object[key] != typeof result[key])
				{
					return undefined;
				}
				else
				{
					result[key];
				}
			}

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

	export interface GameState
	{

	}

	export interface Game
	{
		get registeredPlayers(): string[];
		getState(parameters: any): GameState;
		processAction(actionType: string, parameters: any): any;
	}

	interface GuidGenerator
	{
		generate(): string;
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
			const id = this._guidGenerator.generate();
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