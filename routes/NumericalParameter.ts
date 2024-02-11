class NumericalParameter implements Parameter
{
  private _name: string;
  private _value: number;

  public get name(): string
  {
    return this._name;
  }
  public get value(): number
  {
    return this._value;
  }

  public constructor(name: string, value: number)
  {
    this._name = name;
    this._value = value;
  }
}
