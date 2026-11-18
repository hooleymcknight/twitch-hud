import { Emote, MsgText } from "../interface";

const emoteBase = 'https://static-cdn.jtvnw.net/emoticons/v2/{ID}/default/dark/1.0';

export default function ChatMessage(props: any) {


    return (
        <>
            {props.message ?
                <p>{props.message}</p>
            :
                <p style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                    {props.messagePieces.map((x: Emote|MsgText, idx: number) => {
                        if (x.type === 'text') return <span key={idx} style={{display: 'inline'}}>{x.content}</span>;
                        return <img key={idx} src={emoteBase.replace('{ID}', x.id)} alt={x.id} height="32" width="32" style={{display: 'inline'}} />
                    })}
                </p>
            }
        </>
    );
}