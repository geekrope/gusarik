class QueryAdapter implements GameRequest
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