

var view_stage;
var view_renderer;
var view_boundingbox;
var view_arena;

var view_puh1;
var view_puh2;

function TronView(arenaWidth, arenaHeight)
{
  
    view_stage = new PIXI.Stage(0xFFFFFF);
    view_stage.interactive = true;
    view_renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);
    document.body.appendChild(view_renderer.view);     // add the renderer view element to the DOM


    /*
    view_boundingbox = new PIXI.Graphics();
    view_stage.addChild(view_boundingbox);

    view_boundingbox.interactive = true;
    view_boundingbox.clear();
    view_boundingbox.lineStyle(2,0xffffff);
    view_boundingbox.beginFill(0x004499, 1); //background color
    view_boundingbox.drawRect(0,0,window.innerWidth, window.innerHeight);
    view_boundingbox.endFill();
    */




    //set background image
    var texture = PIXI.Texture.fromImage('tron_background.jpg');
    var sprite = new PIXI.Sprite(texture);
    //cropped image
    //var texture2 = new PIXI.Texture(texture, new PIXI.Rectangle(10, 10, 50, 50));
    view_stage.addChild(sprite);





    view_arena = new Arena(arenaWidth, arenaHeight);
    view_stage.addChild(view_arena);


    this.getArena=function()
    {
        return view_arena;
    }.bind(this);

    
    view_puh1 = new PowerUpHolder((window.innerWidth - arenaWidth) / 2, 50, "blue");
    view_stage.addChild(view_puh1);

    this.getPowerUpHolder1=function()
    {
        return view_puh1;
    }.bind(this);
    

    view_puh2 = new PowerUpHolder((window.innerWidth - arenaWidth) / 2 + arenaWidth - 250, 50, "orange");
    view_stage.addChild(view_puh2);

    this.getPowerUpHolder2=function()
    {
        return view_puh2;
    }.bind(this);



    var menuScreen = new MenuScreen(700, 500);
    //var testButton = menuScreen.addButton(20, 20, 100, 50, "touch me");
    view_stage.addChild(menuScreen);

    menuScreen.visible = false;

    this.getMenuScreen=function()
    {
        return menuScreen;
    }.bind(this);

}



MenuScreen.prototype = Object.create(PIXI.Graphics.prototype);
MenuScreen.prototype.constructor = MenuScreen;

function MenuScreen(width, height)
{

    var nextButtonY = 95;

    PIXI.Graphics.call(this); // super.Sprite

    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(0x000000, 1); //black
        
        this.drawRect(0,0,width,height); //x, y, width, height
        this.endFill();

    }.bind(this);


    displaySelf();

    //keep this the same as the arena
    this.x = (window.innerWidth - width) / 2;
    this.y = 150;


    //display "OPTIONS" label at top of this sprite
    var addMenuLabel=function()
    {
        text = new PIXI.Text("OPTIONS", {font:"50px Arial", fill:"white"});
        this.addChild(text);
        text.y += 15;
        text.x += width / 2 - 112;       

    }.bind(this);

    addMenuLabel();




    //creates and returns a new button
    this.addButton=function(_text)
    {
        button = new Button(50, nextButtonY, width - 100, 50, _text);
        this.addChild(button);  

        nextButtonY += 70;

        return button; 

    }.bind(this);

}


Button.prototype = Object.create(PIXI.Graphics.prototype);
Button.prototype.constructor = Button;

function Button(x, y, width, height, text)
{

    var buttonWidth = width;
    var buttonHeight = height;

    PIXI.Graphics.call(this); // super.Sprite
    this.interactive = true;

    var displaySelf=function(color) 
    {
        this.clear();
       
        this.beginFill(color, 1); //
        
        this.drawRect(0, 0, buttonWidth, buttonHeight); //x, y, width, height
        this.endFill();

    }.bind(this);


    displaySelf(0x000000);

    this.x = x;
    this.y = y;


    
    //pass a function to handle click events on this sprite
    this.setClickHandler=function(f)
    {
        this.mousedown=f;
    }.bind(this);


    //add text object to this sprite
    var textSize = (height * 0.8) + "px Arial";
    var textColor = "white";
    
    var addTextHolder=function()
    {
        textObject = new PIXI.Text(" " + text, {font:textSize, fill:textColor});
        textObject.y += 3;
       
        //center the play button
        if(text == "   play") textObject.x -= 3;

        this.addChild(textObject);          

    }.bind(this);

    addTextHolder();


    
    this.changeText=function(message)
    {
        this.getChildAt(0).setText(" " + message);
    }.bind(this);


    
    this.mouseover=function()
    {
        //displaySelf(0x00889F);
        displaySelf(0x005F6F);

    }.bind(this);

    this.mouseout=function()
    {
        displaySelf(0x000000);

    }.bind(this);
    
    
}



PowerUpHolder.prototype = Object.create(PIXI.Graphics.prototype);
PowerUpHolder.prototype.constructor = PowerUpHolder;

function PowerUpHolder(x, y, color)
{

    var width = 250;
    var height = 50;



    PIXI.Graphics.call(this); // super.Sprite


    this.interactive = true;


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
        text.y += 3;
        this.addChild(text);       

    }.bind(this);

    addTextHolder();


    
    this.changeText=function(message)
    {
        this.getChildAt(0).setText(" " + message);
    }.bind(this);
    



    this.setClickHandler=function(f)
    {
        this.mousedown=f;
    }.bind(this);


    /*
    this.mousedown=function(mouseData)
    {
        //console.log("mouse touched");
    }.bind(this);
    */

}



Arena.prototype = Object.create(PIXI.Graphics.prototype);
Arena.prototype.constructor = Arena;

function Arena(width, height)
{
    PIXI.Graphics.call(this); // super.Sprite

    var _width = width;
    var _height = height;

    var _tronLabel;
    var _countdownLabel;
    var _blueBikeImg;
    var _orangeBikeImg;
    var _buttons = [];
    var _bikes = [];
    var _powerups = [];
    
    
    this.getPlayButton=function()
    {
        return _playButton;
    }.bind(this);

    this.getOptionsButton=function()
    {
        return _optionsButton;
    }.bind(this);
    

    this.clearWalls=function()
    {
        displaySelf();
    }.bind(this);

    var clearWalls=function()
    {
        displaySelf();
    }.bind(this);

    this.displayVictoryBlue=function()
    {
        _blueBikeImg.visible = true;
        
        hideButtons();
        hideBikes();
        clearWalls();
        _tronLabel.visible = false
        _countdownLabel.visible = false;
        _orangeBikeImg.visible = true;
        
        clearPowerups();
        
    }.bind(this);

    this.displayVictoryOrange=function()
    {
        _orangeBikeImg.visible = true;
        
        hideButtons();
        hideBikes();
        clearWalls();
        _tronLabel.visible = false
        _countdownLabel.visible = false;
        _blueBikeImg.visible = true;
        
        clearPowerups();
        
    }.bind(this);

    this.displayCountdown=function()
    {
        hideButtons();
        showBikes();
        clearWalls();
        _tronLabel.visible = false;
        _blueBikeImg.visible = false;
        _countdownLabel.visible = true;
        _orangeBikeImg.visible = false;

        _countdownLabel.setText("3");

    }.bind(this);

    this.displayMainScreen=function()
    {
        hideButtons();
        showBikes();
        clearWalls();
        _tronLabel.visible = false;
        _blueBikeImg.visible = false;
        _countdownLabel.visible = true;
        _orangeBikeImg.visible = false;
        
        clearPowerups();

    }.bind(this);


    //hide/show buttons
    var hideButtons=function()
    {
        for (var i = 0; i < _buttons.length; i++) _buttons[i].visible = false;
    }.bind(this);

    var showButtons=function()
    {
        for (var i = 0; i < _buttons.length; i++) _buttons[i].visible = true;
    }.bind(this);


    //hide/show bikes
    var hideBikes=function()
    {
        for (var i = 0; i < _bikes.length; i++) _bikes[i].visible = false;
    }.bind(this);

    var showBikes=function()
    {
        for (var i = 0; i < _bikes.length; i++) _bikes[i].visible = true;
    }.bind(this);
    
    
    //destroy powerups
    var clearPowerups=function()
    {
      for (var i = 0; i < _powerups.length; i++) _powerups[i].clear();
      _powerups = [];
    }.bind(this);


    //hide/show tron label
    this.hideTronLabel=function()
    {
        _tronLabel.visible = false;
    }.bind(this);

    this.showTronLabel=function()
    {
        _tronLabel.visible = true;
    }.bind(this);
    

    //hide/show countdown label
    this.hideCountdownLabel=function()
    {
        _countdownLabel.visible = false;
    }.bind(this);

    this.showCountdownLabel=function()
    {
        _countdownLabel.visible = true;
    }.bind(this);



    var displaySelf=function() 
    {
        this.clear();
       
        this.beginFill(0x000000, 1); //
        
        this.drawRect(0, 0, _width, _height); //x, y, width, height
        this.endFill();

    }.bind(this);

    displaySelf();

    this.x = (window.innerWidth - width) / 2;
    this.y = 150;



    this.changeSize=function(w, h)
    {
        //var _width;
        //var _height;
        
        _width = w;
        _height = h;

        /*
        if(size == "small")
        {
            _width = 600;
            _height = 400;
            //_width = window.innerWidth * .5;
            //_height = window.innerHeight * .5 - 200;
        }
        else if(size == "medium")
        {
            _width = 700;
            _height = 500;
            //_width = window.innerWidth * .6;
            //_height = window.innerHeight * .6 - 200;
        }
        else if(size == "large")
        {
            _width = 800;
            _height = 600;
            //_width = window.innerWidth * .7;
            //_height = window.innerHeight * .7 - 200;
        }
        */
        
        this.clear();
        this.beginFill(0x000000, 1); 
        this.drawRect(0, 0, _width, _height);
        this.endFill();

        //re-center this graphic horizontally
        this.x = (window.innerWidth - _width) / 2;
         
        //reposition the power up views
        view_puh1.x = (window.innerWidth - _width) / 2;
        view_puh2.x = (window.innerWidth - _width) / 2 + _width - 250;

        refreshTronLabelPosition();
        refreshCountdownLabelPosition();
        refreshBlueBikeImgPosition();
        refreshOrangeBikeImgPosition();
        refreshButtonsPosition();

    }.bind(this);




    //create, draw, and return a new bike object
    this.addBike=function(x, y, color)
    {
        bike = new Bike(x, y, color);
        this.addChild(bike);

        _bikes.push(bike);  

        return bike;      

    }.bind(this);
    
    
    this.addPowerup=function(x, y, color)
    {
        powerup = new Powerup(x, y, color);
        this.addChild(powerup);

        _powerups.push(powerup);

        return powerup;      

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




    //display "TRON" label at top of this sprite
    var addMenuLabel=function()
    {
        text = new PIXI.Text("TRON", {font:"100px Arial", fill:"#005F6F"});
        this.addChild(text);
        _tronLabel = text;
        text.y += 30;
        text.x += _width / 2 - 138;    

    }.bind(this);
    addMenuLabel();

    var refreshTronLabelPosition=function()
    {
        _tronLabel.x = _width / 2 - 138; 
    }.bind(this);




    
    //display countdown label
    var addCountdownLabel=function()
    {
        _countdownLabel = new PIXI.Text("", {font:"100px Arial", fill:"#005F6F"});
        this.addChild(_countdownLabel);
        _countdownLabel.y += 200;
        _countdownLabel.x += _width / 2 - 28;    

    }.bind(this);
    addCountdownLabel();

    var refreshCountdownLabelPosition=function()
    {
        _countdownLabel.x = _width / 2 - 28; 
    }.bind(this);

    this.changeCountdownLabelText=function(newText)
    {
        _countdownLabel.setText(newText);
    }.bind(this);





    //display blue bike image
    var addBlueBikeImg=function()
    {
        var texture = PIXI.Texture.fromImage('tron_bluevictory.jpg');
        _blueBikeImg = new PIXI.Sprite(texture);
        this.addChild(_blueBikeImg);
        _blueBikeImg.y = 70;
        _blueBikeImg.x = _width / 2 - 263;    

    }.bind(this);
    addBlueBikeImg();

    var refreshBlueBikeImgPosition=function()
    {
        _blueBikeImg.x = _width / 2 - 263; 
    }.bind(this);



    //display orange bike image
    var addOrangeBikeImg=function()
    {
        var texture = PIXI.Texture.fromImage('tron_orangevictory.jpg');
        _orangeBikeImg = new PIXI.Sprite(texture);
        this.addChild(_orangeBikeImg);
        _orangeBikeImg.y = 70;
        _orangeBikeImg.x = _width / 2 - 263;    

    }.bind(this);
    addOrangeBikeImg();

    var refreshOrangeBikeImgPosition=function()
    {
        _orangeBikeImg.x = _width / 2 - 263; 
    }.bind(this);


    //victory images initially not visible    
    _orangeBikeImg.visible = false;
    _blueBikeImg.visible = false;

    
    



        

    var _nextButtonY = 165;

    //creates and returns a new button
    this.addButton=function(_text)
    {
        button = new Button(270, _nextButtonY, 152, 50, _text);
        this.addChild(button);

        _buttons.push(button);  

        _nextButtonY += 70;

        return button; 

    }.bind(this);
    
        var addButton=function(_text)
    {
        button = new Button(270, _nextButtonY, 152, 50, _text);
        this.addChild(button);

        _buttons.push(button);  

        _nextButtonY += 70;

        return button; 

    }.bind(this);
    
    var _playButton = addButton("   play");
    var _optionsButton = addButton("options");

    var refreshButtonsPosition=function()
    {
        for (var i = 0; i < _buttons.length; i++)
        {
            _buttons[i].x = _width / 2 - 76;
        }
    }






}


Powerup.prototype = Object.create(PIXI.Graphics.prototype);
Powerup.prototype.constructor = Powerup;


function Powerup(x, y, color)
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










