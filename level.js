import { Vec } from './vector.js';
import { BlockingVolume } from './blockingvolume.js';
import { gameObject } from './gameObject.js';

export class Level{
    constructor(game, mapSprite, collisionSprite){
        this.game = game;
        this.mapSprite = mapSprite;
        this.collisionSprite = collisionSprite
        this.topleft = new Vec(0-this.mapSprite.width/2, 0-this.mapSprite.height/2);
        this.generateCollisions(testlevel_collision, 32);
        this.collisionArray = [];
        
    }
    draw(context){
        //Math.floor((this.worldLocation.x-this.spriteSize.x/2)-(cameraPosition.x-this.game.width/2))
        context.drawImage(this.mapSprite, 0, 0, this.mapSprite.width, this.mapSprite.height,
            0-this.game.cameraPosition.x-this.game.width/2, 
            0-this.game.cameraPosition.y-this.game.height/2, 
            this.mapSprite.width, 
            this.mapSprite.height);

        //arguments as follow:  
        //image file, sprite startpixel X, sprite startpixel Y, sprite size X, sprite size Y
        //image draw start X, image draw start Y, relative image draw end X, relative image draw end Y
    }
    generateCollisions(sprite){

        let img = this.collisionSprite;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d", { willReadFrequently: true });
        let stepping = new Vec(32,32)
        context.clearRect(0,0,img.width, img.height);
        context.drawImage(img, 0, 0);

        for (let x = 0; x < sprite.width; x += stepping.x) {
            for (let y = 0; y < sprite.height; y += stepping.y){
                //this loop will check pixel data 
                //getImageData.data returns [r, g, b, a]
                const b = context.getImageData(x, y, 1, 1).data[0];
                //if .data[0] is above 0, add collision box
                if(b>0){
                    new BlockingVolume(this.game, new Vec(x, y), ['static', 'block'], stepping)
                    
                }
            }
        }
    }

}