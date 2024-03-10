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

class TicTacGame implements Core.Game
{
	private firstPlayer: Core.Player | undefined;
	private secondPlayer: Core.Player | undefined;
	private state: TicTacState;
	private guid: Core.GuidGenerator;

	public get registeredPlayers()
	{
		return ["lox"];
	}

	public getState(_parameters: any): TicTacState
	{
		return this.state;
	}
	public processAction(actionType: ticTacAction, action: any): any
	{
		if (this.state.gamePhase == Core.GamePhase.started)
		{
			if (actionType == "place")
			{
				const placeAction = Core.DataTransferObjectValidator.validate<PlaceAction>(PlaceAction as Core.DataTransferObjectConstructor<PlaceAction>, action);

				if (placeAction.playerId == (this.state.turn == 1 ? this.firstPlayer?.id : this.secondPlayer?.id))
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
	public join(name: string): string
	{
		const uniqueId = this.guid.next();
		if (!this.firstPlayer)
		{
			this.firstPlayer = new Core.Player(uniqueId, name);
		}
		else if (!this.secondPlayer)
		{
			this.secondPlayer = new Core.Player(uniqueId, name);
			this.state.gamePhase = Core.GamePhase.started;
		}
		else
		{
			throw new Error("Players limit has already been reached");
		}

		return uniqueId;
	}

	public constructor(guid: Core.GuidGenerator)
	{
		this.guid = guid;
		this.state = new TicTacState(1);
	}
}

const game = new TicTacGame(new Core.RandomGuidGenerator());
const register = new Core.GameRegister(new Core.RandomGuidGenerator());
const id = register.register(game);

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
		const game = register.request(id.toString());
		res.send(game.join(name.toString()));
	}
});

router.get('/state', (req: express.Request, res: express.Response) =>
{
	const gameId = req.query["id"];

	if (gameId)
	{
		const state = register.request(gameId.toString())?.getState(new Core.EmptyDataTransferObject());
		res.send(state);
	}
});

router.get('/act', (req: express.Request, _res: express.Response) =>
{
	const playerId = req.query["playerId"];
	const gameId = req.query["gameId"];

	if (playerId && gameId)
	{
		const game = register.request(gameId.toString());

		game.processAction("place", req.query);
	}
});

export default router;