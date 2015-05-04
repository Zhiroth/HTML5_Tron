
var ModelUnitTests = (function(){
	var pub = {}; // Add all methods/variables that you want to be public
	tests = {};
	pub.tests = tests; // Contains references to all tests that can be run


	var _logfile = "";
	var _logTab = "";
	var _logTabSize = 2;
	var _logTabLevel = 0; // Number of "Tabs" there are
	// Returns the current log file
	pub.getLog = function()
	{
		return _logfile;
	}
	// Adds to the log file (without a new line) 
	pub.log = function(toLog)
	{
		_logfile += toLog.replace(/\n/g, '\n'+_logTab);
	}
	// Adds to the log file with a new line
	pub.logl = function(toLog)
	{
		pub.log(toLog+="\n");
	}
	// Adds to the right side of a prefix
	pub.addLogTabLevel = function()
	{
		for(i=0;i<_logTabSize;i++)
			_logTab += " ";
		_logTabLevel++;
		return _logTabLevel;
	}
	// Removes a level of the tab size
	pub.removeLogTabLevel = function()
	{
		if(_logTab.length>=_logTabSize)
		{
			_logTab = _logTab.substring(0, _logTab.length - _logTabSize);
			_logTabLevel--;
		}
	}
	// Resets the tab level
	pub.setLogTabLevel = function(level)
	{
		var size = _logTabSize * level;
		_logTab = "";
		for(i=0;i<size;i++)
			_logTab += " ";
		_logTabLevel = level;
	}
	// Clears the log file
	pub.clearLog = function()
	{
		_logfile = "";
	}

	//- - - - - Control - - - - - -

	pub.runAll = function()
	{
		console.group("-- Running all Unit Tests --");
		for(testName in pub.tests)
		{
			var level = pub.addLogTabLevel();
			// Run the test
			var result = pub.tests[testName]();
			// Reset the log level
			pub.setLogTabLevel(level-1);

			console.log("Test: "+testName+"... Done.");
		}
		console.groupEnd();
	}

	// - - - - - TESTS - - - - - -

	tests.addAndKillBikes1 = function()
	{
		var model = newModel();
		var a = new model.BIKE();
		var b = new model.BIKE();
		a.extra.name = "A";
		b.extra.name = "B";

		model.AddBike(a);
		model.AddBike(new model.BIKE());
		model.AddBike(b);
		model.AddBike(new model.BIKE());

		var live = model.GetLiveBikes();
		if(live.length!=4)
			throw new Error("Expected 4 live bikes, but found "+live.length);

		 if(live[0].extra.name!="A")
		 	throw new Error("Expected 'A' to be at [0] but it was not.");

		 if(live[2].extra.name!="B")
		 	throw new Error("Expected 'B' to be at [2] but it was not.");

		 a.die();

		var live = model.GetLiveBikes();
		if(live.length!=3)
			throw new Error("Expected 3 live bikes, but found "+live.length);

		 if(live[0].extra.name=="A")
		 	throw new Error("Expected 'A' to be deleted from [0] but it was not.");

		 if(live[1].extra.name!="B")
		 	throw new Error("Expected 'B' to be at [1] but it was not.");

		b.die();

		var live = model.GetLiveBikes();
		if(live.length!=2)
			throw new Error("Expected 2 live bikes, but found "+live.length);

		for(var l in live)
			 if(live[l].extra.name=="B")
			 	throw new Error("Expected 'B' to be deleted from array but it was not.");
	}

	//- - - - END OF TESTS - - - - 

	function strip(html)
	{
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	function recursivePrintObject(obj)
	{
		return _recursivePrintObject(obj, "");
	}

	function _recursivePrintObject(obj, padding)
	{
		var o = "";
		for(var i in obj)
		{
			var value = obj[i];
			
			// If the value is an object then recursively print that
			if(value !== null)
			{
				if(typeof value === 'object')
					value = "[Object]:<br/>"+_recursivePrintObject(obj[i], padding+"&nbsp;&nbsp;&nbsp;&nbsp;");
				else if(typeof value === "function")
					value = "(function)";
			}

			if(i=="isAlive")
				value = obj[i]();

			// Report the output
			o += sprintf("%s%s: %s<br/>", padding, i, value);
		}
		return o;
	}

	// General testing area
	pub.AddStep = function()
	{
		var format = sprintf;

		window.onload = function()
		{
			var model = Model; //can be changed to newModel()

		    var div = document.createElement("div");
		    div.setAttribute("style","padding: 1em;");
		    var button = document.createElement("input");
		    button.type = "button";
		    button.value = "Update";
		    button.onclick = function()
		    {
		    	// Do an update
		    	model.UpdateObjects();

		    	// Output the stats
		    	var o = "";
		    	var bikes = model.getBikes();
		    	// Loop through each of the bikes and give them a special display
		    	for(var i in bikes)
	    			o += format("<fieldset style=\"display: inline-block; vertical-align: top;\"><legend>bikes[%s]:</legend>%s</fieldset>", i, recursivePrintObject(bikes[i]));

		    	// Show the output
		    	div.innerHTML = o;
		    };
		    document.body.appendChild(button);
		    document.body.appendChild(div);
		    button.onclick();
		}
	}

	pub.Test = function()
	{

	}

	return pub; // Return an object with a reference to the variables and functions we want to be public
}());


//-------- Testing area ------------

// var b = new Model.BIKE();
// b.extra.name = "My Bike";

// Model.AddBike(new Model.BIKE());
// Model.AddBike(new Model.BIKE());
// Model.AddBike(b);
// Model.AddBike(new Model.BIKE());

// b.die();

// console.log(Model.GetLiveBikes());

var b1 = new Model.BIKE();
b1.startRow = 0;
b1.startCol = 0;
b1.startRowDirection = 0;
b1.startColDirection = 1;
b1.extra.name = "Bob";
b1.extra.name1 = "Bob";
b1.extra.name2 = "Bob";

Model.AddBike(b1);
Model.AddBike(new Model.BIKE());
Model.AddBike(new Model.BIKE());
Model.AddBike(new Model.BIKE());

//Model.StartGame();

//----------------------------------
var date = new Date();
console.log("--- Model JS Finished "+date.getHours()+":"+date.getMinutes()+"."+date.getSeconds()+"---");

//ModelUnitTests.runAll();
Model.SetBasePlayerSpeed(100);
Model.StartGame();
ModelUnitTests.AddStep();
