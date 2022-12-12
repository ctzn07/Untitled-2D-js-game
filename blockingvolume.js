import { Physics } from "./physics.js";

export class BlockingVolume{
    constructor(game, spawnPos, physicsTags, size){
        this.game = game
        this.worldLocation = spawnPos
        this.bSize = size
        this.tags = physicsTags;
        this.physics = new Physics(this, this.bSize)
    }
}
