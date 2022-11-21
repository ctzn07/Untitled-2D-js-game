//This is generic GameObject
import{Vec} from './vector.js';
import {Physics} from './physics.js';

export class gameObject{
    constructor(game, location, bSimulatePhysics = true, sprite, tilemapSize = Vec(1,1)){
        this.game = game;
        this.worldLocation = location;
        //physics
        this.enablePhysics = bSimulatePhysics;
        this.physics = new Physics(this);
        this.velocity = new Vec(0,0);
        //graphics
        this.sprite = sprite;
        this.spriteSize = new Vec(this.sprite.width, this.sprite.height).divide(tilemapSize);
        this.animationFrame = 0;
    }
    update(deltaTime){
        if(this.enablePhysics){
            this.physics.update(deltaTime);
        }
    }
    draw(context, frame){
        
        if(this.sprite){    //only draw if sprite is valid
            //calculate the sprite draw starting position based on sprite index
            var drawStart = new Vec(frame % (this.sprite.width / this.spriteSize.x), Math.floor(frame / (this.sprite.width / this.spriteSize.x))).multiply(this.spriteSize);

            //draw specific index of tilemap
            context.drawImage(this.sprite, drawStart.x, drawStart.y, this.spriteSize.x, this.spriteSize.y, 
            this.worldLocation.x-(this.spriteSize.x/2*this.game.gameScale),
            this.worldLocation.y-(this.spriteSize.y/2*this.game.gameScale),
            this.spriteSize.x*this.game.gameScale,
            this.spriteSize.y*this.game.gameScale);

            //arguments as follow:  
            //image file, sprite startpixel X, sprite startpixel Y, sprite size X, sprite size Y
            //image draw start X, image draw start Y, relative image draw end X, relative image draw end Y
        }
    }
}