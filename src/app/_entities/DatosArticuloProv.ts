

export class DatosArticuloProv {
    constructor(
        public codigo: string,
        public nombre: string,
        public codProveedor: string,
        public ubicacion: string,
        public descatalogado: string,
        public stockCompras: number,
        public stockMaximo: number,
        public stockMinimo: number
    ) { }
}
