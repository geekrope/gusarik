import express = require('express');
const router = express.Router();

import Core from './core';

type PlaceAction = { x: number, y: number, turn: number };

class PlaceActionConstructor
{
	new(): PlaceAction
	{
		return { x: -1, y: -1, turn: -1 };
	}
}

type ticTacAction = "xz" | "place";

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

	public getState(_parameters: any): TicTacState
	{
		return this.state;
	}
	public processAction(actionType: ticTacAction, action: any): any
	{
		if (actionType == "place")
		{
			const placeAction = Core.DataTransferObjectValidator.validate<PlaceAction>(PlaceActionConstructor as unknown as Core.DataTransferObjectConstructor<PlaceAction>, action,);

			this.state.board[placeAction!.x]![placeAction!.y] = this.turn;
		}

		this.turn = this.turn == 1 ? 2 : 1;

		return new Core.EmptyDataTransferObject();
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
	const id = req.query["id"];

	if (id && !isNaN(Number(id)))
	{
		const state = Core.GameRegister.instance.request(Number(id))?.getState(new Core.EmptyDataTransferObject());
		res.send(JSON.stringify(state));
	}
});

router.get('/act', (req: express.Request, _res: express.Response) =>
{
	const id = req.query["id"];

	if (id && !isNaN(Number(id)))
	{
		const game = Core.GameRegister.instance.request(Number(id));

		game?.processAction("place",req.query);
	}
});

export default router;