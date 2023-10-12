import { _SDK3DVerse } from "SDK3DVerse.js";
import AppConfig from "./engine/utils/AppConfig.js";
import ManorGeneration from "./scripts/generation/manor.js";
import { Light } from "./scripts/entity/Light.js";

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

    private replaceMessage() : void {
        let message = document.getElementById("message");

        setInterval(this.replaceMessage, 5000)
        if (message?.innerHTML){
            message.innerHTML = "";
        }
    }

    public async startingScene() {
        console.log(`SDK3DVerse ${this.SDK3DVerse}`)
        console.log(`SDK3DVerse.webAPI ${JSON.stringify(this.SDK3DVerse.webAPI)}`)
        const connectionInfo = await this.SDK3DVerse.webAPI.createOrJoinSession(AppConfig.SCENE_UUID)

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

        this.light.SwitchLight();
   }
}

new App();


async function  setupKeyboardLayout(event : any)
{
    if((event.code === "KeyA" && event.key !== "a") ||
    (event.code === "KeyQ" && event.key !== "q") ||
    (event.code === "KeyZ" && event.key !== "z") ||
    (event.code === "KeyW" && event.key !== "w"))
    {
        new App().INSTANCE?.SDK3DVerse.actionMap.setFrenchKeyboardBindings();
        window.removeEventListener('keydown', setupKeyboardLayout);
        await new App().INSTANCE?.SDK3DVerse.onConnected();
        new App().INSTANCE?.SDK3DVerse.actionMap.propagate();
    }
}
window.addEventListener('keydown', setupKeyboardLayout);

window.addEventListener('load', () => {
    new App().INSTANCE?.startingScene();
});
