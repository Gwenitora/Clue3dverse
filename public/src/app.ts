import { AppConfig } from "./AppConfig";
import * as api3dverse from '@3dverse/api';

window.addEventListener('load', async () =>
{
    //api3dverse.createSession({scene_id: AppConfig.SCENE_UUID})
    const connectionInfo = await SDK3DVerse.webAPI.createOrJoinSession(AppConfig.sceneUUID);

    SDK3DVerse.notifier.on('onLoadingStarted', () => document.getElementById("message").innerHTML = "Connecting...");
    SDK3DVerse.notifier.on('onLoadingProgress', (status) => document.getElementById("message").innerHTML = status.message);
    SDK3DVerse.notifier.on('onLoadingEnded', (status) => document.getElementById("message").innerHTML = status.message);

    SDK3DVerse.setupDisplay(document.getElementById('display_canvas'));
    SDK3DVerse.startStreamer(connectionInfo);
});