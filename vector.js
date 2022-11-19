export class Vec{
    constructor(x = 0, y = 0){
        //important to initialize default values to save headache...
        this.x = x;
        this.y = y;
    }
    plus(otherVec) {return new Vec(this.x + otherVec.x, this.y + otherVec.y);}
    plusValue(value){return new Vec(this.x + value, this.y + value);}
    minus(otherVec) {return new Vec(this.x - otherVec.x, this.y - otherVec.y);}
    minusValue(value){return new Vec(this.x - value, this.y - value);}
    multiply(otherVec) {return new Vec(this.x * otherVec.x, this.y * otherVec.y);}
    multiplyValue(value){return new Vec(this.x * value, this.y * value);}
    divide(otherVec){return new Vec(this.x / otherVec.x, this.y / otherVec.y);}
    divideValue(value){return new Vec(this.x / value, this.y / value);}
    length(){return Math.sqrt(this.x * this.x + this.y * this.y);}
    normalize(){return new Vec(this.x/this.length(), this.y/this.length());}
    toString() {return `Vec{x: ${this.x}, y: ${this.y}}`;}
}