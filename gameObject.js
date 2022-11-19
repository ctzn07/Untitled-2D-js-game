//This is generic GameObject
import{Vec} from './vector.js';
import {Physics} from './physics.js';

export class gameObject{
    constructor(game, location = Vec(0,0), bSimulatePhysics = true, sprite, tilemapSize = Vec(1,1)){
        this.game = game;
        this.worldLocation = location;
        //physics
        this.enablePhysics = bSimulatePhysics;
        this.physics = new Physics(this.game, 0.5)
        //graphics
        this.sprite = sprite;
        this.spriteSize = new Vec(this.sprite.width, this.sprite.height).divide(tilemapSize);
        this.animationFrame = 0;
    }
    update(){
        if(this.enablePhysics){
            this.physics.update(this.game.deltaTime);
        }
    }
    draw(context, frame){
        
        if(this.sprite){    //only run draw if sprite is valid
            /*context.drawImage(this.sprite, 0, 0, this.spriteSize.x, this.spriteSize.y, 
            this.worldLocation.x-(this.spriteSize.x/2*this.game.gameScale), //origin adjust
            this.worldLocation.y-(this.spriteSize.y/2*this.game.gameScale), //origin adjust
            this.spriteSize.x*this.game.gameScale,     //value is relative to draw start, do not adjust
            this.spriteSize.y*this.game.gameScale);   //value is relative to draw start, do not adjust */
            let maxX = this.sprite.width / this.spriteSize.x;
            var drawStart = new Vec(frame % (this.sprite.width / this.spriteSize.x), Math.floor(frame / (this.sprite.width / this.spriteSize.x))).multiply(this.spriteSize);
            //console.log(this.spriteSize.toString());

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
    setWorldLocation(vec){
        this.worldLocation = vec;
    }
    setVelocity(velocity){
        this.physics.velocity = velocity;
    }
    getVelocity(){
        return this.physics.velocity;
    }
    addForce(vec = new Vec(0,0)){
        this.physics.velocity += vec.multiplyValue(this.game.deltaTime);
    }
    
}