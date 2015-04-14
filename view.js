
var stage;
var renderer;
var boundingbox;
var arena;

function TronView()
{
    stage = new PIXI.Stage(0x57A52E);
    stage.interactive = true;
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);
    document.body.appendChild(renderer.view);     // add the renderer view element to the DOM

    boundingbox = new PIXI.Graphics();
    stage.addChild(boundingbox);

    boundingbox.interactive = true;
    boundingbox.clear();
    boundingbox.lineStyle(2,0xffffff);
    boundingbox.beginFill(0x0000CC, 0);
    boundingbox.drawRect(0,0,window.innerWidth, window.innerHeight);
    boundingbox.endFill();

    arena = new Arena();
    stage.addChild(arena);
    requestAnimFrame(animate);

    this.getArena=function()
    {
        return arena;
    }.bind(this);


}

Arena.prototype = Object.create(PIXI.Graphics.prototype);
Arena.prototype.constructor = Arena;

function Arena()
{
    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(0x000000, 1); 
        
        this.drawRect(0,0,200,200); 
        this.endFill();

    }.bind(this);

    displaySelf();

    this.x = 50;
    this.y = 50;

    
    this.drawBike=function(x, y, color)
    {
        bike = new Bike(x, y, color);
        this.addChild(bike);        

    }.bind(this);
    
    
}


Bike.prototype = Object.create(PIXI.Graphics.prototype);
Bike.prototype.constructor = Bike;


function Bike(x, y, color)
{
    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(color, 1); //
        
        this.drawRect(0,0,20,20); //x, y, width, height
        this.endFill();

    }.bind(this);

    displaySelf();

    this.x = x;
    this.y = y;
}

function animate()
{
    requestAnimFrame(animate);
    renderer.render(stage);     // render the stage
}









