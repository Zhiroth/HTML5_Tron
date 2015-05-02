

var view_stage;
var view_renderer;
var view_boundingbox;
var view_arena;

//var view_puh1;

function TronView(arenaWidth, arenaHeight)
{
  
    view_stage = new PIXI.Stage(0xFFFFFF);
    view_stage.interactive = true;
    view_renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);
    document.body.appendChild(view_renderer.view);     // add the renderer view element to the DOM


    view_boundingbox = new PIXI.Graphics();
    view_stage.addChild(view_boundingbox);

    view_boundingbox.interactive = true;
    view_boundingbox.clear();
    view_boundingbox.lineStyle(2,0xffffff);
    view_boundingbox.beginFill(0x004499, 1); //background color
    view_boundingbox.drawRect(0,0,window.innerWidth, window.innerHeight);
    view_boundingbox.endFill();


    view_arena = new Arena(arenaWidth, arenaHeight);
    view_stage.addChild(view_arena);




    this.getArena=function()
    {
        return view_arena;
    }.bind(this);

    
    var view_puh1 = new PowerUpHolder((window.innerWidth - arenaWidth) / 2, 50, "blue");
    view_stage.addChild(view_puh1);

    this.getPowerUpHolder1=function()
    {
        return view_puh1;
    }.bind(this);
    

    var view_puh2 = new PowerUpHolder((window.innerWidth - arenaWidth) / 2 + arenaWidth - 250, 50, "red");
    view_stage.addChild(view_puh2);

    this.getPowerUpHolder2=function()
    {
        return view_puh2;
    }.bind(this);

}



PowerUpHolder.prototype = Object.create(PIXI.Graphics.prototype);
PowerUpHolder.prototype.constructor = PowerUpHolder;

function PowerUpHolder(x, y, color)
{

    var width = 250;
    var height = 50;



    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(0x000000, 1); //
        
        this.drawRect(0,0,width,height); //x, y, width, height
        this.endFill();

    }.bind(this);


    displaySelf();

    this.x = x;
    this.y = y;


    var textSize = (height * 0.8) + "px Arial";
    
    var addTextHolder=function()
    {
        text = new PIXI.Text("", {font:textSize, fill:color});
        this.addChild(text);       

    }.bind(this);

    addTextHolder();


    
    this.changeText=function(message)
    {
        this.getChildAt(0).setText(" " + message);
    }.bind(this);
    

}



Arena.prototype = Object.create(PIXI.Graphics.prototype);
Arena.prototype.constructor = Arena;

function Arena(width, height)
{
    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(0x000000, 1); //
        
        this.drawRect(0,0,width,height); //x, y, width, height
        this.endFill();

    }.bind(this);


    displaySelf();

    this.x = (window.innerWidth - width) / 2;
    this.y = 150;


    //create, draw, and return a new bike object
    this.addBike=function(x, y, color)
    {
        bike = new Bike(x, y, color);
        this.addChild(bike);  

        return bike;      

    }.bind(this);


    //create, draw, and return a new collision object
    this.addCollision=function(x, y)
    {
        collision = new Collision(x, y);  
        this.addChild(collision);

        return collision;

    }.bind(this);
    

    //x1, y2 is bike's last position; x2, y2 is bike's new position
    this.drawWall=function(x1, y1, x2, y2, color)
    {
        //origin of the rectangle (add 3 to both dimensions so wall is centered relative to bike size 10 and wall thickness 4)
        var xTop = Math.min(x1, x2) + 3;
        var yTop = Math.min(y1, y2) + 3;

        var xDif = Math.abs(x1 - x2);
        var yDif = Math.abs(y1 - y2);

        //if bike movement was horizontal, make rectangle height 4 and add 3 to length
        //if bike movement was vertical,   make rectangle length 4 and add 3 to height
        if (xDif == 0) 
        {
            xDif = 4;
            yDif += 3;
        }
        else
        {
            yDif = 4;
            xDif += 3;
        }

        this.beginFill(color, 1);
        this.drawRect(xTop, yTop, xDif, yDif); //x, y, width, height
        this.endFill();     

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
        
        this.drawRect(0,0,10,10); //x, y, width, height
        this.endFill();

    }.bind(this);

    displaySelf();

    this.x = x;
    this.y = y;
}


Collision.prototype = Object.create(PIXI.Graphics.prototype);
Collision.prototype.constructor = Collision;


//x and y are center coordinates (NOT top-left coordinates)
function Collision(x, y)
{
    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.beginFill(0xFF0000, 1);
        this.drawCircle(0, 0, 0); //x, y, radius
        this.endFill(); 

    }.bind(this);

    this.redraw=function()
    {
        
        this.clear();
        this.beginFill(0xFF0000, 1);
        this.drawCircle(0, 0, this.radius); //x, y, radius
        this.endFill(); 
        

    }.bind(this);



    displaySelf();


    //add 5 to both dimensions to center circle in middle of bike/cell
    this.x = x + 5;
    this.y = y + 5;
    this.radius = 0;
}



/*
function animate()
{
    requestAnimFrame(animate);
    view_renderer.render(view_stage);     // render the stage
}
*/










