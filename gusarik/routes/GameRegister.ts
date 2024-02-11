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