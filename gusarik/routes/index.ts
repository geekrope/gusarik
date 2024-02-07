import express = require('express');
const router = express.Router();

interface Parameter
{
	get value(): any;
}

class StringParameter implements Parameter
{
	private _value: string;

	public get value(): string
	{
		return this._value;
	}

	public constructor(value: string)
	{
		this._value = value;
	}
}

class NumericalParameter implements Parameter
{
	private _value: number;

	public get value(): number
	{
		return this._value;
	}

	public constructor(value: number)
	{
		this._value = value;
	}
}

interface GameRequest
{
	getParameter(name: string): Parameter;
}

interface GameResponse
{
	forEach(action: (paramter: Parameter) => void): void;
}

class NullResponse implements GameResponse
{
	public forEach(_action: (paramter: Parameter) => void): void
	{

	}
}

interface Game
{
	getState(parameters: GameRequest): GameState | undefined;
	processAction(parameters: GameRequest): GameResponse;
}

interface GameState
{

}

class TicTacState implements GameState
{
	public board: number[][];
	public turn: number;
	public outcome: number | undefined;

	public constructor(turn: number)
	{
		this.board = [];
		this.turn = turn;
		for (let i: number = 0; i < 3; i++)
		{
			this.board.push(new Array(3));
		}
	}
}

class TicTacGame implements Game
{
	private turn: number;
	private state: TicTacState;

	private validateAction(action: GameRequest): boolean
	{
		const type = action.getParameter("type") as StringParameter;
		const turn = action.getParameter("turn") as NumericalParameter;

		if (type.value == "place")
		{
			const x = action.getParameter("x");
			const y = action.getParameter("y");

			if (turn.value != this.turn)
			{
				return false;
			}

			if (x instanceof NumericalParameter && y instanceof NumericalParameter)
			{
				return this.state.board[x.value]![y.value] == 0;
			}
		}

		return false;
	}

	public getState(_parameters: GameRequest): TicTacState
	{
		return this.state;
	}
	public processAction(parameters: GameRequest): NullResponse
	{
		if (this.validateAction(parameters))
		{
			const type = parameters.getParameter("type") as StringParameter;

			if (type.value == "place")
			{
				const x = parameters.getParameter("x") as NumericalParameter;
				const y = parameters.getParameter("y") as NumericalParameter;
				this.state.board[x.value]![y.value] = this.turn;
			}
		}

		this.turn = this.turn == 1 ? 2 : 1;

		return new NullResponse();
	}

	public constructor()
	{
		this.turn = 1;
		this.state = new TicTacState(this.turn);
	}
}

class GameRegister
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

const game = new TicTacGame();

router.get('/', (_req: express.Request, res: express.Response) =>
{
	res.sendFile(__dirname + `\\index.html`);
});

router.get('/state', (_req: express.Request, _res: express.Response) =>
{

});

export default router;