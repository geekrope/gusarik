import express = require('express');
const router = express.Router();

import Core from './core';

namespace TicTac
{
    export class State implements Core.GameState
    {
        get players(): Core.Player[]
        {
            return [];
        }
        get nexPlayers(): Core.Player[]
        {
            return [];
        }
        get winners(): Core.Player[]
        {
            return [];
        }

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

    export class Game implements Core.Game
    {
        private turn: number;
        private state: State;

        public getState(_parameters?: any): State
        {
            return this.state;
        }
        public processAction(actionType: string, actionData?: any): any
        {
            if (actionType == "place")
            {
                if (!actionData)
                    throw new Error("The place action requires actionData");

                const placeAction = Core.DataTransferObjectValidator.validate<PlaceAction>(PlaceActionConstructor as unknown as Core.DataTransferObjectConstructor<PlaceAction>, actionData);

                this.state.board[placeAction!.x]![placeAction!.y] = this.turn;
            }

            this.turn = this.turn == 1 ? 2 : 1;

            return new Core.EmptyDataTransferObject();
        }

        public constructor()
        {
            this.turn = 1;
            this.state = new State(this.turn);
        }
    }


    type PlaceAction = { x: number, y: number, turn: number };

    class PlaceActionConstructor
    {
        new(): PlaceAction
        {
            return { x: -1, y: -1, turn: -1 };
        }
    }
}

class Server
{
    public readonly gameRegister = new Core.GameRegister();

    public getTokenFromRequest(req: express.Request): string
    {
        const gameToken = req.query["id"]?.toString() ?? "No valid token";
        return gameToken;
    }
}

const server = new Server();

router.post('/init', (_req: express.Request, res: express.Response) =>
{
    const token = '{33990F06-1217-42C9-B23D-14904E12DF03}';
    const game = new TicTac.Game();
    server.gameRegister.register(token, game);
    res.send({ token: token });
});

router.get('/state', (req: express.Request, res: express.Response) =>
{
    try
    {
        const gameToken = server.getTokenFromRequest(req);
        const state = server.gameRegister.request(gameToken)?.getState(null);
        res.send(state);
    }
    catch (e)
    {
        res.sendStatus(500);
    }
});

router.get('/act', (req: express.Request, res: express.Response) =>
{
    try
    {
        const gameToken = server.getTokenFromRequest(req);
        const game = server.gameRegister.request(gameToken);

        game?.processAction("place", req.query);
    }
    catch (e)
    {
        res.sendStatus(500);
    }
});

export default router;