import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import { SDK3DVerse_Entity } from "../../engine/utils/Types.js";

export class Light {
    private SDK3DVerse?: typeof _SDK3DVerse;
    private App: App;

    constructor(app : App){
        this.SDK3DVerse = app.SDK3DVerse;
        this.App = app;
    }

    public async console () {
        const character = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID("80d1077e-082b-47d2-8c6c-71380c0bd117")
        const light = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID("6574e8d9-a615-44d0-b762-3ce5e5e6fa4b")
        const e = light ? light[0]: "error" 
        light ? light[0].setComponent("point_light", {"intensity" : 0}) : "error";
    }

    public async SwitchOnLight (){
        const light = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID("c030c52e-ee36-4d07-99d9-451ccb3c4932")
        light ? light[0].setComponent("point_light", {"intensity" : 15}) : "error";
        this.SDK3DVerse?.engineAPI.propagateChanges();
        console.log(light ? light[0].getComponent("point_light") : "error");

    }
    public async SwitchOffLight (){
        const light = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID("c030c52e-ee36-4d07-99d9-451ccb3c4932")
        light ? light[0].setComponent("point_light", {"intensity" : 0}) : "error";
        this.SDK3DVerse?.engineAPI.propagateChanges();
        console.log(light ? light[0].getComponent("point_light") : "error");
    }

    public async SwitchLight(){
        setTimeout(() => {
            this.SwitchOnLight()
            setTimeout(() => {
                this.SwitchOffLight()
            }, 10000);
        },10000);
    }
    
}

