//class is not a copy of an object, but points to existing one, use New class to create copies
import { gameObject } from "./gameObject.js";
import {InputHandler} from './input.js';
import{Vec} from './vector.js';

export class Player extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, true, tilemap, tilemapSize);
        this.input = new InputHandler();
        this.inputVec = new Vec(0,0);
    }
    update(deltaTime){
        super.update(deltaTime);
         // reset input vector, DO NOT REMOVE
         this.inputVec.zero(); 

        //.includes() method determines whether an array includes a certain value among its entries, returning true or false as approriate
         if(this.input.keys.includes('d')){this.inputVec.x++;}
         if(this.input.keys.includes('a')){this.inputVec.x--;}
         if(this.input.keys.includes('w')){this.inputVec.y--;}
         if(this.input.keys.includes('s')){this.inputVec.y++;}
         this.inputVec.Nnormalize();

         this.physics.addMovementInput(this.inputVec, 10, 1.5);
         //console.log(this.inputVec);

    }
    draw(context){
        super.draw(context, this.animationFrame);
    }
}
