import { Unidades } from './Unidades';


export class DatosArticulo {
    constructor(
        public codigo: string,
        public descripcion: string,
        public caja: number,
        public retractil: number,
        public manto: number,
        public palet: number,
        public umb: string,
        public unidades: Unidades[],
        public codError: number,
        public mensajeError: string
    ) { }
}
