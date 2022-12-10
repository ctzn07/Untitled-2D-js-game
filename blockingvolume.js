import { Vec } from "./vector.js";
import { Physics } from "./physics.js";

export class BlockingVolume{
    constructor(game, spawnPos, physicsTags, size = new Vec(0,0)){
        this.game = game
        this.worldLocation = spawnPos
        this.spriteSize = size
        this.tags = physicsTags;
        this.physics = new Physics(this)
        console.log('new blocker at ', this.worldLocation)
    }
}
