//This is generic GameObject
import {Vec} from './vector.js';
import {Physics} from './physics.js';
import {Animation} from './animation.js'

export class gameObject{
    constructor(game, spawnPos, physicsTags =[], tilemap, tilemapSize = new Vec(0,0), ){
        this.game = game
        this.worldLocation = spawnPos

        //graphics
        this.sprite = tilemap
        this.spriteSize = new Vec(this.sprite.width, this.sprite.height).divide(tilemapSize)
        this.animationFrame = 0
        //only add animation handler if there's something to animate
        if(tilemapSize.x > 1 || tilemapSize.y > 1)this.animHandler = new Animation(this)

        //physics
        this.tags = physicsTags;
        if(this.tags.includes('block')){
            //add physics handler for moving objects
            this.physics = new Physics(this, this.spriteSize)
        }
        //add to game instance gameObjects array for update() and draw() calls
        this.game.gameObjects.push(this) 
    }

    update(deltaTime){
        //only update physics on moving objects
        if(this.tags.includes('moving')){this.physics.update(deltaTime)}

        //only update animations if there are any
        if(this.animHandler){this.animHandler.update();}
    }

    draw(context, cameraPosition, frame){
        //only draw if sprite is valid
        if(this.sprite){
            //calculate the sprite draw starting position based on sprite index
            var drawStart = new Vec(Math.floor(frame % (this.sprite.width / this.spriteSize.x)), 
                                                Math.floor(frame / (this.sprite.width / this.spriteSize.x))).multiply(this.spriteSize);

            //draw specific index of tilemap
            context.drawImage(this.sprite, drawStart.x, drawStart.y, this.spriteSize.x, this.spriteSize.y, 
            Math.floor((this.worldLocation.x-this.spriteSize.x/2)-(cameraPosition.x-this.game.width/2)), 
            Math.floor((this.worldLocation.y-this.spriteSize.y/2)-(cameraPosition.y-this.game.height/2)),
            this.spriteSize.x, this.spriteSize.y)

            //NOTE:Canvas draw start X and Y need to be integers to avoid graphical glitches
            //(how does it even draw half pixels?)
        }
    }

    newAnim(animObject){
        //add new animations to animHandler

        if(this.animHandler){
            //if this is first animation, set it as current animation
            if(!this.animHandler.animcount){
                this.animHandler.currentAnimation = animObject.animation;
            }
            this.animHandler.animcount++;
            //set animation to named index
            this.animHandler.animations[animObject.animation] = animObject;
        }
    }

}