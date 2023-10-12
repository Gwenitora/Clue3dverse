import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import { SDK3DVerse_Entity } from "../../engine/utils/Types.js";

export class Ghost {
    private SDK3DVerse?: typeof _SDK3DVerse;
    private App: App;
    private ghost: {object?: SDK3DVerse_Entity, uuid: string};
    private ghost2: {object?: SDK3DVerse_Entity, uuid: string};

    constructor(app : App){
        this.SDK3DVerse = app.SDK3DVerse;
        this.App = app;
        this.ghost = {uuid: "30d06a44-84bd-4a46-9810-2927358f4da3"};
        this.ghost2 = {uuid: "a653b18a-2189-4075-9b03-6890e73adc13"}
    }

    public async SetGhostOpacity(opacity: boolean){
        const scale = Math.random()*2
        const scale2 = Math.random()*2
        if(!this.ghost2.object){
            const ghost2 = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID(this.ghost2.uuid)
            if (!ghost2) {return}
            this.ghost2.object = ghost2[0]
        }
        if (!this.ghost.object) {
            const ghost = await this.SDK3DVerse?.engineAPI.findEntitiesByEUID(this.ghost.uuid)
            if (!ghost) {return}
            this.ghost.object = ghost[0]
        }
        this.SDK3DVerse?.engineAPI.setEntityVisibility(this.ghost.object,opacity)
        this.SDK3DVerse?.engineAPI.setEntityVisibility(this.ghost2.object,opacity)
        if(opacity)
        {{this.ghost.object.setGlobalTransform({"position":[Math.random()*20,Math.random()*20,Math.random()*20],"eulerOrientation":[0,(Math.random()*1000)%360,0],"scale":[scale,scale,0.1]});}
        {this.ghost2.object.setGlobalTransform({"position":[Math.random()*20,Math.random()*20,Math.random()*20],"eulerOrientation":[0,(Math.random()*1000)%360,0],"scale":[scale2,scale2,scale2]});}}
        this.SDK3DVerse?.engineAPI.propagateChanges();
    }

    public async SwitchOpacity(){
        setTimeout(() => {
            this.SetGhostOpacity(true)
            setTimeout(() => {
                this.SetGhostOpacity(false)
                this.SwitchOpacity();
            }, 1000);
        },3000);
    }
    
}