import { useEffect, useState } from "react";
import {
  getCurrentWindow,
  currentMonitor,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";

import { load } from "@tauri-apps/plugin-store";
import "./App.css";
import "./styles/GameThemes.css";
import Chat from "./widgets/Chat";
import Content from "./widgets/Content";
import AddWidget from "./components/AddWidget";
import { Widget } from "./interface";
import { addWidget } from "./settingsHelper";
import { Preset, presets } from "./helpers/colorPresets";
import registerHotkeys from "./helpers/registerHotkeys";

function App() {
    const [clickThrough, setClickThrough] = useState(true);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [presetId, setPresetId] = useState<Preset['id']>(presets[0].id);

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

    const updateChatDisplay = async (fullDisplay: boolean, id: string) => {
        const store = await load('settings.json');
        const currentWidgets = await store.get<Widget[]>('widgets') || [];

        const thisWidget = currentWidgets.find(x => x.id === id);
        if (!thisWidget) return;

        const remainingWidgets = currentWidgets.filter(x => x.id !== id);
        thisWidget.fullDisplay = fullDisplay;
        const newWidgets = [...remainingWidgets, thisWidget];
        await store.set('widgets', newWidgets);

        setWidgets(newWidgets);
    }

    const deleteWidget = async (id: string) => {
        const store = await load('settings.json');
        const currentWidgets = await store.get<Widget[]>('widgets') || [];

        const remainingWidgets = currentWidgets.filter(x => x.id !== id);
        await store.set('widgets', remainingWidgets);

        setWidgets(remainingWidgets);
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

        const unregisterAll = registerHotkeys(setClickThrough);

        const loadSettings = async () => {
            const store = await load('settings.json');
            const widgets = await store.get<Widget[]>('widgets') || [];
            setWidgets(widgets);
        }
        loadSettings();

        return () => {
            unregisterAll();
        }

    }, []);

    useEffect(() => {
        getCurrentWindow().setIgnoreCursorEvents(clickThrough);
        getCurrentWindow().setFocus();
    }, [clickThrough]);

    return (
        <main className="container hud-bg">
            <AddWidget clickThrough={clickThrough} updateSettingsAddWidget={updateSettingsAddWidget} />

            {
                widgets.map(x => 
                    x.type === 'chat' ? 
                        <Chat clickThrough={clickThrough} id={x.id} show={x.show} fullChatDisplay={x.fullDisplay ?? true} key={x.id} updateShowSettings={updateShowSettings} updateChatDisplay={updateChatDisplay} />
                    : x.type === 'content' ?
                        <Content clickThrough={clickThrough} id={x.id} show={x.show} key={x.id} startContent={x.content} currentWidgets={widgets} updateShowSettings={updateShowSettings} onConfirmDelete={deleteWidget} />
                    : ''
                )
            }

            <select className={`color-dropdown ${clickThrough ? 'hidden' : ''}`} value={presetId} onChange={(e) => { setPresetId(e.currentTarget.value); }}>
                <option>test</option>
                {presets.map(x => 
                    <option key={x.id} value={x.id}>{x.name}</option>
                )}
            </select>

        </main>
    );
}

export default App;
