import { useEffect, useRef, useState } from "react";
import { MessageObj } from "../interface";
import Draggable from "../components/Draggable";

const CHANNEL_NAME = 'hollyngrade';
const SUS_MSG_STRINGS = [
    'ai viewers',
    ' . com'
]
const ding = new Audio('/twitchHudDing.mp3');

function Chat({ clickThrough, id, show, updateShowSettings } : { clickThrough: boolean, id: string, show: boolean, updateShowSettings: (showing: boolean, id: string) => void }) {
    const [mostRecentMsgs, setMostRecentMsgs] = useState<Array<MessageObj>>([]);
    const [showing, setShowing] = useState<boolean>(show);
    const lastDing = useRef<Date|null>(null);
    const [fullChat, setFullChat] = useState<boolean>(true);

    const onShowHide = () => {
        updateShowSettings(showing, id);
        setShowing(!showing);
    }

    const playDing = () => {
        const now = new Date();
        if (lastDing.current && (now.valueOf() - lastDing.current.valueOf()) <= 3000) {
            console.log('last ding was too recent.');
            return;
        }
        
        ding.currentTime = 0;
        ding.play().then(() => {
            console.log('set last ding to', now);
            lastDing.current = now;
        }).catch(err => console.error(err));

    }

    // const clearBotMsgs = () => {
    //     const newMsgsObj = [...mostRecentMsgs];
    //     const filtered = newMsgsObj.filter(x => !x.message.toLowerCase().includes('ai viewers') && !x.message.toLowerCase().includes(' . com'));
    //     if (filtered.length && newMsgsObj.length > filtered.length) {
    //         setMostRecentMsgs(filtered);
    //     }
    // }

    useEffect(() => {
        const wsUri = 'wss://irc-ws.chat.twitch.tv:443';
        const websocket = new WebSocket(wsUri);

        websocket.onopen = () => {
            websocket.send('NICK justinfan12345');
            websocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            websocket.send(`JOIN #${CHANNEL_NAME}`);
        }

        websocket.onmessage = (event) => {
            // console.log(event.data);
            const lines = event.data.split('\r\n');

            for (const line of lines) {
                if (!line.trim().length) continue;

                if (line.startsWith('PING')) {
                    websocket.send('PONG :tmi.twitch.tv');
                }

                // handle user message
                // ========= INCOMING MESSAGE =========
                if (line.includes('PRIVMSG')) {
                    // console.log(line);
                    const author = line.match(/(?<=!)(\w+)(?=@)/)?.[0];
                    const channelRegex = new RegExp(`(?<=(#${CHANNEL_NAME} :)).+`);
                    const message = line.match(channelRegex)?.[0];

                    for (const substr of SUS_MSG_STRINGS) {
                        if (message.includes(substr)) { // return; // fully exit.
                            console.log('leaving bc sus message.');
                            return;
                        }
                    }

                    // console.log('author: ', author);
                    // console.log('message:', message);
                    const msgObj = {
                        author: author,
                        message: message
                    };

                    document.querySelector('.chat-popup .twitch-chat')?.classList.remove('fading');
                    
                    playDing();
                    if (!fullChat) {
                        setTimeout(() => {
                            document.querySelector('.chat-popup .twitch-chat')?.classList.add('fading');

                        }, 3000);
                    }
                    setMostRecentMsgs(prev => [...prev, msgObj]);
                }

                // user ban
                if (line.includes('CLEARCHAT')) {
                    console.log('clear chat event');
                    const authorRegex = new RegExp(`(?<=(@login=))[^;]+(?=(;))`);
                    const author = line.match(authorRegex)?.[0];

                    setMostRecentMsgs(prev => prev.filter(x => x.author !== author));
                }

                // message deleted
                if (line.includes('CLEARMSG')) {
                    console.log('clear message', line.split('CLEARMSG')[1])
                    const authorRegex = new RegExp(`(?<=(@login=))[^;]+(?=(;))`);
                    const author = line.match(authorRegex)?.[0];
                    
                    const clearedMsgRegex = new RegExp(`(?<=(CLEARMSG #(\\w+) :)).+`);
                    const clearedMsg = line.match(clearedMsgRegex)?.[0];

                    setMostRecentMsgs(prev => prev.filter(x => !(x.author === author && x.message == clearedMsg)));
                    
                    // let newMsgsObj = [...mostRecentMsgs];
                    // const deleted = newMsgsObj.filter(x => x.message === clearedMsg && x.author === author)?.[0];
                    // if (deleted && newMsgsObj.indexOf(deleted) > -1) newMsgsObj.splice(newMsgsObj.indexOf(deleted), 1);
                    // setMostRecentMsgs(newMsgsObj);
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
    }, [fullChat]);

    return (
        <Draggable clickThrough={clickThrough} id={id}>
            <div className="edit-buttons">
                <button className={`edit change-display ${clickThrough ? 'invisible' : ''}`} onClick={() => { setFullChat(!fullChat); }}>
                    STYLE
                </button>
                <button className={`edit change-visibility ${clickThrough ? 'invisible' : ''}`} onClick={() => { onShowHide(); }}>
                    <svg className={`icon-to-show ${show ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">{/*Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.*/}<path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/></svg>
                    <svg className={`icon-to-hide ${show ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">{/*Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.*/}<path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z"/></svg>
                </button>
                {/* <button className={`edit delete ${clickThrough ? 'invisible' : ''}`} id="clear" onClick={() => { clearBotMsgs(); }}>
                    🧹
                </button> */}
                <button className={`edit delete ${clickThrough ? 'invisible' : ''}`} id="clear" onClick={() => { setMostRecentMsgs([]); }}>
                    CLEAR
                </button>
            </div>

            <div className="chat-full">
                <div className={`twitch-chat ${show ? '' : 'invisible'} ${fullChat ? '' : 'hidden'}`}>
                    {mostRecentMsgs.length ? 
                        <>
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
            </div>

            <div className="chat-popup">
                <div className={`twitch-chat ${show ? '' : 'invisible'} ${fullChat ? 'hidden' : ''} ${mostRecentMsgs.length ? '' : 'hidden'} `}>
                    <div className="chat-rows">
                        {mostRecentMsgs.length ? 
                            <div className="row">
                                <b>{mostRecentMsgs[mostRecentMsgs.length - 1].author}</b>
                                <p>{mostRecentMsgs[mostRecentMsgs.length - 1].message}</p>
                            </div>
                        : null }
                    </div>
                </div>
            </div>
        </Draggable>
    );
}

export default Chat;
