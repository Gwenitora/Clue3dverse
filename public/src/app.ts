import { _SDK3DVerse } from "SDK3DVerse.js";
import AppConfig from "./engine/utils/AppConfig.js";
import ManorGeneration from "./scripts/generation/manor.js";
import { Light } from "./scripts/entity/Light.js";
import { SDK3DVerse_Entity, vect3 } from "./engine/utils/Types.js";

export default class App {
    INSTANCE?: App;
    public SDK3DVerse: typeof _SDK3DVerse;
    public manor: ManorGeneration;
    public light: Light;

    constructor() {
        if (!this.INSTANCE) {
            this.INSTANCE = this;
        }

        this.SDK3DVerse = SDK3DVerse; // TODO: SDK3DVerse is a global variable, do not change this line, and ignore the error !!!

        this.manor = new ManorGeneration(this.INSTANCE);
        this.light = new Light(this.INSTANCE, "c030c52e-ee36-4d07-99d9-451ccb3c4932");
    }

    private replaceMessage(): void {
        let message = document.getElementById("message");

        setInterval(this.replaceMessage, 5000)
        if (message?.innerHTML) {
            message.innerHTML = "";
        }
    }

    public async startingScene() {
        console.log(`SDK3DVerse ${this.SDK3DVerse}`)
        console.log(`SDK3DVerse.webAPI ${JSON.stringify(this.SDK3DVerse.webAPI)}`)
        const connectionInfo = await this.SDK3DVerse.webAPI.createSession(AppConfig.SCENE_UUID)

        this.SDK3DVerse.notifier.on('onLoadingStarted', () => {
            let message = document.getElementById("message");
            if (message) {
                message.innerHTML = "Connecting...";
            }
        });

        this.SDK3DVerse.notifier.on('onLoadingProgress', (status: { message: string }) => {
            let message = document.getElementById("message");
            if (message) {
                message.innerHTML = status.message;
            }
        });

        this.SDK3DVerse.notifier.on('onLoadingEnded', (status: { message: string }) => {

            let message = document.getElementById("message");
            if (message) {
                message.innerHTML = status.message;
            }
            // console.log(typeof this.SDK3DVerse?.engineAPI.findEntitiesByEUID("ed5186d6-ee8d-416c-a4dd-bef4bb6d9622"))
            // const entity = this.SDK3DVerse?.engineAPI.findEntitiesByEUID("ed5186d6-ee8d-416c-a4dd-bef4bb6d9622")
            // console.log("entité : ", entity)

        });

        this.SDK3DVerse.setupDisplay(document.getElementById('display_canvas'));
        this.SDK3DVerse.startStreamer(connectionInfo);

        this.SDK3DVerse.connectToEditor()
        await this.SDK3DVerse.onEditorConnected();

        this.replaceMessage()

        console.log("App started");

        this.manor.generate();
        this.light.SwitchLight();
    }

    public async spawnScene(debug_name?: string, transform?: vect3, sceneUUID?: string, parentEntity: SDK3DVerse_Entity | null = null): Promise<SDK3DVerse_Entity> {
        await this.SDK3DVerse.onEditorConnected();
        let template: any = {};
        this.SDK3DVerse.utils.resolveComponentDependencies(template, 'debug_name');
        this.SDK3DVerse.utils.resolveComponentDependencies(template, 'local_transform');
        if (debug_name) {
            template.debug_name.value = debug_name;
        }
        if (transform) {
            template.local_transform.position = [transform?.x, transform?.y, transform?.z];
        }
        if (sceneUUID) {
            this.SDK3DVerse.utils.resolveComponentDependencies(template, 'scene_ref');
            template.scene_ref.value = sceneUUID;
        }

        const scene = await this.SDK3DVerse.engineAPI.spawnEntity(parentEntity, template);
        return scene;
    }
}

new App();

window.addEventListener('load', () => {
    new App().INSTANCE?.startingScene();
    new App().INSTANCE?.SDK3DVerse.actionMap.setFrenchKeyboardBindings();
});
