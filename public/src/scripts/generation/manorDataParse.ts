import { vect2 } from "../../engine/utils/Types.js";
import { AllRoomsNames, AllRoomsIds, RoomsDataTypes, rooms, AllRooms } from "./manorDatas.js";

export default class ManorData {
    private manorData: RoomsDataTypes;
    private defaultRoom: AllRooms = 0;
    public gameSize: vect2;
    public map: string;

    constructor() {
        this.manorData = rooms;
        this.gameSize = this.getRoomSize(this.defaultRoom);
        this.map = this.genereStringMap();
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'id d'une pièce avec son nom
    private getIdWithName(name: AllRoomsNames): AllRoomsIds {
        return this.manorData[name].id;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir le nom d'une pièce avec son id
    private getNameWithId(id: AllRoomsIds): AllRoomsNames {
        for (const name in this.manorData) {
            if (this.manorData[name as AllRoomsNames]?.id === id) {
                return name as AllRoomsNames;
            }
        }
        return "Corridors";
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de savoir si le paramètre rentrer est le nom d'une pièce et renvoie un nom de pièce
    public getIfIsName(id: AllRooms): boolean {
        return this.manorData[id as AllRoomsNames] !== undefined;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir le nom de la pièce avec un id ou un nom
    public getNameWithIdOrName(id: AllRooms): AllRoomsNames {
        if (this.getIfIsName(id as AllRoomsNames)) {
            return id as AllRoomsNames;
        } else {
            return this.getNameWithId(id as AllRoomsIds);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'id de la pièce avec un id ou un nom
    public getIdWithNameOrId(name: AllRooms): AllRoomsIds {
        if (this.getIfIsName(name as AllRoomsNames)) {
            return this.getIdWithName(name as AllRoomsNames);
        } else {
            return name as AllRoomsIds;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'avoir l'UUID d'une pièce à partir d'un nom ou d'un id
    public getRoomUUID(name: AllRooms): string {
        return this.manorData[this.getNameWithIdOrName(name)].uuid;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de savoir si une entité est présente dans une salle à partir de ses coordonnées
    public getIfRoomOnCoordinates(name: AllRooms, coordinates: vect2): boolean {
        coordinates = { ...coordinates }
        const manor = this.manorData[this.getNameWithIdOrName(name)]
        const roomCoordinates = manor.coordinates;
        const roomData = manor.data;

        coordinates.x -= roomCoordinates.x
        coordinates.y -= roomCoordinates.y

        if (coordinates.x < 0 || coordinates.y < 0 || coordinates.x >= roomData[0].length || coordinates.y >= roomData.length) return false

        return roomData[coordinates.y][coordinates.x]
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet de vérifier si une entité est présente dans l'une des salles du plateau
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
    public getIfVoidOnCoordinates(coordinates: vect2): boolean {
        if (this.getIfRoomsOnCoordinates(coordinates)) {
            return this.getIfRoomOnCoordinates(this.defaultRoom, coordinates)
        } else {
            return false
        }
    }
    
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Permet d'obtenir la taille du plateau de jeu en entier
    private getRoomSize(name: AllRooms): vect2 {
        return { x: this.manorData[this.getNameWithIdOrName(name)].data[0].length, y: this.manorData[this.getNameWithIdOrName(name)].data.length }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------- \\
    // Génère un plan au format string de la map actuelle
    private genereStringMap(): string {
        let map = "";
        let coord = { x: 0, y: 0 }
        for (coord.y = 0; coord.y < this.gameSize.y; coord.y++) {
            for (coord.x = 0; coord.x < this.gameSize.x; coord.x++) {
                if (this.getIfVoidOnCoordinates(coord)) {
                    map += "▢"
                } else if (this.getIfRoomsOnCoordinates(coord)) {
                    map += "▩"
                } else {
                    map += "▣"
                }
            }
            map += "\n"
        }
        return map
    }
}