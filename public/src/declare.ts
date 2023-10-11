declare module 'https://*'

declare module 'https://cdn.3dverse.com/legacy/sdk/stable/SDK3DVerse.js' {
    export const webAPI: any;
    export const notifier: any;
    export const setupDisplay: (canvas: HTMLElement | null) => void;
    export const startStreamer: (connectionInfo: any) => void;
}