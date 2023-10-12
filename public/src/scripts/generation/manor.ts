import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import ManorData from "./manorDataParse.js";
import { AllRoomsNames, AllRoomsIds, RoomsDataTypes, rooms, AllRooms } from "./manorDatas.js";

export default class ManorGeneration {
    private manorData: ManorData;
    private App: App;
    private SDK3DVerse: typeof _SDK3DVerse;

    constructor(app: App) {
        this.manorData = new ManorData();

        this.App = app;
        this.SDK3DVerse = this.App.SDK3DVerse;
        this.generate();
    }

    private async generate() {
        await this.SDK3DVerse?.onEditorConnected();
        Object.values(rooms).forEach(async (roomName) => {
            // const playerTemplate = { debug_name: { value: 'Player' } };
            // this.SDK3DVerse?.utils.resolveComponentDependencies(playerTemplate, 'local_transform');
            // const entity = await this.SDK3DVerse?.engineAPI.spawnEntity(null, playerTemplate);
            // console.log(entity)
            // console.log(entity, entity?.getGlobalTransform(null));
        });


    }
}