import { gameObject } from "./gameObject.js";
import{Vec} from './vector.js';

export class MapTile extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, ['static', 'block'], tilemap, tilemapSize);
        this.physics.weight = 1

    }
    draw(context, cameraPosition){
        super.draw(context, cameraPosition, this.animationFrame);
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}