//class is not a copy of an object, but points to existing one, use New class to create copies
import { gameObject } from "./gameObject.js";
import {InputHandler} from './input.js';
import{Vec} from './vector.js';

export class Player extends gameObject{
    constructor(game, spawnPos, tilemap, tilemapSize){
        super(game, spawnPos, true, tilemap, tilemapSize);
        this.input = new InputHandler();
        this.inputVec = new Vec(1,1);
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

         
         
         this.physics.addMovementInput(this.inputVec, 5, 5);
         //console.log(this.inputVec);
         
         

    }
    draw(context){
        if(this.velocity.x < 0){this.animationFrame = 4;}
        else {this.animationFrame = 0;}
        super.draw(context, this.animationFrame);
    }
}























//this is the old player class

/*export class Player{
    constructor(game){
        this.game = game;
        this.width = 32; //sprite X size
        this.height = 32; //sprite Y size
        this.spriteScale = game.gameScale;
        this.x = 0;
        this.y = 0;

        //JavaScript automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name
        //this.image = player; <- this is perfectly valid
        this.image = document.getElementById('player');
    }
    update(input){
        //.includes() method determines whether an array includes a certain value among its entries, returning true or false as approriate
        if (input.includes('d')) this.x++;
        if (input.includes('a')) this.x--;
        if (input.includes('w')) this.y--;
        if (input.includes('s')) this.y++;
        //console.log(this.game.deltaTime);
        
        
        //console.log(this.x, this.y);
    }
    draw(context){
        //arguments as follow:  
        //image file, sprite startpixel X, sprite startpixel Y, sprite size X, sprite size Y
        //image draw start X, image draw start Y, relative image draw end X, relative image draw end Y          
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width*this.spriteScale, this.height*this.spriteScale);

    }
}*/