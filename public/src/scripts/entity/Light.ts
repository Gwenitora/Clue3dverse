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
        // Toutes les 4 sec clignotes 2 fois (intervale de 100ms)
        setTimeout(() => {  
            this.SetLightIntesity(10);
            setTimeout(() => {
                this.SetLightIntesity(0);
                setTimeout(() => {
                    this.SetLightIntesity(10);
                    setTimeout(() => {
                        this.SetLightIntesity(0);
                        this.SwitchLight();
                    }, Math.random()*300+25);
                }, Math.random()*300+25);
            }, Math.random()*300+25);
        },4000);
    }
    
}

