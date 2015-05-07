
//This follows the Revealing Module Pattern


var newModel = function(){
	var pub = {}; // Add all methods/variables that you want to be public

	// Represents a physical object in the game. Used as follows for inheritance:
	// var pub = Object.create(GameObject); //This means pub inherits from GameObject
	var BoardObject =
	{
		type: "BoardObject", // Change name to the type of object
		row: 0, 	// current row position
		col: 0,		// current column position
		lastRow: 0,
		lastCol: 0,
		rowDirection: 0,	// current row direction
		colDirection: 0,	// current column direction
		speed: 0, 		// current speed of bike.
		progress: 0,		// how much progress it's made towards moving to the next square
		fromRowDirection: 0, // The last row direction we moved in
		fromColDirection: 0, // The last col direction we moved in
		solid: false,
		visible: true,
		onBoard: true,
		movedLastFrame: false,
		hitBy: function(obj){}, // "How will YOU react when hit by said obj? Obj will react to you after this function ends."
		hits: function(obj){}, // "How you react to hitting something"
		update: function(){}
	}

	// - - - - - Basic Model Variables - - - - - - 

	var defaultBoardWrap = false;
	var defaultBoardRows = 30;
	var defaultBoardCols = 30;
	var grid;

	var defaultSpeed = 25;  // Patch? All values of speed should evenly "fit" into the threshold to facilitate smooth movements.
	var threashhold = 100;	// How much cumulative "speed" a bike needs to accumulate before moving one square.
	var bikes = [];
	var liveBikes = []; // Contains the offical list of bikes that are still alive in the game.


	pub.crashImpactPercent = .3; //1 = all the way into the cell, 0 = previous cell

	pub.getBikes = function() // For debugging and testing purposes mainly
	{
		return bikes;
	}

	function shallowCopy(oldObj, intoObj) {
	    var newObj = intoObj;
	    for(var i in oldObj) {
	        if(oldObj.hasOwnProperty(i)) {
	            newObj[i] = oldObj[i];
	        }
	    }
	    return newObj;
	}

	// Returns a random number between the min and max inclusive
	function rndInt(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	// - - - - - - - - Power Ups! - - - - - - - - 

	// All properties that are common among power ups and not a Board Object.
	var PowerUp = 
	{
		type: "Power Up", // Overrides the GameObject type
		active: false,
		duration: 50, // Default 3 second duration if 50 fps
		ticksLeft: 0,
		bike: null,
		start: function(){},
		update: function(){},
		end: function(){}
	}


	pub.PowerUpTypes = {};
	pub.UsingThesePowerUpTypes = [];

	pub.FrequencyOfPowerUpsOffset = 50; //How long to wait before spawning first powerup. (Default 1 sec at 50 fps).
	pub.FrequencyOfPowerUps = 250; // How many ticks between power up spawns. (Every 5 seconds if game running at 50 fps)

	// The counter tracking when to spawn in new power ups
	var powerUpTick = pub.FrequencyOfPowerUps - pub.FrequencyOfPowerUpsOffset;

	pub.PowerUpsOnBoard = [];
	pub.ActivePowerUps = []; // Array


	// Called when a power up appears on the board
	var powerUpSpawnCallback = function(powerUp){};
	pub.SetPowerUpSpawnCallback = function(func)
	{
		powerUpSpawnCallback = func;
	}

	// Called when a power up is picked up by the given player
	var powerUpPickUpCallback = function(bike){};
	pub.SetPowerUpPickUpCallback = function(func)
	{
		powerUpPickUpCallback = func;
	}

	// Called when a power up is picked up
	var powerUpActivateCallback = function(bike){};
	pub.SetPowerUpActivateCallback = function(func)
	{
		powerUpActivateCallback = func;
	}


	// Adds all the power ups types to the game
	pub.AddAllPowerUpTypes = function()
	{
		// Loop through all the power up types and add them to the game
		for(var i in pub.PowerUpTypes)
			pub.UsingThesePowerUpTypes[pub.UsingThesePowerUpTypes.length] = pub.PowerUpTypes[i];
	}

	pub.RemoveAllPowerUpTypes = function()
	{
		pub.UsingThesePowerUpTypes = [];
	}

	pub.SetAllPowerUpDurations = function(ticks)
	{
		for(var i in pub.PowerUpTypes)
			pub.PowerUpTypes[i].duration = ticks;
	}

	// Holds properties of a the type of powerup 
	pub.PowerUpTypes.SelfSpeedUp =
	{
		name: "Speed Up",
		color: 0xFF0000,
		duration: 50,
		originalSpeed: 0,
		start: function()
		{
			this.originalSpeed = this.bike.speed;
			this.bike.speed = Math.round(1.50 * defaultSpeed);
		},

		update: function()
		{

		},

		end: function()
		{
			this.bike.speed = this.originalSpeed;
		}
	}



	pub.NewPowerUp = function(PU_TYPE)
	{
		var puPub = {};
		// Get a copy of all properties from BoardObject and PowerUp
		shallowCopy(BoardObject, puPub);
		shallowCopy(PowerUp, puPub);
		shallowCopy(PU_TYPE, puPub);

		puPub.puType = PU_TYPE;

		puPub.activate = function()
		{
			puPub.active = true;
			puPub.ticksLeft = puPub.duration;
			// Add this to the active power ups list
			pub.ActivePowerUps[pub.ActivePowerUps.length] = puPub;

			// Allow the setup
			puPub.start();

			// Notify the controller that this power activated
			powerUpActivateCallback(puPub);
		}

		// Return the puPublic methods and variables you can use
		return puPub;
	}

	// Automatically creates a new power up, adds it to the game, and returns a reference to it.
	pub.AddNewPowerUp = function(PU_Type)
	{
		// if a power up is specified, use that, otherwise get a random one
		if(PU_Type==null)
		{
			// Get number of power up types
			var i = pub.UsingThesePowerUpTypes.length;
			var index = rndInt(0, i-1);
			PU_Type = pub.UsingThesePowerUpTypes[index];
		}


		//todo add power ups to the board rather than the players directly
		// Add to the game
		//PowerUpsOnBoard[PowerUpsOnBoard.length] = pu;

		//: Automatically add the power up to each player
		for(var i in liveBikes)
		{
			var b = liveBikes[i];
			if(b.powerUp == null)
			{
				// Create the new powerup
				var pu = pub.NewPowerUp(PU_Type);

				// Give b a random powr up
				b.powerUp = pu;
				pu.bike = b;
				// report the pickup
				powerUpPickUpCallback(b);
			}
		}

		// Return a reference to it
		return pu;
	}

	// By default, have all the power up types in the game
	pub.AddAllPowerUpTypes();



	var UpdatePowerUps = function()
	{
		var ActivePowerUps = pub.ActivePowerUps;
		// Update each of the active power ups
		for(var i in ActivePowerUps)
			ActivePowerUps[i].update();

		// Clear out any expired power ups
		for(var i = 0; i < ActivePowerUps.length; i++)
		{
			var left = ActivePowerUps[i].ticksLeft --;
			if(left<=1)
			{
				// Let the power up clean up
				ActivePowerUps[i].end();

				// Deactivate power up
				ActivePowerUps[i].active = false;

				// Remove from player
				ActivePowerUps[i].bike.powerUp = null;

				// Remove it from the array
				ActivePowerUps.splice(i,1);
				i--; // counter the i++ so we stay in the same spot
			}
		}

		// Update tick
		powerUpTick++;
		if(powerUpTick >= pub.FrequencyOfPowerUps)
		{
			// Reset the counter
			powerUpTick = 0;

			// Add new power up to the game
			pub.AddNewPowerUp(null);
		}
	}
		
	//- - - - - - - - - - - - Game Settings - - - - - - - - - - - - 

	/// Sets whether or not players can move off one side of the screen and appear on the other. Default is false.
	pub.SetBoardWrap = function(allow)
	{
		defaultBoardWrap = allow;
	}

	pub.GetBoardWrap = function()
	{
		return defaultBoardWrap;
	}

	/// Sets how detailed the game board is. If you give this method “10” then it’ll the grid 10 rows.
	pub.SetBoardRows = function(number)
	{
		defaultBoardRows = number;
	}

	pub.GetBoardRows = function()
	{
		return defaultBoardRows;
	}

	/// Sets how detailed the game board is. If you give this method “10” then it’ll the grid 10 columns.
	pub.SetBoardColumns = function(number)
	{
		defaultBoardCols = number;
	}

	pub.GetBoardColumns = function()
	{
		return defaultBoardCols;
	}

	/// Sets the default speed for every player. Speed is added to the player’s “movement” on each update.  Defaults is 10.
	pub.SetDefaultPlayerSpeed = function(speed)
	{
		defaultSpeed = speed;
	}

	pub.GetDefaultPlayerSpeed = function()
	{
		return defaultSpeed;
	}

	/// Sets the default bar for how much “movement” players needs to accumulate before they move one square on the grid.
	pub.SetProgressThreshhold = function(thresh)
	{
		threashhold = thresh;
	}

	pub.GetProgressThreshhold = function()
	{
		return threashhold;
	}

	//--------- GRID methods ----------

	var processOutsideBounds;
	var grid;
	var updateGrid;

	var Wall = {type: "Wall", hitBy:function(){}, solid: true};
	var EmptyCell = {type: ""}

	var isOutside = function(gameObj)
	{
		return (gameObj.row >= defaultBoardRows || gameObj.col >= defaultBoardCols || gameObj.row < 0 || gameObj.col < 0);
	}

	var wrap = function(gameObj)
	{
		var prevR = gameObj.row;
		var prevC = gameObj.col;
		gameObj.row = (gameObj.row + defaultBoardRows) % defaultBoardRows;
		gameObj.col = (gameObj.col + defaultBoardCols) % defaultBoardCols;
		if((gameObj.row != prevR || gameObj.col!=prevC) && gameObj.type=="Bike")
			gameObj.drawWall = false;
		return true;
	}
	var noWrap = function(gameObj)
	{
		if(isOutside(gameObj))
		{
			gameObj.die();
			return false;
		}
		return true;
	}

	var isWrapAllowed = function()
	{
		return processOutsideBounds==wrap;
	}

	// The function to calc wraping
	var setWrap = function(allow)
	{
		if(allow)
			processOutsideBounds = wrap;
		else
			processOutsideBounds = noWrap;
	}

	var resetGrid = function()
	{
		// Initialize the Grid
		setWrap(defaultBoardWrap);

		grid = [];
		updateGrid = [];
		// Fill out the grid with empty arrays
		
		for(var i=0; i < defaultBoardRows;i++)
			for(var j=0;j<defaultBoardCols; j++)
			{
				// If we're on a new column, add a new array
				if(j==0)
				{
					grid[i] = [];
					updateGrid[i] = [];
				}
				// Fill the cell with empty inhabited arrays
				grid[i][j] = EmptyCell;
				updateGrid[i][j] = EmptyCell;
				/*
				grid[i][j] = {
					solids: []
				};
				updateGrid[i][j] = {
					solids: []
				}; //*/
			}
	}
	resetGrid();
		


	//- - - - - - - - - - - - Bike Methods- - - - - - - - - - - - 

	/// The class that holds information about a specific bike
	pub.BIKE = function()
	{
		this.type = "Bike";
		this.onBoard = true;
		this.solid = true;
		this.movedLastFrame = false;
		this.startRow = null;
		this.startCol = null;
		this.startRowDirection = null;
		this.startColDirection = null;
		this.startSpeed = null; // if null then it will be 10 or whatever you set with “SetBasePlayerSpeed(int)”
		this.row = 0; 	// current row position
		this.col = 0;		// current column position
		this.prevRow = null;
		this.prevCol = null;
		this.rowDirection = 0;	// current row direction
		this.colDirection = 0;	// current column direction
		this.speed = 0; 		// current speed of bike.
		this.progress = 0;		// how much progress it's made towards moving to the next square
		this.fromRowDirection = null;
		this.fromColDirection = null;
		this.drawWall = true;

		this.powerUp = null;

		this.hits = function(obj)
		{
			if(obj.solid)
			{
				// set the progress to determine how far into the object the bike appears (0-threshhold)
				this.progress = pub.crashImpactPercent * threashhold;
				this.die();
			}
		}

		this.hitBy = function(obj)
		{
			if(obj.solid)
				this.die();
		}

		// Note: The methods dealing with the bike life are written so that the Model.getLiveBikes() is fast.
		//   While we <i> could </i> also keep track of whether or not this bike is alive I don't want to have
		//   to "just remember" to update it in both places and risk a mismatch.
		//   Use these functions sparingly.

		this.isAlive = function()
		{
			// Look for the bike in the alive array
			for(var i=0;i<liveBikes.length;i++)
				if(liveBikes[i]==this)
					return true; // If we found the bike, it is alive
			// If we didn't find the bike, then it is considered dead
			return false;
		}

		this.revive = function()
		{
			// Make sure we haven't already added the bike
			for(var i=0;i<liveBikes.length;i++)
				if(liveBikes[i]==this)
					return false; // If we already have the bike, don't add it

			// Revive the bike
			liveBikes[liveBikes.length] = this;
			return true;
		}

		this.die = function()
		{
			this.onBoard = false;
			// look for bike in alive array
			for(var i=0;i<liveBikes.length;i++)
				// If we found the bike
				if(liveBikes[i]==this)
				{
					liveBikes.splice(i, 1);
					break;
				}

			ReportCollision(this.row, this.col, this);
		}
	

		/// Tells the model to give the specified player a new direction
		///        RowDirection & ColDirection are either -1, 0, or 1
		var PlayerTurns = function(bike, RowDirection, ColDirection)
		{
			// If the player's directions add up to zero then ignore
			if(bike.fromRowDirection+RowDirection == 0 && bike.fromColDirection+ColDirection==0)
				return;

			bike.rowDirection = RowDirection;
			bike.colDirection = ColDirection;
		}

		this.TurnsNorth = function()
		{
			PlayerTurns(this, -1, 0);
		}

		this.TurnsEast = function()
		{
			PlayerTurns(this, 0, 1);
		}

		this.TurnsSouth = function()
		{
			PlayerTurns(this, 1, 0);
		}

		this.TurnsWest = function()
		{
			PlayerTurns(this, 0, -1);
		}
		
		this.StartsNorth = function()
		{
			this.startRowDirection = -1;
			this.startColDirection =  0;
		}

		this.StartsEast = function()
		{
			this.startRowDirection = 0; 
			this.startColDirection = 1;
		}

		this.StartsSouth = function()
		{
			this.startRowDirection = 1; 
			this.startColDirection = 0;
		}

		this.StartsWest = function()
		{
			this.startRowDirection = 0;
			this.startColDirection = -1;
		}

		/// Tells the model that the given Player wants to activate their ability
		this.Activate = function()
		{
			if(this.powerUp != null)
				this.powerUp.activate();

			//this.speed = this.speed += 10;
			//this.drawWall = false;
		}

		this.update = function()
		{
			// Set the default at beginning
			this.drawWall = true;

			// If the bike has no direction then don't move it
			if(this.rowDirection != 0 || this.colDirection != 0 )
				this.progress += this.speed; // Update the bike's progress
		}

		this.extra= {};  // Holds any kind of data you want, I won’t use it in the Model.
	}

	/// Adds the given bike to the official game. By default it is considered alive.
	pub.AddBike = function(bike)
	{
		// Make sure we haven't already added the bike
		var i=0;
		for(;i<bikes.length;i++)
			if(bikes[i]==bike)
				return false; // If we already have the bike, don't add it
		
		bikes[bikes.length] = bike;
		// If the bike we're adding is alive, add it to the alive list too.
		bike.revive();

		return true;
	}

	/// Removes the given bike from the official game
	pub.RemoveBike = function(bike)
	{
		// look for the bike in array
		for(var i=0;i<bikes.length;i++)
			// If we found the bike
			if(bikes[i]==bike)
			{
				bikes.splice(i, 1);
				break;
			}

		// look for bike in alive array
		for(var i=0;i<liveBikes.length;i++)
			// If we found the bike
			if(liveBikes[i]==bike)
			{
				liveBikes.splice(i, 1);
				break;
			}
	}

	/// Deletes all bikes from the game
	pub.RemoveAllBikes = function()
	{
		bikes = [];
		liveBikes = [];
	}

	/// Gets a list of all the bikes that have not crashed yet
	pub.GetLiveBikes = function()
	{
		return liveBikes;
	}


	//- - - - - - - - - - - - Game Loop Methods - - - - - - - - - - - - 

	/// Resets and setups a game. (If you run this right as a game finishes, it will immediately restart the game with the same original settings)
	pub.StartGame = function()
	{
		// Grab a new grid
		resetGrid();	

		// Reset power up stuff
		pub.ActivePowerUps = [];

		//bookmark
		powerUpTick = pub.FrequencyOfPowerUps - pub.FrequencyOfPowerUpsOffset;

		for(var i=0; i<bikes.length;i++)
		{
			var b = bikes[i];

			// Make sure all the bikes are alive
			b.revive();
			// Reset the position and 
			if(b.startRow!=null)
				b.row = b.startRow;
			else
				b.row = parseInt(defaultBoardRows/bikes.length)*i;

			if(b.startCol!=null)
				b.col = b.startCol;
			else
				b.col = 0;

			if(b.startRowDirection!=null)
				b.rowDirection = b.startRowDirection;
			else
				b.rowDirection = 0;

			if(b.startColDirection!=null)
				b.colDirection = b.startColDirection;
			else
				b.colDirection = 1;

			// Set the speed
			if(b.startSpeed==null)
				b.speed = defaultSpeed;
			else
				b.speed = b.startSpeed;

			b.prevRow = b.row;
			b.prevCol = b.col;

			b.fromRowDirection = 0;
			b.fromColDirection = 0;

			b.powerUp = null;

			if(b.row >= defaultBoardRows || b.col >= defaultBoardCols || b.row < 0 || b.col < 0)
				throw new Error("Cannot start bike outside of board.");

			grid[b.row][b.col] = b;
		}
	}

	/// Tells the model to do one round of updates
	pub.UpdateObjects = function()
	{
		// Check for powerups
		//UpdatePowerUps();

		// Update all Game objects
		for(var i in liveBikes)
		{
			var b = liveBikes[i];

			b.update();
		}

		// Loop through all the objects and check for movement
		for(var i in liveBikes)
		{
			var b = liveBikes[i];
			StartUpdateGOPosition(b);
		}

		// Loop through all surviving objects and move to offical grid
		for(var i in liveBikes)
		{
			var b = liveBikes[i];
			EndUpdateGOPosition(b);
		}


	}

	var doCollision = function(objA, onGrid)
	{
		var objB = onGrid[objA.row][objA.col];

		if(objB != EmptyCell) // If there's not an empty cell, process collisions (if any)
		{
			// Let the target know there was a collision with said object
			if(objB.hasOwnProperty('hitBy'))
				objB.hitBy(objA);

			// let the
			if(objA.hasOwnProperty('hits'))
				objA.hits(objB);

			// If the object should still be on the board after the interactions then place it
			if(objA.onBoard)
			{
				// Mark that we are now on the 
				objA.movedLastFrame = true;
				// Save our spot on the grid
				onGrid[objA.row][objA.col] = objA;
			}
		}
		else
		{
			// Mark that we've successfully moved into a new position
			objA.movedLastFrame = true;
			// Move it
			onGrid[objA.row][objA.col] = objA;
		}
	}

	var StartUpdateGOPosition = function(b)
	{
		b.movedLastFrame = false;

		// If the bike has made enough progress to move
		if(b.progress >= threashhold)
		{
			b.prevRow = b.row;
			b.prevCol = b.col;
			b.fromColDirection = b.colDirection;
			b.fromRowDirection = b.rowDirection;

			// keep the progress that exceeded the threshhold
			b.progress = b.progress % threashhold;

			// Place a wall on the previous position. It may trigger 
			if(b.hasOwnProperty('drawWall') && b.drawWall)
				grid[b.row][b.col] = Wall;
			else
				grid[b.row][b.col] = EmptyCell;
			// updateGrid[b.row][b.col] = Wall; //TODO this is just a patch to fix the enemy dies when their wall is hit

			// Move the bike to its new location
			b.row += b.rowDirection;
			b.col += b.colDirection;


			// Returns true if the bike didn't die from being out of bounds
			if(processOutsideBounds(b))
			{
				doCollision(b, updateGrid);

			} //else the object ran out of bounds and died

		} // end threshhold check
	}

	var EndUpdateGOPosition = function(obj)
	{
		if(obj.movedLastFrame && obj.onBoard)
		{
			doCollision(obj, grid);
			updateGrid[obj.row][obj.col] = EmptyCell;
		}
	}

	var CollisionCallback;
	pub.SetCollisionCallback = function(func)
	{
		CollisionCallback = func;
	}

	var collisions = [];
	var ReportCollision = function(row, col, bike)
	{
		CollisionCallback(row, col, bike);
		collisions[collisions.length] = [row, col]; // CLEANUP: Not needed with the callback, but leave it for now
	}

	/// Grabs a list of collisions that happened on the last UpdateObjects
	pub.GetCollisions = function()
	{
		// returns array of (row, column) pairs indicating collision positions
		return collisions;
	}


	// - - - - - - - Helper Methods - - - - - 

	// returns the index of the object in the array or -1 if not found.
	function find(obj, inArray)
	{
		// Search through the array
		for(var i=0; i<inArray.length; i++)
			// if we found the object
			if(inArray[i]==obj)
				return i; //return the index
		// If we did not find the object, return -1
		return -1;
	}


	return pub; // Return an object with a reference to the variables and functions we want to be public
};
var Model = newModel();
