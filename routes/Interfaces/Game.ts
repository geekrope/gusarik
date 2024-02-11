interface Game
{
  getState(parameters: GameRequest): GameState | undefined;
  processAction(parameters: GameRequest): Parameter[];
}