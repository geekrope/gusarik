import express = require('express');
const router = express.Router();

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
				return !this.state.board[x.value]![y.value];
			}
		}

		return false;
	}

	public getState(_parameters: GameRequest): TicTacState
	{
		return this.state;
	}
	public processAction(parameters: GameRequest): Parameter[]
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

		return [];
	}

	public constructor()
	{
		this.turn = 1;
		this.state = new TicTacState(this.turn);
	}
}


const game = new TicTacGame();
GameRegister.instance.register(228, game);

router.get('/', (_req: express.Request, res: express.Response) =>
{
	res.sendFile(__dirname + `\\index.html`);
});

router.get('/state', (req: express.Request, res: express.Response) =>
{
	const query = new QueryAdapter(req.query);
	const id = query.getParameter("id");

	if (id && id instanceof NumericalParameter)
	{
		const state = GameRegister.instance.request(id.value)?.getState(query);
		res.send(JSON.stringify(state));
	}
});

router.get('/act', (req: express.Request, _res: express.Response) =>
{
	const query = new QueryAdapter(req.query);
	const id = query.getParameter("id") as NumericalParameter;

	if (id)
	{
		const game = GameRegister.instance.request(id.value);

		game?.processAction(query);
	}
});

export default router;