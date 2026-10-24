import { register, unregister } from "@tauri-apps/plugin-global-shortcut";

export default function registerHotkeys (clickThrough: boolean, setClickThrough: (value: boolean) => void) {
    const registerClickThrough = async () => {
        await register('CommandOrControl+Shift+F9', async (e) => {
            if (e.state === 'Released') return;
            await unregister('CommandOrControl+Shift+F9');
            setClickThrough(!clickThrough);
        });
    }
    registerClickThrough();

    const registerKeyboardSave = async () => {
        await register('CommandOrControl+S', async (e) => {
            if (e.state === 'Released') return;
            await unregister('CommandOrControl+S');
            Array.from(document.querySelectorAll('.editing-widget')).forEach((widget) => {
                widget.querySelector<HTMLButtonElement>('button.change-content')?.click()
            });
        });
    }
    registerKeyboardSave();
}