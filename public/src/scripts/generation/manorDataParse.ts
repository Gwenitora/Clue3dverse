import { vect2 } from "../../engine/utils/Types.js";
import { AllRoomsNames, AllRoomsIds, RoomsDataTypes, rooms } from "./manorDatas.js";

export default class ManorData {
    private manorData: RoomsDataTypes;

    constructor() {
        this.manorData = rooms;
    }

    public getIdWithName(name: AllRoomsNames): AllRoomsIds {
        return this.manorData[name].id;
    }

    public getNameWithId(id: AllRoomsIds): AllRoomsNames {
        for (const name in this.manorData) {
            if (this.manorData[name as AllRoomsNames]?.id === id) {
                return name as AllRoomsNames;
            }
        }
        return "Corridors";
    }

    public getIfIsName(id: AllRoomsIds | AllRoomsNames): boolean {
        return this.manorData[id as AllRoomsNames] !== undefined;
    }

    public getNameWithIdOrName(id: AllRoomsIds | AllRoomsNames): AllRoomsNames {
        if (this.getIfIsName(id as AllRoomsNames)) {
            return id as AllRoomsNames;
        } else {
            return this.getNameWithId(id as AllRoomsIds);
        }
    }

    public getIdWithNameOrId(name: AllRoomsNames | AllRoomsIds): AllRoomsIds {
        if (this.getIfIsName(name as AllRoomsNames)) {
            return this.getIdWithName(name as AllRoomsNames);
        } else {
            return name as AllRoomsIds;
        }
    }

    public getRoomUUID(name: AllRoomsNames | AllRoomsIds): string {
        return this.manorData[this.getNameWithIdOrName(name)].uuid;
    }

    public getIfRoomOnCoordinates(name: AllRoomsNames | AllRoomsIds, coordinates: vect2): boolean {
        const manor = this.manorData[this.getNameWithIdOrName(name)]
        const roomCoordinates = manor.coordinates;
        const roomData = manor.data ;

        coordinates.x -= roomCoordinates.x
        coordinates.y -= roomCoordinates.y

        if (coordinates.x < 0 || coordinates.y < 0 || coordinates.x >=  roomData[0].length || coordinates.y >= roomData.length ) return false

        return roomData[coordinates.y][coordinates.x]
    }

    public getIfRoomsOnCoordinates(coordinates: vect2): boolean {
        let hasRoom = false;
        for (const key of Object.keys(this.manorData)) {
            if (this.getIfRoomOnCoordinates(key as AllRoomsNames, coordinates)) {
                hasRoom = true;
            }
        }

        return hasRoom;
    }

    public grtIfVoidOnCoordinates(coordinates: vect2): boolean {
        if (this.getIfRoomsOnCoordinates(coordinates)) {
            return this.getIfRoomOnCoordinates("Corridors", coordinates)
        } else {
            return false
        }
    }
}