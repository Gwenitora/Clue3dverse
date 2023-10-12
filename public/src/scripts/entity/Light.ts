import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import { SDK3DVerse_Entity } from "../../engine/utils/Types.js";

export class Light {
    private SDK3DVerse?: typeof _SDK3DVerse;
    private App: App;
    private light: {object?: SDK3DVerse_Entity, uuid: string};

    constructor(app : App){
        this.SDK3DVerse = app.SDK3DVerse;
        this.App = app;
        this.light = {uuid: "c030c52e-ee36-4d07-99d9-451ccb3c4932"};
    }

    public async SetLightIntesity(intensity: number){
        if (!this.light.object) {
            this.light.object = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID(this.light.uuid)[0]
        }
        if (!this.light.object) return
        this.light.object.setComponent("point_light", {"intensity" : intensity})
        this.SDK3DVerse?.engineAPI.propagateChanges();

    }

    public async SwitchLight(){
        setTimeout(() => {
            this.SetLightIntesity(15)
            setTimeout(() => {
                this.SetLightIntesity(0)
            }, 10000);
        },10000);
    }
    
}

