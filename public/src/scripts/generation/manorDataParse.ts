import { vect2 } from "../../engine/utils/Types.js";
import { AllRoomsNames, AllRoomsIds, RoomsDataTypes, rooms } from "./manorDatas.js";

export default class ManorData {
    private manorData: RoomsDataTypes;

    constructor() {
        this.manorData = rooms;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'id d'une pièce avec son nom
    public getIdWithName(name: AllRoomsNames): AllRoomsIds {
        return this.manorData[name].id;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir le nom d'une pièce avec son id
    public getNameWithId(id: AllRoomsIds): AllRoomsNames {
        for (const name in this.manorData) {
            if (this.manorData[name as AllRoomsNames]?.id === id) {
                return name as AllRoomsNames;
            }
        }
        return "Corridors";
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de savoir si le paramètre rentrer est le nom d'une pièce et renvoie un nom de pièce
    public getIfIsName(id: AllRoomsIds | AllRoomsNames): boolean {
        return this.manorData[id as AllRoomsNames] !== undefined;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir le nom de la pièce avec un id ou un nom
    public getNameWithIdOrName(id: AllRoomsIds | AllRoomsNames): AllRoomsNames {
        if (this.getIfIsName(id as AllRoomsNames)) {
            return id as AllRoomsNames;
        } else {
            return this.getNameWithId(id as AllRoomsIds);
        }
    }
    
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'id de la pièce avec un id ou un nom
    public getIdWithNameOrId(name: AllRoomsNames | AllRoomsIds): AllRoomsIds {
        if (this.getIfIsName(name as AllRoomsNames)) {
            return this.getIdWithName(name as AllRoomsNames);
        } else {
            return name as AllRoomsIds;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'UUID d'une pièce à partir d'un nom ou d'un id
    public getRoomUUID(name: AllRoomsNames | AllRoomsIds): string {
        return this.manorData[this.getNameWithIdOrName(name)].uuid;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de savoir si une entité est présent dans une salle à partir de leurs coordonnées
    public getIfRoomOnCoordinates(name: AllRoomsNames | AllRoomsIds, coordinates: vect2): boolean {
        const manor = this.manorData[this.getNameWithIdOrName(name)]
        const roomCoordinates = manor.coordinates;
        const roomData = manor.data ;

        coordinates.x -= roomCoordinates.x
        coordinates.y -= roomCoordinates.y

        if (coordinates.x < 0 || coordinates.y < 0 || coordinates.x >  roomData[0].length || coordinates.y > roomData.length ) return false

        return roomData[coordinates.y][coordinates.x]
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de vérifier si une entité est présente dans l'un des salles du plateau
    public getIfRoomsOnCoordinates(coordinates: vect2): boolean {
        let hasRoom = false;
        for (const key of Object.keys(this.manorData)) {
            if (this.getIfRoomOnCoordinates(key as AllRoomsNames, coordinates)) {
                hasRoom = true;
            }
        }

        return hasRoom;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de savoir si l'on se trouve sur les coordonnées rentrées sont sur le plateau de jeu renvoie false si on est sur le plateau et true si on est en dehors
    public grtIfVoidOnCoordinates(coordinates: vect2): boolean {
        if (this.getIfRoomsOnCoordinates(coordinates)) { 
            return this.getIfRoomOnCoordinates("Corridors", coordinates)
        } else {
            return false
        }
    }
}