class StringParameter implements Parameter
{
  private _name: string;
  private _value: string;

  public get name(): string
  {
    return this._name;
  }
  public get value(): string
  {
    return this._value;
  }

  public constructor(name: string, value: string)
  {
    this._name = name;
    this._value = value;
  }
}