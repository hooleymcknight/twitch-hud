import { useEffect, useState } from "react";
import { MessageObj } from "../interface";
import Draggable from "../components/Draggable";

const CHANNEL_NAME = 'hollyngrade';

function Chat({ clickThrough, id, show } : { clickThrough: boolean, id: string, show: boolean }) {
    const [mostRecentMsgs, setMostRecentMsgs] = useState<Array<MessageObj>>([]);

    useEffect(() => {

        const wsUri = 'wss://irc-ws.chat.twitch.tv:443';
        const websocket = new WebSocket(wsUri);

        websocket.onopen = () => {
            websocket.send('NICK justinfan12345');
            websocket.send(`JOIN #${CHANNEL_NAME}`);
        }

        websocket.onmessage = (event) => {
            // console.log(event.data);
            const lines = event.data.split('\r\n');
            // console.log(lines);

            for (const line of lines) {
                if (!line.trim().length) continue;

                if (line.startsWith('PING')) {
                    websocket.send('PONG :tmi.twitch.tv');
                }

                // handle user message
                if (line.includes('PRIVMSG')) {
                    const author = line.match(/(?<=!)(\w+)(?=@)/)?.[0];
                    const channelRegex = new RegExp(`(?<=(#${CHANNEL_NAME} :)).+`)
                    const message = line.match(channelRegex)?.[0];

                    console.log('author: ', author);
                    console.log('message:', message);
                    const msgObj = {
                        author: author,
                        message: message
                    };
                    console.log(mostRecentMsgs)
                    setMostRecentMsgs([...mostRecentMsgs, msgObj]);
                }
            }
            /**
             * example:
             * :hollyngrade!hollyngrade@hollyngrade.tmi.twitch.tv PRIVMSG #hooleymcknight :test
             */
        }

        websocket.onerror = (err) => {
            console.error('websocket error:', err);
        }

        return () => {
            websocket.close();
        }
    }, [mostRecentMsgs]);

    return (
        <Draggable clickThrough={clickThrough} id={id}>
            <div className="twitch-chat">
                {mostRecentMsgs.length ? 
                    <>
                        {clickThrough ? '' : <button id="clear" onClick={() => { setMostRecentMsgs([]); }}>CLEAR</button>}
                        <div className="chat-rows">
                            {mostRecentMsgs.map((msg, idx) => 
                                <div className="row" key={idx}>
                                    <b>{msg.author}</b>
                                    <p>{msg.message}</p>
                                </div>
                            )}
                        </div>
                    </>
                : ''}
            </div>
        </Draggable>
    );
}

export default Chat;
