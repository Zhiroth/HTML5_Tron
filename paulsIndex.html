<!DOCTYPE HTML>
<html>
<head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
    <title>Tron</title>


    <script src="jquery.1.11.1.js"></script> <!-- 1 - JQUERY -->
    <script src="pixi.dev.js"></script>  <!-- 2 - Pixi -->
    <script src="hammer.js"></script>  <!-- 3 - Hammer -->

    <script src="loader.js"></script>

    <script src="view.js"></script>

</head>


<body id="body">

  <div class="c4" style="display: none">
    <h3>use WASD to drive the blue bike</h3>
    <h3>use IJKL to drive the red bike</h3>
    <h3>a collision will be shown if the bikes collide</h3>

  </div>

<script>
    //default to medium arena
    var arenaWidth = 700;
    var arenaHeight = 500;

    //assign the bike objects to variables so we can move them around after they are initially created/drawn (unlike walls, which can be drawn and left where they are)
    var bike1View;
    var bike2View;

    var collision1View;


    var tronView = new TronView(arenaWidth, arenaHeight);

    var arenaView = tronView.getArena();






    //ALL THIS STUFF IS NEW:



    //access the options screen
    var optionsView = tronView.getMenuScreen();


    //display the various screens (these all appear on the arena view):
    //arenaView.displayVictoryBlue(); //hides everything but a blue player victory image
    //arenaView.displayVictoryOrange(); //hides everything but an orange player victory image
    //arenaView.displayMainScreen(); //initial screen (shows the "tron" label and play/options buttons)
    
    //display the initial countdown view and decrement the countdown
    //arenaView.displayCountdown(); //display this after user selects "play" button; displays the bikes and sets countdown display to "3"
    //arenaView.changeCountdownLabelText("2");
    //arenaView.changeCountdownLabelText("1");
    //arenaView.hideCountdownLabel();



    var playButton = arenaView.addButton("  play");
    playButton.setClickHandler(function() { arenaView.displayCountdown() } );
    var enterOptionsButton = arenaView.addButton("options");
    enterOptionsButton.setClickHandler(displayOptionsScreen);

    function displayOptionsScreen()
    {
        arenaView.visible = false;
        optionsView.visible = true;
    }

    function displayArenaView()
    {
        arenaView.visible = true;
        optionsView.visible = false;
    }
    


    //put text in power-up holders
    var puh1View = tronView.getPowerUpHolder1();
    puh1View.changeText("speed up");

    //set click handler
    puh1View.setClickHandler(function() { console.log("it bloody works!"); });
    
    //set visibility
    //puh1View.visible = false;

    var puh2View = tronView.getPowerUpHolder2();
    puh2View.changeText("break walls");




    var toggleArenaSizeButton = optionsView.addButton("arena size: medium"); //args: x, y, width, height, text
    toggleArenaSizeButton.setClickHandler(toggleArenaSize);

    var arenaSizeText = "medium";

    function toggleArenaSize()
    {
        if(arenaSizeText == "small") 
        {
            arenaSizeText = "medium";
            arenaView.changeSize("medium");
        }
        else if(arenaSizeText == "medium") 
        {
            arenaSizeText = "large";
            arenaView.changeSize("large");
        }
        else 
        {
            arenaSizeText = "small";
            arenaView.changeSize("small");
        }

        //UPDATE MODEL

        //this function automatically repositions the power-up views
        toggleArenaSizeButton.changeText("arena size: " + arenaSizeText);


    }

    

    //change bike speed
    var toggleBikeSpeedButton = optionsView.addButton("bike speed: fast");
    toggleBikeSpeedButton.setClickHandler(function() { toggleBikeSpeedText(); });

    var bikeSpeedText = "fast";

    function toggleBikeSpeedText()
    {
        if(bikeSpeedText == "fast") bikeSpeedText = "medium";
        else bikeSpeedText = "fast";

        //UPDATE MODEL

        toggleBikeSpeedButton.changeText("bike speed: " + bikeSpeedText);
    }



    //exit options window
    var exitOptionsButton = optionsView.addButton("done");
    exitOptionsButton.setClickHandler(displayArenaView);





    //END NEW STUFF.









    //bike1
    var bike1_x = 60;
    var bike1_y = 60;
    var bike1_color = 0x0000CC;
    var bike1_speed = 10;

    bike1View = arenaView.addBike(bike1_x, bike1_y, bike1_color);

    //bike2
    var bike2_x = 630;
    var bike2_y = 430;
    //var bike2_x = 60;
    //var bike2_y = 80;
    var bike2_color = 0xFF9933;
    var bike2_speed = 10;

    bike2View = arenaView.addBike(bike2_x, bike2_y, bike2_color);



    //begin animation loop
    requestAnimFrame(animate);

    //run animation loop
    function animate()
    {
        
        //DO OTHER CONTROLLER STUFF HERE  

        
        //collision animation
        if (collision1View && collision1View.radius > 0)
        {
            collision1View.radius += 4;
            if (collision1View.radius >= 80) collision1View.radius = 0;

            //we can't simply change the radius (apparently), the object has to be redrawn to reflect the adjusted radius
            //redraw is a method I wrote, it's not built into the api
            collision1View.redraw();
        }
        




        requestAnimFrame(animate);
        view_renderer.render(view_stage);     // render the stage
    }



    //move bike1 up(w), left(a), down(s), right(d)
    //move bike2 up(i), left(j), down(k), right(l)
    //keydown and keypress events fire repeatedly while a key is pressed, but keyup events only fire on a keyup
    $(document).keyup(function(e){
        var key = e.which;

        console.log("key: " + key);


        //for bike1
        if (key == 87)      bike1_y -= bike1_speed;  //w
        else if (key == 65) bike1_x -= bike1_speed;  //a
        else if (key == 83) bike1_y += bike1_speed;  //s
        else if (key == 68) bike1_x += bike1_speed;  //d

        //keep bike in the arena
        if (bike1_x >= arenaWidth) bike1_x = arenaWidth - bike1_speed;
        if (bike1_x < 0) bike1_x = 0;
        if (bike1_y >= arenaHeight) bike1_y = arenaHeight - bike1_speed;
        if (bike1_y < 0) bike1_y = 0;

        //draw wall behind bike
        arenaView.drawWall(bike1View.x, bike1View.y, bike1_x, bike1_y, bike1_color);

        //move the bike
        bike1View.x = bike1_x;
        bike1View.y = bike1_y;


        //for bike2
        if (key == 73)      bike2_y -= bike2_speed;  //i
        else if (key == 74) bike2_x -= bike2_speed;  //j
        else if (key == 75) bike2_y += bike2_speed;  //k
        else if (key == 76) bike2_x += bike2_speed;  //l

        //keep bike in the arena
        if (bike2_x >= arenaWidth) bike2_x = arenaWidth - bike2_speed;
        if (bike2_x < 0) bike2_x = 0;
        if (bike2_y >= arenaHeight) bike2_y = arenaHeight - bike2_speed;
        if (bike2_y < 0) bike2_y = 0;

        //draw wall behind bike
        arenaView.drawWall(bike2View.x, bike2View.y, bike2_x, bike2_y, bike2_color);

        //move the bike
        bike2View.x = bike2_x;
        bike2View.y = bike2_y;


        //draw collision when bikes hit eachother
        if (bike1View.x == bike2View.x && bike1View.y == bike2View.y)
        {
            collision1View = arenaView.addCollision(bike1View.x, bike1View.y);
            collision1View.radius++;
        }
    });

</script>

</body>

</html>

