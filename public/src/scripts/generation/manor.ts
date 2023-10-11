import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import ManorData from "./manorDataParse.js";
import { AllRoomsNames, AllRoomsIds, RoomsDataTypes, rooms, AllRooms } from "./manorDatas.js";

export default class ManorGeneration {
    private manorData: ManorData;
    private App?: App;
    private SDK3DVerse?: typeof _SDK3DVerse;

    constructor() {
        this.manorData = new ManorData();

        this.generate();
    }

    private InitApp() {
        while (!this.App) {
            this.App = new App().INSTANCE;
        }
        while (!this.SDK3DVerse) {
            this.SDK3DVerse = this.App.SDK3DVerse;
        }
        return
    }

    private async generate() {
        await this.InitApp();
        await this.SDK3DVerse?.onEditorConnected();
        Object.values(rooms).forEach(async (roomName) => {
            // const entity = await this.SDK3DVerse?.engineAPI.createEntity(null, {uuid: this.manorData.getRoomUUID(roomName.id)}, this.manorData.getIdWithNameOrId(roomName.id));
            // console.log(entity)
            // console.log(entity, entity?.getGlobalTransform(null));
        });
            
        
    }
}