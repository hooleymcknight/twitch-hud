export interface MessageObj {
    author: string;
    message: string;
}

export type Widget = {
    type: string,
    id: string,
    content: string,
    xPos: number,
    yPos: number,
    show: boolean,
}