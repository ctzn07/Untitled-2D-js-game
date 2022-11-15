//class is not a copy of an object, but points to existing one, use New class to create copies
export class Player{
    constructor(game){
        this.game = game;
        this.width = 16;
        this.height = 16;
        this.x = 0;
        this.y = 0;
        //JavaScript automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name
        //this.image = player; <- this is perfectly valid
        this.image = document.getElementById('player');
    }
    update(input){
        if (input.includes('d')) this.x++;
        if (input.includes('a')) this.x--;
        if (input.includes('w')) this.y--;
        if (input.includes('s')) this.y++;
        
        //.includes() method determines whether an array includes a certain value among its entries, returning true or false as approriate
        //console.log(this.x, this.y);
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)

    }
}