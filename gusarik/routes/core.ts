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
		getState(parameters: any): GameState | undefined;
		processAction(actionType: string, parameters: any): any;
	}

	export class GameRegister
	{
		private _games: Map<number, Game>;
		private static _instance: GameRegister | undefined;

		public static get instance(): GameRegister
		{
			return (this._instance == undefined ? this._instance = new GameRegister() : this._instance);
		}

		public request(id: number): Game | undefined
		{
			if (this._games.has(id))
			{
				return this._games.get(id);
			}



			return undefined;
		}
		public register(id: number, game: Game)
		{
			this._games.set(id, game);
		}

		private constructor()
		{
			this._games = new Map<number, Game>();
		}
	}
}

export default Core;