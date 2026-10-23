import { load } from "@tauri-apps/plugin-store";
import { useEffect, useRef, useState } from "react";
import { Widget } from "../interface";

export default function Draggable({ children, clickThrough, id, editing }: { children: React.ReactNode, clickThrough: boolean, id: string, editing?: boolean }) {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const offset = useRef({ x: 0, y: 0 });

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.edit')) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.edit')) return;
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        setPos({ x: newX, y: newY });

        const updateSettings = async (x: number, y: number) => {
            const store = await load('settings.json');
            const currentWidgets = await store.get<Widget[]>('widgets') || [];

            const thisWidget = currentWidgets.find(x => x.id === id)
            if (!thisWidget) return;

            const remainingWidgets = currentWidgets.filter(x => x.id !== id);
            thisWidget.xPos = x;
            thisWidget.yPos = y;
            const newWidgets = [...remainingWidgets, thisWidget];
            await store.set('widgets', newWidgets);
        }
        updateSettings(newX, newY);
    };

    useEffect(() => {
        const loadSettings = async () => {
            const store = await load('settings.json');
            const currentWidgets = await store.get<Widget[]>('widgets') || [];
            const thisWidget = currentWidgets.filter(x => x.id === id)[0];
            setPos({ x: thisWidget.xPos || 100, y: thisWidget.yPos || 100 });
        }
        loadSettings();
    }, []);

    return (
        <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                touchAction: "none",
                userSelect: "none",
                cursor: "move",
                padding: 10
            }}
            className={`draggable-item ${clickThrough ? 'movable-locked' : 'movable'} ${id.includes('content') ? 'content-widget' : ''} ${ editing ? 'editing-widget' : ''}`}
        >
            {children}
        </div>
    );
}