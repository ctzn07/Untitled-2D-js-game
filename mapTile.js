import { gameObject } from "./gameObject.js";
import{Vec} from './vector.js';

export class MapTile extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, ['static', 'block'], tilemap, tilemapSize);

    }
    draw(context){
        super.draw(context, this.animationFrame);
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}