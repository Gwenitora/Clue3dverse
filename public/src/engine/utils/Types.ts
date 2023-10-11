export type vect2 = {x : number, y : number};
export type vect3 = {x : number, y : number, z : number};
export type quaternion = {x : number, y : number, z : number, w : number};
export class SDK3DVerse_Entity {
    constructor(){};
    public getGlobalTransform(stopAtParent: SDK3DVerse_Entity | null){};
}