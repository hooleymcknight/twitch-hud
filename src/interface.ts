export interface MessageObj {
    author: string;
    message?: string;
    messagePieces?: Array<Emote|MsgText>;
    emotes?: Emote[];
    delay?: number;
    recorded?: Date;
}

export type Widget = {
    type: string,
    id: string,
    content: string,
    xPos: number,
    yPos: number,
    show: boolean,
    fullDisplay?: boolean,
}

export interface Emote {
    type: 'emote',
    id: string,
    start: number,
    end: number,
}

export interface MsgText {
    type: 'text',
    content: string,
}