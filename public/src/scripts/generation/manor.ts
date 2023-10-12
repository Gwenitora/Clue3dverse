import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import ManorData from "./manorDataParse.js";
import { rooms } from "./manorDatas.js";

export default class ManorGeneration {
    private manorData: ManorData;
    private App: App;
    private SDK3DVerse: typeof _SDK3DVerse;
    private sizeOf1m = 2.625;

    constructor(app: App) {
        this.manorData = new ManorData();

        this.App = app;
        this.SDK3DVerse = this.App.SDK3DVerse;
    }

    public async generate() {
        await this.SDK3DVerse?.onEditorConnected();
        const scene = await this.App.spawnScene("SCENE_CONTROLLER");
        Object.values(rooms).forEach(async (roomData) => {
            const entity = await this.App.spawnScene(this.manorData.getNameWithIdOrName(roomData.id), {x: roomData.coordinates.x * this.sizeOf1m,y: 0,z: roomData.coordinates.y * this.sizeOf1m}, roomData.uuid, scene);
        });
        this.SDK3DVerse.engineAPI.propagateChanges();
    }
}