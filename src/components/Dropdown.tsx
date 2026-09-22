import { useState } from "react";

const options = [
    { value: 'chat', label: 'Chat'},
    { value: 'content', label: 'Content'}
]

export default function Dropdown({ onSelect }: { onSelect: (value: string) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(!open)}>-- Select a widget --</button>

            {open && (
                <div style={{ position: 'absolute', top: '100%', left: 0 }}>
                    {options.map((o) => (
                        <div key={o.value}
                            onClick={() => {
                                onSelect(o.value);
                                setOpen(false);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}