import { _SDK3DVerse } from "SDK3DVerse.js";
import AppConfig from "./engine/utils/AppConfig.js";

export default class App {
    INSTANCE?: App;
    public SDK3DVerse: typeof _SDK3DVerse;

    constructor() {
        if (!this.INSTANCE) {
            this.INSTANCE = this;
        }

        this.SDK3DVerse = SDK3DVerse; // TODO: SDK3DVerse is a global variable, do not change this line, and ignore the error !!!
    }

    public startingScene() {
        console.log(`SDK3DVerse ${this.SDK3DVerse}`)
        console.log(`SDK3DVerse.webAPI ${JSON.stringify(this.SDK3DVerse.webAPI)}`)
        this.SDK3DVerse.webAPI.createOrJoinSession(AppConfig.SCENE_UUID).then((connectionInfo) => {
            console.log(`connectionInfo: ${JSON.stringify(connectionInfo)}`)

            this.SDK3DVerse.setupDisplay(document.getElementById('display_canvas'));
            this.SDK3DVerse.startStreamer(connectionInfo);

            console.log("App started");
        }).catch((err) => {
            console.error(err);
        });

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
        });
    }
}

new App();

window.addEventListener('load', () => {
    new App().INSTANCE?.startingScene();
});