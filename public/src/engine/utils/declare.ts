import { SDK3DVerse_Entity } from "./Types";

declare module 'SDK3DVerse.js' {
  export module _SDK3DVerse {
    export module webAPI {
      function createOrJoinSession(sceneId: string): Promise<any | undefined>;
    }
    export module notifier {
      function on(event: string, callback: Function): void;
      function off(event: string, callback: Function): void;
    }
    export const setupDisplay: (canvas: HTMLElement | null) => void;
    export const startStreamer: (connectionInfo: any) => void;
    export function connectToEditor(): Promise<void>;
    export function onConnected(): Promise<void>;
    export function onEditorConnected(): Promise<void>;
    export module engineAPI{
      function findEntitiesByEUID(euid : string) : SDK3DVerse_Entity[];
      function createEntities(parentEntity: SDK3DVerse_Entity | null, entityTemplates: Object[], ordinal: number) : SDK3DVerse_Entity[];
      function createEntity(parentEntity: SDK3DVerse_Entity | null, entityTemplates: Object, ordinal: number) : SDK3DVerse_Entity;
      function propagateChanges (propagater? : string) : void;
      function spawnEntity(parentEntity: SDK3DVerse_Entity | null, entityTemplates: Object) : SDK3DVerse_Entity;
    }
    export module actionMap {
      function setFrenchKeyboardBindings() : void;
      function propagate() : void;
    }
    export module utils {
      function resolveComponentDependencies(entityTemplate: Object, componentName: string) : void;
    }

  }
}