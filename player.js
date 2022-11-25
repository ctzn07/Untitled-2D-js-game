//class is not a copy of an object, but points to existing one, use New class to create copies
import { gameObject } from "./gameObject.js";
import {InputHandler} from './input.js';
import{Vec} from './vector.js';



export class Player extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, ['moving', 'block'], tilemap, tilemapSize);
        this.input = new InputHandler();
        this.inputVec = new Vec(0,0);
        this.createAnimations();
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
         //addmovement takes input vec, max speed/s and acceleration
         this.physics.addMovementInput(this.inputVec, 10, 2);
         //console.log(this.inputVec);

    }
    draw(context){
        super.draw(context, this.animationFrame);
    }
    createAnimations(){
        
        //TEMPLATE (these are required members, add more if needed for functionality)
        /*
        this.newAnim(Object.create({
            animation: '', 
            frame: [], 
            parent: this, 
            exitAnimation: '',
            update: function(){
                //update is expected to return current animation frame
                return this.frame[];
            }, 
            exitcondition: function(){return false;}
        */

        //update and exitcondition can only use references from inside the object!
        this.newAnim(Object.create({
            animation: 'walkright', 
            frame: [0,1,2,3], 
            animationspeed: 6,
            lerp: 0,
            parent: this, 
            exitAnimation: 'walkleft',
            update: function(){
                //rotate lerp between 0 and last frame index, if greater than last index reset to 0
                this.lerp += this.parent.game.deltaTime*this.parent.physics.velocity.length()*this.animationspeed;
                this.lerp *= (this.lerp<this.frame.length);
                //update is expected to return current animation frame
                return this.frame[Math.floor(this.lerp)];
            }, 
            exitcondition: function(){return this.parent.physics.velocity.x<0;}
        }));

        this.newAnim(Object.create({
            animation: 'walkleft', 
            frame: [4,5,6,7], 
            animationspeed: 6,
            lerp: 0,
            parent: this, 
            exitAnimation: 'walkright',
            update: function(){
                //rotate lerp between 0 and last frame index, if greater than last index reset to 0
                this.lerp += this.parent.game.deltaTime*this.parent.physics.velocity.length()*this.animationspeed;
                this.lerp *= (this.lerp<this.frame.length);
                return this.frame[Math.floor(this.lerp)];
            }, 
            //update is expected to return current animation frame
            exitcondition: function(){return this.parent.physics.velocity.x>0;}
        }));
    }
}
