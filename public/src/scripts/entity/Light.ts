import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import { SDK3DVerse_Entity } from "../../engine/utils/Types.js";

export class Light {
    private SDK3DVerse?: typeof _SDK3DVerse;
    private App: App;
    private light: {object?: SDK3DVerse_Entity, uuid: string};

    constructor(app : App, uuid : string){
        this.SDK3DVerse = app.SDK3DVerse;
        this.App = app;
        this.light = {uuid: uuid};
    }

    public async SetLightIntesity(intensity: number){
        if (!this.light.object) {
            const light = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID(this.light.uuid)
            if(!light){
                return 
            }
            this.light.object = light[0];
        }
        this.light.object?.setComponent("point_light", {"intensity" : intensity})
        this.SDK3DVerse?.engineAPI.propagateChanges();

    }

    public async SwitchLight(){
        setTimeout(() => {  
            this.SetLightIntesity(10);
            setTimeout(() => {
                this.SetLightIntesity(0);
                this.SwitchLight();
            }, 1000);
        },1000);
    }
    
}

