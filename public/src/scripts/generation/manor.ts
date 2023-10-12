import { _SDK3DVerse } from "SDK3DVerse.js";
import App from "../../app.js";
import ManorData from "./manorDataParse.js";
import { groundUUID, rooms } from "./manorDatas.js";
import { SDK3DVerse_Entity, vect2, vect3 } from "../../engine/utils/Types.js";

export class GroundManager {
    private GroundList: { Object: SDK3DVerse_Entity, coordinate: vect2 }[];

    constructor() {
        this.GroundList = [];
    }

    public saveNewGround(ground: SDK3DVerse_Entity, coordinate: vect2) {
        this.GroundList.push({ Object: ground, coordinate: coordinate });
    }

    public getGroundOnCoordinate(coordinate: vect2): SDK3DVerse_Entity | undefined {
        return this.GroundList.find((ground) => {
            return ground.coordinate.x === coordinate.x && ground.coordinate.y === coordinate.y;
        })?.Object;
    }
}

export default class ManorGeneration {
    private manorData: ManorData;
    private App: App;
    private SDK3DVerse: typeof _SDK3DVerse;
    private sizeOf1m = 4.006;
    private rooms: SDK3DVerse_Entity[];
    private ground: GroundManager;

    constructor(app: App) {
        this.manorData = new ManorData();

        this.App = app;
        this.SDK3DVerse = this.App.SDK3DVerse;
        this.rooms = [];
        this.ground = new GroundManager();
    }

    public async generate() {
        await this.SDK3DVerse?.onEditorConnected();
        const centering: vect3 = { x: -this.manorData.gameSize.x / 2 * this.sizeOf1m, y: 0, z: -this.manorData.gameSize.y / 2 * this.sizeOf1m };
        const game = await this.App.spawnScene("Game", {x: 0, y:0, z:0});
        const scene = await this.App.spawnScene("SCENE_CONTROLLER", centering, undefined, game);
        const grounds = await this.App.spawnScene("GROUND_CONTROLLER", centering, undefined, game);

        Object.values(rooms).forEach(async (roomData) => {
            const entity: SDK3DVerse_Entity = await this.App.spawnScene(this.manorData.getNameWithIdOrName(roomData.id), { x: roomData.coordinates.x * this.sizeOf1m, y: 0, z: roomData.coordinates.y * this.sizeOf1m }, roomData.uuid, scene);
            this.rooms.push(entity);
        });
        let coord = { x: 0, y: 0 }
        for (coord.y = 0; coord.y < this.manorData.gameSize.y; coord.y++) {
            for (coord.x = 0; coord.x < this.manorData.gameSize.x; coord.x++) {
                if (!this.manorData.getIfVoidOnCoordinates(coord) && !this.manorData.getIfRoomsOnCoordinates(coord)) {
                    const entity: SDK3DVerse_Entity = await this.App.spawnScene(`Ground_x:${coord.x}_y:${coord.y}`, {x: coord.x * this.sizeOf1m,y: 0,z: coord.y * this.sizeOf1m}, groundUUID, grounds);
                    this.ground.saveNewGround(entity, coord);
                }
            }
        }
        this.SDK3DVerse.engineAPI.propagateChanges();
    }
}