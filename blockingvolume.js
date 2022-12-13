import { gameObject } from "./gameObject.js";
import { Vec } from "./vector.js";


export class BlockingVolume extends gameObject{
    constructor(game, spawnPos, sprite){
        super(game, spawnPos, ['static', 'block'], sprite, new Vec(1,1));
    }
}
