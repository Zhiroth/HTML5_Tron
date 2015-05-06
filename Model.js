
//This follows the Revealing Module Pattern


var newModel = function(){
	var pub = {}; // Add all methods/variables that you want to be public

	// Represents a physical object in the game. Used as follows for inheritance:
	// var pub = Object.create(GameObject); //This means pub inherits from GameObject
	var BoardObject =
	{
		row: 0, 	// current row position
		col: 0,		// current column position
		lastRow: 0,
		lastCol: 0,
		rowDirection: 0,	// current row direction
		colDirection: 0,	// current column direction
		speed: 0, 		// current speed of bike.
		progress: 0,		// how much progress it's made towards moving to the next square
		fromRowDirection: null, // The last row direction we moved in
		fromColDirection: null, // The last col direction we moved in
		solid: false,
		visible: true,
		hitBy: function(obj){}, // "How will YOU react when hit by said obj? Obj will react to you after this function ends."
		updateProgress: function(){}
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

	// - - - - - - - - Power Ups! - - - - - - - - 

	// All properties that are common among power ups and not a Board Object.
	var PowerUp = 
	{
		active: false,
		ticksLeft: 0,
		start: function(){},
		tick: function(){},
		end: function(){}
	}


	pub.PowerUpTypes = {};
	pub.UsingThesePowerUpTypes = {};
	pub.PowerUpsOnBoard = [];
	pub.ActivePowerUps = []; // Array

	// Adds all the power ups types to the game
	pub.AddAllPowerUpTypes = function()
	{

	}

	// Holds properties of a the type of powerup 
	pub.PowerUpTypes.SelfSpeedUp =
	{
		name: "Speed Up",

	}


	pub.NewPowerUp = function(PU_TYPE)
	{
		var pub = {};
		// Get a copy of all properties from BoardObject and PowerUp
		shallowCopy(BoardObject, pub);
		shallowCopy(PowerUp, pub);

		pub.type = PU_TYPE;

		// Return the public methods and variables you can use
		return pub;
	}

	// Automatically creates a new power up, adds it to the game, and returns a reference to it.
	pub.AddNewPowerUp = function(PU_Type)
	{
		// Create new powerup
		var pu = pub.NewPowerUp(PU_TYPE);
		// Add to the game
		PowerUpsOnBoard[PowerUpsOnBoard.length] = pu;
		// Return a reference to it
		return pu;
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

	var outsideBounds;
	var grid;
	var updateGrid;

	var wall = {hitBy:function(){}, solid: true};

	var wrap = function(gameObj)
	{
		//TODO wrap function
		console.log("Wrapping...");
	}
	var noWrap = function(gameObj)
	{
		//TODO noWrap function
		console.log("Not wrapping...");
	}

	var isWrapAllowed = function()
	{
		return outsideBounds==wrap;
	}

	// The function to calc wraping
	var setWrap = function(allow)
	{
		if(allow)
			outsideBounds = wrap;
		else
			outsideBounds = noWrap;
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
				grid[i][j] = {};
				updateGrid[i][j] = {};
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
		

	//todo add Power Up setting methods


	//- - - - - - - - - - - - Bike Methods- - - - - - - - - - - - 

	/// The class that holds information about a specific bike
	pub.BIKE = function()
	{
		this.startRow = null;
		this.startCol = null;
		this.startRowDirection = null;
		this.startColDirection = null;
		this.startSpeed = null; // if null then it will be 10 or whatever you set with “SetBasePlayerSpeed(int)”
		this.row = 0; 	// current row position
		this.col = 0;		// current column position
		this.rowDirection = 0;	// current row direction
		this.colDirection = 0;	// current column direction
		this.speed = 0; 		// current speed of bike.
		this.progress = 0;		// how much progress it's made towards moving to the next square
		this.fromRowDirection = null;
		this.fromColDirection = null;
		this.drawWall = true;

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
			// set the progress to determine how far into the object the bike appears (0-threshhold)
			this.progress = pub.crashImpactPercent * threashhold;

			// look for bike in alive array
			for(var i=0;i<liveBikes.length;i++)
				// If we found the bike
				if(liveBikes[i]==this)
				{
					liveBikes.splice(i, 1);
					break;
				}

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
			this.speed = this.speed += 10;
			//this.drawWall = false;
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

			// TODO remove

			if(b.row >= defaultBoardRows || b.col >= defaultBoardCols || b.row < 0 || b.col < 0)
				throw new Error("Cannot start bike outside of board.");

			grid[b.row][b.col] = b;
		}
	}

	/// Tells the model to do one round of updates
	pub.UpdateObjects = function()
	{
		// Move all objects
		for(var i=0;i<liveBikes.length;i++)
		{
			var b = liveBikes[i];

			UpdateGameObjectProgress(b);


			// If the bike has made enough progress to move
			if(b.progress >= threashhold)
			{
				b.fromColDirection = b.colDirection;
				b.fromRowDirection = b.rowDirection;

				// keep the progress that exceeded the threshhold
				b.progress = b.progress % threashhold;

				// Patch: Require that the player's progress reset to zero so the drawn walls get drawn to the corners.
				//b.progress = 0;

				// Place a wall on the previous position. It may trigger 
				grid[b.row][b.col] = wall;
				updateGrid[b.row][b.col] = wall; //TODO this is just a patch to fix the enemy dies when their wall is hit

				// Move the bike to its new location
				b.row += b.rowDirection;
				b.col += b.colDirection;

				var ud = updateGrid[b.row][b.col];

				if(b.row >= defaultBoardRows || b.col >= defaultBoardCols || b.row < 0 || b.col < 0)
				{
					b.die();
				}
				else if(ud.hasOwnProperty('hitBy')) // Check new spot of bike
				{
					// Let the object know there was a collision with said object
					ud.hitBy(b);

					// If the object is solid, the bike dies
					if(ud.solid)
						b.die();

					//TODO report crash	

				}
				else
				{
					// Move it
					updateGrid[b.row][b.col] = b;
				}
			}
		}

		// Finished moving all objects
		// Switch the grids
		var temp = grid;
		grid = updateGrid;
		updateGrid = temp;
	}

	var UpdateGameObjectProgress = function(go)
	{
		// If the bike has no direction then don't move it
		if(go.rowDirection != 0 || go.colDirection != 0 )
			go.progress += go.speed; // Update the bike's progress
	}

	/// Grabs a list of collisions that happened on the last UpdateObjects
	pub.GetCollisions = function()
	{

		// returns array of (row, column) pairs indicating collision positions
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
