import { gameObject } from "./gameObject.js";
export class Weapon extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, physicsTags =['overlap'], tilemap, tilemapSize)

    }
}