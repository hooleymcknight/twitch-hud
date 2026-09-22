import { load } from "@tauri-apps/plugin-store";
import { Widget } from "./interface";

export const addWidget = async (widget: string) => {
    const store = await load('settings.json');
    const currentWidgets = await store.get<Widget[]>('widgets') || [];
    const existingIds = currentWidgets.filter(x => x.type === widget)?.map(y => y.id.replace(widget, ''))?.sort() || null;
    const newId = (Number(existingIds?.[existingIds.length - 1]) + 1) || 0;

    const newWidgets = [...currentWidgets, { type: widget, id: `${widget}${newId}`, content: '', xPos: 100, yPos: 100, show: true }];
    console.log('new widgets:', newWidgets);

    await store.set('widgets', newWidgets);

    return newWidgets;
}