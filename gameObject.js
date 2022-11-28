//This is generic GameObject
import{Vec} from './vector.js';
import {Physics} from './physics.js';
import {Animation} from './animation.js'

export class gameObject{
    constructor(game, spawnPos, physicsTags =[], tilemap, tilemapSize = new Vec(0,0)){
        this.game = game;
        this.worldLocation = spawnPos;
        this.worldIndex = 0;
        //graphics
        this.sprite = tilemap;
        this.spriteSize = new Vec(this.sprite.width, this.sprite.height).divide(tilemapSize);
        this.animationFrame = 0;
        //only add animation handler if there's something to animate
        if(tilemapSize.x > 1 || tilemapSize.y > 1)this.animHandler = new Animation(this);
        this.tags = physicsTags;
        if(this.tags.includes('moving'))this.physics = new Physics(this);
        
    }
    update(deltaTime){
        //only update physics if object is simulating
        if(this.physics){
            this.physics.update(deltaTime);


            //COLLISION CHECK BEFORE THIS LINE -----------------------------------------
            //This updates objects current position to collision check array (game.physicsObjects)
            if(this.game.locToIndex(this.worldLocation) != this.worldIndex){
                //remove from old index
                this.game.physicsObjects.splice(this.worldIndex, 1);
                //get new index
                this.worldIndex = this.game.locToIndex(this.worldLocation);
                //set to new index
                this.game.physicsObjects[this.worldIndex] = this;
            }
        }
        //only update animations if there are any
        if(this.animHandler){this.animHandler.update()};
        
        
    }
    draw(context, cameraPosition, frame){
        
        if(this.sprite){    //only draw if sprite is valid
            //calculate the sprite draw starting position based on sprite index
            var drawStart = new Vec(Math.floor(frame % (this.sprite.width / this.spriteSize.x)), 
            Math.floor(frame / (this.sprite.width / this.spriteSize.x))).multiply(this.spriteSize);

            //draw specific index of tilemap
            context.drawImage
            (this.sprite, drawStart.x, drawStart.y, this.spriteSize.x, this.spriteSize.y, 
            Math.floor((this.worldLocation.x-this.spriteSize.x/2)-(cameraPosition.x-this.game.width/2)), 
            Math.floor((this.worldLocation.y-this.spriteSize.y/2)-(cameraPosition.y-this.game.height/2)),
            this.spriteSize.x,
            this.spriteSize.y);
            //arguments as follow:  
            //image file, sprite startpixel X, sprite startpixel Y, sprite size X, sprite size Y
            //image draw start X, image draw start Y, relative image draw end X, relative image draw end Y
            //NOTE:Canvas draw start X and Y need to be integers to avoid graphical glitches
            //(how does it even draw half pixels?)

            //if DrawCollisionDebug = true, Draw collision boxes
            if(this.game.drawDebug() && this.physics){this.physics.drawCollision()};

        }
    }
    newAnim(animObject){
        if(this.animHandler){
            //if this is first animation, set it as current animation
            if(!this.animHandler.animcount){
                this.animHandler.currentAnimation = animObject.animation;
                //console.log('current animation set to:', this.animHandler.currentAnimation);
            }
            this.animHandler.animcount++;
            //set animation to named index
            this.animHandler.animations[animObject.animation] = animObject;
        }
    }

}