import express = require('express');
const router = express.Router();

import Core from './core';

class TicTacState implements Core.GameState
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

class TicTacGame implements Core.Game
{
	private turn: number;
	private state: TicTacState;

	private validateAction(action: Core.GameRequest): boolean
	{
		const type = action.getParameter("type") as Core.StringParameter;
		const turn = action.getParameter("turn") as Core.NumericalParameter;

		if (type.value == "place")
		{
			const x = action.getParameter("x");
			const y = action.getParameter("y");

			if (turn.value != this.turn)
			{
				return false;
			}

			if (x instanceof Core.NumericalParameter && y instanceof Core.NumericalParameter)
			{
				return !this.state.board[x.value]![y.value];
			}
		}

		return false;
	}

	public getState(_parameters: Core.GameRequest): TicTacState
	{
		return this.state;
	}
	public processAction(parameters: Core.GameRequest): Core.Parameter[]
	{
		if (this.validateAction(parameters))
		{
			const type = parameters.getParameter("type") as Core.StringParameter;

			if (type.value == "place")
			{
				const x = parameters.getParameter("x") as Core.NumericalParameter;
				const y = parameters.getParameter("y") as Core.NumericalParameter;
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
Core.GameRegister.instance.register(228, game);

router.get('/', (_req: express.Request, res: express.Response) =>
{
	res.sendFile(__dirname + `\\index.html`);
});

router.get('/state', (req: express.Request, res: express.Response) =>
{
	const query = new Core.QueryAdapter(req.query);
	const id = query.getParameter("id");

	if (id && id instanceof Core.NumericalParameter)
	{
		const state = Core.GameRegister.instance.request(id.value)?.getState(query);
		res.send(JSON.stringify(state));
	}
});

router.get('/act', (req: express.Request, _res: express.Response) =>
{
	const query = new Core.QueryAdapter(req.query);
	const id = query.getParameter("id") as Core.NumericalParameter;

	if (id)
	{
		const game = Core.GameRegister.instance.request(id.value);

		game?.processAction(query);
	}
});

export default router;