import { MouseEvent, useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import Draggable from "../components/Draggable";
import Edit from "../components/Edit";
import { Widget } from "../interface";

function Content({ clickThrough, id, show, startContent, updateShowSettings } : { clickThrough: boolean, id: string, show: boolean, startContent: string, updateShowSettings: (showing: boolean, id: string) => void }) {
    const [editing, setEditing] = useState<boolean>(false);
    const [content, setContent] = useState<string>(startContent);
    const [showing, setShowing] = useState<boolean>(show);

    const onEditSubmit = (e: MouseEvent) => {
        if (!editing) {
            setEditing(true);
            return;
        }

        const updateContentSettings = async (newContent: string) => {
            const store = await load('settings.json');
            const currentWidgets = await store.get<Widget[]>('widgets') || [];

            const thisWidget = currentWidgets.find(x => x.id === id);
            if (!thisWidget) return;

            const remainingWidgets = currentWidgets.filter(x => x.id !== id);
            thisWidget.content = newContent;
            const newWidgets = [...remainingWidgets, thisWidget];
            await store.set('widgets', newWidgets);
        }

        const newContent = (e.target as HTMLElement).closest('.draggable-item')?.querySelector('textarea')?.value || '';

        updateContentSettings(newContent);
        setContent(newContent);
        setEditing(false);
    }

    const onShowHide = () => {
        updateShowSettings(showing, id);
        setShowing(!showing);
    }

    useEffect(() => {
        console.log('use effect')
        const loadSettings = async () => {
            const store = await load('settings.json');
            const currentWidgets = await store.get<Widget[]>('widgets') || [];
            const thisWidget = currentWidgets.filter(x => x.id === id)[0];

            if (content !== thisWidget.content) {
                setContent(thisWidget.content);
            }
            // if (thisWidget.show !== showing) {
            //     setShowing(thisWidget.show);
            // }
        }
        loadSettings();
    }, [showing]);

    return (
        <>
            <Draggable clickThrough={clickThrough} id={id}>
                <div className="edit-buttons">
                    <button className={`edit ${clickThrough ? 'invisible' : ''}`} onClick={() => { onShowHide(); }}>
                        <svg className={`icon-to-show ${show ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">{/*Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.*/}<path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/></svg>
                        <svg className={`icon-to-hide ${show ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">{/*Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.*/}<path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z"/></svg>
                    </button>
                    <button className={`edit ${clickThrough ? 'invisible' : ''}`} onClick={(e) => { onEditSubmit(e); }}>
                        <Edit />
                    </button>
                    <button className={`edit delete ${clickThrough ? 'invisible' : ''}`} onClick={(e) => { console.log(e); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">{/*Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.*/}<path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                    </button>
                </div>
                
            
                { editing && !clickThrough ?
                    <>
                        <textarea placeholder='text here' defaultValue={content}></textarea>
                    </>
                : ''}

                <div className={`content-box ${show ? '' : 'invisible'}`} dangerouslySetInnerHTML={{__html: content}}></div>

                {/* <>
                    <ul>
                        <li>2 Rusted Tools [Mec/Ind] - GSB</li>
                        <li>2 Wasp Drivers [ARC] - GSB</li>
                        <li>13 Pop Triggers [ARC] - TD</li>
                        <li>5 Pop Triggers [ARC] - ATM</li>
                        <li>9 Tick Pods [ARC]  - TD</li>
                        <li>5 Surveyor Vaults [ARC] - TD</li>
                        <li>5 Explosive Compounds [Ind/Sec] - ATM</li>
                        <li>1 Headphones [Res/Com] - ATM</li>
                        <li>3 Toasters [Res] - RFB</li>
                        <li>3 ARC Motion Cores [ARC] - RFB</li>
                        <li>8 Fireball Burners [ARC] - RFB</li>
                    </ul>
                    <p>
                        Mechanical, Industrial, Security
                        <br/>
                        Residential, Commercial
                    </p>
                </> */}
            </Draggable>
        </>
    );
}

export default Content;
