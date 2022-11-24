import {Player} from './player.js';
import {Vec} from './vector.js';
import {gameObject} from './gameObject.js';


//load event : JavaScript waits for all dependent resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.gameScale = 1; //use to scale all sprites in game
            this.deltaTime = 0;
            this.timeOld = Date.now();
            this.cameraPosition = new Vec(0,0);
            //since constructor runs on creation, use it to create all the relevant classes as well

            //param list: game, spawn position, spritesheet ref, spritesheet size
            this.player = new Player(this, new Vec(250,250), player, new Vec(4,2));
            //JavaScript automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name, see index.html to see where the player variable comes from
        }
        update(deltaTime){
            //all updated math goes here

            //update deltaTime
            this.deltaTime = (Date.now() - this.timeOld)/1000;
            this.timeOld = Date.now()
            //relay inputs to Player
            this.player.update(deltaTime);
        }
        draw(context){
            //all canvas draws go here
            this.player.draw(context);

        }
    }
    //this triggers the creation of new game class, and run constructor with it
    const game = new Game(canvas.width, canvas.height);
    console.log(game);


    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        //call update on gameobject
        game.update();
        //call game object to run draw, using ctx as context
        game.draw(ctx);
        //testobject.draw(ctx, 0);
        requestAnimationFrame(animate);
    }
    animate();
})