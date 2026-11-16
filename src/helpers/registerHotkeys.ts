import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut";
import type { Dispatch, SetStateAction } from 'react';

const interactHotkey = 'CommandOrControl+Shift+F9';
// const saveHotkey = 'CommandOrControl+S';
const chatShowHotkey = 'F14';

export default function registerHotkeys (setClickThrough: Dispatch<SetStateAction<boolean>>) {
    const registerClickThrough = async () => {
        if (await isRegistered(interactHotkey)) {
            await unregister(interactHotkey);
        }
        await register(interactHotkey, async (e) => {
            if (e.state === 'Released') return;
            setClickThrough(prev => !prev);
        });
    }
    registerClickThrough();

    const registerToggleChatVisibility = async () => {
        if (await isRegistered(chatShowHotkey)) {
            await unregister(chatShowHotkey);
        }
        await register(chatShowHotkey, async (e) => {
            if (e.state === 'Released') return;
            document.querySelector<HTMLButtonElement>('[id*="chat"] .edit.change-visibility')?.click();
        });
    }
    registerToggleChatVisibility();

    const unregisterAll = () => {
        unregister(interactHotkey).catch(err => {console.error(err)});
        unregister(chatShowHotkey).catch(err => {console.error(err)});
    }

    return unregisterAll;
}