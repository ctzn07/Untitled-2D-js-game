import { Vec } from './vector.js';
import { BlockingVolume } from './blockingvolume.js';

export class Level{
    constructor(game, mapSprite, collisionSprite){
        this.game = game
        this.mapSprite = mapSprite
        this.collisionSprite = collisionSprite
        this.topleft = new Vec(0-this.mapSprite.width/2, 0-this.mapSprite.height/2)
        this.blockingVolumes = []
        this.worldSize = new Vec(mapSprite.width, mapSprite.height);
    }

    draw(context){
            context.drawImage(this.mapSprite, 0, 0, this.mapSprite.width, this.mapSprite.height,
                this.game.width/2-this.game.cameraPosition.x+this.topleft.x, 
                this.game.height/2-this.game.cameraPosition.y+this.topleft.y, 
                this.mapSprite.width, 
                this.mapSprite.height);
    }
    
    generateBlockVolumes(){
        let img = this.collisionSprite
        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d", { willReadFrequently: true });
        let stepping = new Vec(32,32)

        //Issue:        For some reason the loop doesn't complete with full size image
        //Solution:    Scale down the image
        context.scale(1/stepping.x, 1/stepping.y)
        context.clearRect(0,0,img.width, img.height);
        context.drawImage(img, 0, 0);

        for (let x = 0; x < img.width/stepping.x; x++) {
            for (let y = 0; y < img.height/stepping.y; y++){
                //this loop will check pixel data 

                //getImageData.data returns [r, g, b, a]
                const b = context.getImageData(x, y, 1, 1).data[0];
                //b is pixel red value, using different could be used to spawn other type of map elements

                let wx = x*stepping.x+this.topleft.x+stepping.x/2
                let wy = y*stepping.y+this.topleft.y+stepping.y/2

                if(b)this.blockingVolumes.push(new BlockingVolume(this.game, new Vec(wx,wy), ['static', 'blocking'], stepping))
                
            }
        }
    }

    locationToIndex(location){
        //Converting 2D co-ordinates into 1D index
        //y * width + x
        
        let arrWidth = Math.floor((this.worldSize.x-this.topleft.x)/this.game.cellSize.x);
        let thisX = Math.round((location.x-this.topleft.x)/this.game.cellSize.x);
        let thisY = Math.round((location.y-this.topleft.y)/this.game.cellSize.y);

        //returns 1D index value of world location with accuracy of cellSize
        return thisY * arrWidth + thisX;
    }

    indexToLocation(index){
        //Converting 1D index into 2D co-ordinates
        //y = index / width;
        //x = index % width;
        
        let arrWidth = Math.round((this.worldSize.x-this.topleft.x)/this.game.cellSize.x);

        //returns 2D world coordinate from 1D index value with accuracy of cellSize
        return new Vec(index%arrWidth, Math.floor(index/arrWidth)).multiply(this.cellSize).plus(this.level.topleft);
    } 
}

