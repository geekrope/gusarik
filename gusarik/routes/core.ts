module Core
{
	export interface Parameter
	{
		get name(): string;
		get value(): any;
	}

	export class StringParameter implements Parameter
	{
		private _name: string;
		private _value: string;

		public get name(): string
		{
			return this._name;
		}
		public get value(): string
		{
			return this._value;
		}

		public constructor(name: string, value: string)
		{
			this._name = name;
			this._value = value;
		}
	}

	export class NumericalParameter implements Parameter
	{
		private _name: string;
		private _value: number;

		public get name(): string
		{
			return this._name;
		}
		public get value(): number
		{
			return this._value;
		}

		public constructor(name: string, value: number)
		{
			this._name = name;
			this._value = value;
		}
	}

	export interface GameRequest
	{
		getParameter(name: string): Parameter | undefined;
	}

	export class QueryAdapter implements GameRequest
	{
		private _adaptee: any;

		public getParameter(name: string): Parameter | undefined
		{
			const value = this._adaptee[name] as string;
			const asNumber = Number(value);

			if (value && !isNaN(asNumber))
			{
				return new NumericalParameter(name, asNumber);
			}
			else if (value)
			{
				return new StringParameter(name, value);
			}

			return undefined;
		}

		public constructor(query: any)
		{
			this._adaptee = query;
		}
	}

	export interface Game
	{
		getState(parameters: GameRequest): GameState | undefined;
		processAction(parameters: GameRequest): Parameter[];
	}

	export interface GameState
	{

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