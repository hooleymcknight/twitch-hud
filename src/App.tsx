import { useEffect, useState } from "react";
import {
  getCurrentWindow,
  currentMonitor,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";

import { load } from "@tauri-apps/plugin-store";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import "./App.css";
import Chat from "./widgets/Chat";
import Content from "./widgets/Content";
import AddWidget from "./components/AddWidget";
import { Widget } from "./interface";
import { addWidget } from "./settingsHelper";

function App() {
    const [clickThrough, setClickThrough] = useState(true);
    const [widgets, setWidgets] = useState<Widget[]>([]);

    const updateShowSettings = async (showing: boolean, id: string) => {
        const store = await load('settings.json');
        const currentWidgets = await store.get<Widget[]>('widgets') || [];

        const thisWidget = currentWidgets.find(x => x.id === id);
        if (!thisWidget) return;

        const remainingWidgets = currentWidgets.filter(x => x.id !== id);
        thisWidget.show = !showing;
        const newWidgets = [...remainingWidgets, thisWidget];
        await store.set('widgets', newWidgets);

        setWidgets(newWidgets);
    }

    const updateSettingsAddWidget = async (widget: string) => {
        const newWidgets = await addWidget(widget);
        setWidgets(newWidgets);
    }

    useEffect(() => {
        const fit = async () => {
            const monitor = await currentMonitor();
            if (!monitor) return;
            const win = getCurrentWindow();
            await win.setPosition(new PhysicalPosition(monitor.position.x, monitor.position.y));
            await win.setSize(new PhysicalSize(monitor.size.width, monitor.size.height));
        };
        fit().catch(console.error);
        
        getCurrentWindow().setIgnoreCursorEvents(clickThrough);

        const registerClickThrough = async () => {
            await register('CommandOrControl+Shift+F9', async (e) => {
                if (e.state === 'Released') return;
                await unregister('CommandOrControl+Shift+F9');
                setClickThrough(!clickThrough);
            });
        }
        registerClickThrough();

        const loadSettings = async () => {
            const store = await load('settings.json');
            const widgets = await store.get<Widget[]>('widgets') || [];
            setWidgets(widgets);
        }
        loadSettings();
    }, [clickThrough]);

    return (
        <main className="container">
            <AddWidget clickThrough={clickThrough} updateSettingsAddWidget={updateSettingsAddWidget} />

            {
                widgets.map(x => 
                    x.type === 'chat' ? 
                        <Chat clickThrough={clickThrough} id={x.id} show={x.show} key={x.id} />
                    : x.type === 'content' ?
                        <Content clickThrough={clickThrough} id={x.id} show={x.show} key={x.id} startContent={x.content} updateShowSettings={updateShowSettings} />
                    : ''
                )
            }

        </main>
    );
}

export default App;
