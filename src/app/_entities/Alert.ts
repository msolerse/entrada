export class Alert {
    mensaje: string;
    tipo: AlertType;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}