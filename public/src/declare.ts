declare module 'https://*'

declare module 'https://cdn.3dverse.com/legacy/sdk/stable/SDK3DVerse.js' {
    export namespace webAPI {
      export function createOrJoinSession(sceneId: string): Promise<any>;
    }
    export module notifier {
      function on(event: string, callback: Function): void;
    }
    export const setupDisplay: (canvas: HTMLElement | null) => void;
    export const startStreamer: (connectionInfo: any) => void;
}