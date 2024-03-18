import express = require('express');
const router = express.Router();

import Core from './core';

class PlaceAction
{
	public readonly x: number
	public readonly y: number;
	public readonly playerId: string;

	public constructor()
	{
		this.x = 0;
		this.y = 0;
		this.playerId = "0";
	}
}

type ticTacAction = "place";

class TicTacState implements Core.GameState
{
	public board: number[][];
	public turn: number;
	public outcome: number | undefined;
	public gamePhase: Core.GamePhase;

	public constructor(turn: number)
	{
		this.board = [];
		this.turn = turn;
		this.gamePhase = Core.GamePhase.waitingForOthers;
		for (let i: number = 0; i < 3; i++)
		{
			this.board.push(new Array(3));
		}
	}
}

class TicTacGame extends Core.Game
{
	private state: TicTacState;

	public override getState(_parameters: any): TicTacState
	{
		return this.state;
	}
	public override processAction(actionType: ticTacAction, action: any): any
	{
		if (this.state.gamePhase == Core.GamePhase.started)
		{
			if (actionType == "place")
			{
				const placeAction = Core.DataTransferObjectValidator.validate<PlaceAction>(PlaceAction as Core.DataTransferObjectConstructor<PlaceAction>, action);

				if (placeAction.playerId == (this.state.turn == 1 ? this.registeredPlayers[0].id : this.registeredPlayers[1].id))
				{
					this.state.board[placeAction.x][placeAction.y] = this.state.turn;
				}
				else
				{
					throw new Error("Not your turn");
				}
			}
		}
		else
		{
			throw new Error("Game hasn't started yet: waiting for others to join");
		}

		this.state.turn = this.state.turn == 1 ? 2 : 1;

		return new Core.EmptyDataTransferObject();
	}

	public constructor(tokenGenerator: Core.TokenGenerator)
	{
		super(tokenGenerator);
		this.state = new TicTacState(1);
		this.addEventListener("onPlayerRegistered", () =>
		{
			if (this._registeredPlayers.length == 2)
			{
				this.state.gamePhase = Core.GamePhase.started;
			}
		})
	}
}

const game = new TicTacGame(new Core.RandomTokenGenerator());
const register = new Core.GameRegister(new Core.RandomTokenGenerator());
const id = register.registerGame(game);

router.get('/', (_req: express.Request, res: express.Response) =>
{
	res.sendFile(__dirname + `\\index.html`);
});

router.get('/join', (req: express.Request, res: express.Response) =>
{
	const gameId = req.query["id"];
	const name = req.query["name"];

	if (gameId && name)
	{
		const game = register.requestGame(id.toString());
		res.send(game.registerPlayer(name.toString()).id);
	}
});

router.get('/state', (req: express.Request, res: express.Response) =>
{
	const gameId = req.query["id"];

	if (gameId)
	{
		const state = register.requestGame(gameId.toString())?.getState(new Core.EmptyDataTransferObject());
		res.send(state);
	}
});

router.get('/act', (req: express.Request, _res: express.Response) =>
{
	const playerId = req.query["playerId"];
	const gameId = req.query["gameId"];

	if (playerId && gameId)
	{
		const game = register.requestGame(gameId.toString());

		game.processAction("place", req.query);
	}
});

export default router;