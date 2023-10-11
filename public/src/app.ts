import { AppConfig } from "./AppConfig.js";

class App {
    constructor() {
        console.log(`AppConfig.SCENE_UUID: ${AppConfig.SCENE_UUID}`);
    }

    public startingScene() {
        SDK3DVerse.webAPI.createOrJoinSession(AppConfig.SCENE_UUID).then((connectionInfo: any) => {
    
            SDK3DVerse.notifier.on('onLoadingStarted', () => {
                let message = document.getElementById("message");
                if (message) {
                    message.innerHTML = "Connecting..."
                }
            });
            SDK3DVerse.notifier.on('onLoadingProgress', (status: {message: string}) => {
                let message = document.getElementById("message");
                if (message) {
                    message.innerHTML = status.message
                }
            });
            SDK3DVerse.notifier.on('onLoadingEnded', (status: {message: string}) => {
                let message = document.getElementById("message");
                if (message) {
                    message.innerHTML = status.message
                }
            });
        
            SDK3DVerse.setupDisplay(document.getElementById('display_canvas'));
            SDK3DVerse.startStreamer(connectionInfo);
    
            console.log("App started");
        });
    }
}

const app = new App();

window.addEventListener('load', () =>
{
    app.startingScene();
});