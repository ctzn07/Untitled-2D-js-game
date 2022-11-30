import{Vec} from './vector.js';

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
    generateCollisions(sprite, size){
        let maxX = Math.floor(sprite.width / size);
        let maxY = Math.floor(sprite.height / size);
        var img = this.collisionSprite;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext("2d", { willReadFrequently: true });
        
        context.clearRect(0,0,img.width, img.height);
        context.drawImage(img, 0, 0);

        for (let x = 0; x < maxX; x++) {
            for (let y = 0; y < maxY; y++){
                //this loop will go through 0-31 on x and y axis
                //getImageData.data returns [r, g, b, a]
                const b = context.getImageData(x*size, y*size, 1, 1).data[0];
                //if .data[0] is above 0, add collision box
                if(b>0){
                    //
                }
            }
        }
    }

}