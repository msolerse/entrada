export class Element {
  constructor(
    public id: number,
    public codigo: string,
    public name: string,
    public symbol: string,
    public cantref?: number,
    public comment?: number,
    public dif?: number,
    public motivo?: string,
    public cantrefUmb?: number,
    public umb?:  string,
    public FactConv?: number,
    public posRefer?: string,
    public extra?: string
   )
{  }
}
