export type Preset = {
    id: string;
    name: string;
    color: string;
    midOpacity: number;
    edgeOpacity: number;
}

export const presets: Array<Preset> = [
    {
        id: 'quarry',
        name: 'The Quarry',
        color: '#253b53',
        midOpacity: 0.05,
        edgeOpacity: 0.3,
    },
    {
        id: 'gtfo-y',
        name: 'GTFO Yellow',
        color: '#e29706',
        midOpacity: 0.05,
        edgeOpacity: 0.2,
    }
]