var w = 800;
var h = 512;
var game = new Phaser.Game(w, h, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var timer; var timerText;
var player; var q1; var q2; var finish; var background; var barrier; var map;
var q1asked = false; var q2asked = false; finished = false;
var score = 0;

var playerBodyScaleX = 0.6;	// resize player hitbox width
var playerBodyScaleY = 1; // resize player hitbox height

// QUESTION LOCATIONS
var q1x = 1220;
var q2x = 2650;

///// CAR VARIABLES

var cars; // car group
var car; // current car instance

var carTimer = 0; // unlink car creation from score counter

var carBodyScaleX = 0.8;		// resize car hitbox width
var carBodyScaleY = 1;	// resize car hitbox height

// assign velocity, interval (in whole seconds), and group to each car type
// 0 = texture atlas, 1 = image, 2 = animated spritesheet
// also manually insert image heights and widths to simplify future life
var carTypes = {'ambulance': {velocity: 250, interval: 27, group: 2, h: 104, w: 51},
				'audi': {velocity: 120, interval: 4, group: 0, h: 107, w: 49},
				'bus': {velocity: 30, interval: 13, group: 1, h: 193, w: 60},
				'car': {velocity: 100, interval: 5, group: 0, h: 109, w: 46},
				'pickup': {velocity: 80, interval: 5, group: 0, h: 102, w: 56},
				'police': {velocity: 250, interval: 41, group: 2, h: 107, w: 49},
				'taxi': {velocity: 160, interval: 3, group: 0, h: 112, w: 57},
				'truck': {velocity: 10, interval: 29, group: 1, h: 185, w: 58},
				'van': {velocity: 60, interval: 6, group: 0, h: 98, w: 47},
				'viper': {velocity: 180, interval: 3, group: 0, h: 110, w: 54}};

// car slots based on current map, DO NOT MODIFY unless map changed
var carSlotX = [225, 290, 385, 480, 545, 640, 735, 800, 895, 990, 1055,
    			1665, 1730, 1825, 1920, 1985, 2080, 2175, 2240, 2335, 2430, 2495,
				3075, 3140, 3235, 3330, 3395, 3490, 3585, 3670, 3745, 3840, 3905];

// assign one car type to each slot
var carSlotType = ['truck', 'bus', 'ambulance', 'van', 'pickup', 'police', 'car', 'taxi', 'ambulance', 'audi', 'viper',
    				'bus', 'pickup', 'police', 'car', 'audi', 'ambulance', 'viper', 'taxi', 'police', 'van', 'truck',
    				'viper', 'audi', 'ambulance', 'car', 'taxi', 'police', 'pickup', 'van', 'ambulance', 'bus', 'truck'];

// assign direction of movement to each slot, MUST BE 1 (down) or -1 (up)
var carSlotVector = [1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1,
    	    			1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1,
    					-1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1];

var slots = carSlotX.length; // number of slots


///// CAR FUNCTIONS

function initiateCars() {

	cars = game.add.group();
	cars.enableBody = true;

	for (i = 0; i < slots; i++) {

		carType = carSlotType[i];
		hCar = carTypes[carType].h;
		interval = carTypes[carType].interval;
		velocity = carTypes[carType].velocity;
		spacing = interval * velocity;

		if (carSlotVector[i] == 1) {
			y = -hCar;
			while(y < h) {
				createCar(i, y);
				y += spacing;
			} 
		} else {
			y = h + hCar;
			while(y > 0) {
				createCar(i, y);
				y -= spacing;
			}
		}
	}
}

function updateCars() {
	carTimer++;
	for (i = 0; i < slots; i++) {

		carType = carSlotType[i];

		if((carTimer % carTypes[carType].interval) == 0) {
			if(carSlotVector[i] == 1){
				y = -carTypes[carType].h
			} else {
				y = h + carTypes[carType].h;
			}
			createCar(i, y);
		}
	}
}

function createCar(i, y) {
	carType = carSlotType[i];
	group = carTypes[carType].group;
	vector = carSlotVector[i];
	x = carSlotX[i];

	switch(group) {
		case 0:
			car = cars.create(x, y, 'cars', carType);
			break;
		case 1:
			car = cars.create(x, y, carType);
			break;
		case 2:
			car = cars.create(x, y, carType);
			car.animations.add('lights', [1,3]);
			car.animations.play('lights', 5, true);
			break;
	}

	car.anchor.setTo(0.5, 0.5);
	car.scale.setTo(vector, vector);
	car.body.velocity.y = vector * carTypes[carType].velocity;

	car.body.width = carBodyScaleX * carTypes[carType].w;
	car.body.height = carBodyScaleY * carTypes[carType].h;
}

function destroyCar(car){
	buffer = +200;
	y = car.y;
	if(y > (h + buffer) || y < -buffer){
		car.kill();
	}
}

function hitByCar(){
	if(q2asked) {player.body.x = q2x;}
	else if(q1asked) {player.body.x = q1x;}
	else {player.body.x = 0;}
	player.body.y = h/2;
}

///// PRELOAD

function preload() {
    game.load.tilemap('tilemap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('roadTiles', 'models/roads/preview.jpg');
    game.load.image('grassTiles', 'models/roads/grass.png');
    game.load.spritesheet('student', 'assets/student.png', 50, 50);
    game.load.image('answeroption', 'assets/question_backdrop.jpg');
    game.load.image('norman', 'assets/nr-cone.jpg');
    game.load.image('ming', 'assets/ming.jpg');
    game.load.spritesheet('event', 'assets/event.png', 30, 512);
    game.load.image('dewick', 'assets/dewick.jpg');

    // LOAD CARS
    game.load.spritesheet('ambulance', 'assets/ambulance.png', 51, 104);
    game.load.spritesheet('police', 'assets/police.png', 49, 107);
    game.load.atlasXML('cars', 'assets/cars.png', 'assets/cars.xml');
    game.load.image('bus', 'assets/bus.png');
    game.load.image('truck', 'assets/truck.png');
}


///// CREATE

function create() {
    //  We're going to be using physics, BUT WE MAY CHANGE TO BOX2D
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //  Background 
    map = game.add.tilemap('tilemap');
    map.addTilesetImage('road', 'roadTiles');
    map.addTilesetImage('grass', 'grassTiles');
    
    // create background, add collisions
    barrier = map.createLayer('Barrier');
    background = map.createLayer('Background')
    barrier.resizeWorld();
    
    map.setCollisionBetween(1, 100, true, 'Barrier');
    
    // The player and its settings
    player = game.add.sprite(0, h/2, 'student');
    q1     = game.add.sprite(q1x, 0, 'event');
    q2     = game.add.sprite(q2x, 0, 'event');
    finish = game.add.sprite(4080, 0, 'event');

    dewick = game.add.sprite(4120, 64, 'dewick');
    dewick.scale.setTo(.57, .57);

    q2.alpha = 0;
    q1.alpha = 0;
    finish.alpha = 0;
    
    player.animations.add('rwalk', [0,1]);
    player.animations.add('lwalk', [2,3]);
    player.animations.add('celebrate', [4,5]);
    
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(q1);
    game.physics.arcade.enable(q2);
    game.physics.arcade.enable(finish);

    // RESIZE PLAYER HITBOX
    player.anchor.setTo(0.5, 0.5);
    player.body.width = player.width * playerBodyScaleX;
    player.body.height = player.height * playerBodyScaleY;
    
    //  Player physics properties.
    player.body.collideWorldBounds = true;
    game.camera.follow(player);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    //  Create our Timer
    timer = game.time.create(false);
    
    //  Set a TimerEvent to occur after 1 seconds
    timer.loop(1000, updateScore, this);
    
    timerText = game.add.text(
	16, 16, 'Time: 0',
	{ fontSize: '32px', fill: '#000', fixedToCamera : true});
    
    timerText.fixedToCamera = true;
    timerText.cameraOffset.setTo(16, 16);

    initiateCars();
    timer.loop(1000, updateCars, this);

    timer.start();
}

function updateScore(){
    score++;
    timerText.text = "Time: " + score;
}

function endGame(){
    // Print "Game Over! \n High Scores"
    var style = { font: "50px Arial", fill: "#ffffff", align: "center" };
    var text = "Game Over!\n High scores:";
    t = game.add.text(game.world.centerX-150, game.world.centerY-400,
                      text, style);
    t.fixedToCamera = true;
    t.cameraOffset.setTo(220, 70);
    game.camera.follow(null);
    
    style = { font: "25px Arial", fill: "#ffffff", align: "center" };
    
    // Send XMLHttpRequest to database with current user info
    // and retrieve the top 10 high scores
    loadData(function(responseText) {
        var data = JSON.parse(responseText).data;
        // Print each instance of high score
        for (var i = 0; i < data.length; i++) {
            text = (i+1) + ". " + data[i].username + " " +
            data[i].email + " " + data[i].score + "\n";
            t = game.add.text(game.world.centerX-150,
                          game.world.centerY-90+i*25, text, style);
            t.fixedToCamera = true;
            t.cameraOffset.setTo(200, 200+i*30);
            game.camera.follow(null);
        }
    });
}
// Send an XMLHttpRequest to database w/ current user info.
// Calls callback function with the results
// TODO: perhaps a better way to get user info than "prompt"?
//        (kind of annoying)
function loadData(callback) {
    var request = new XMLHttpRequest();
    var myurl = "http://localhost:3000/submit";
    var username = prompt("Please enter your username", "");
    var email = prompt("Please enter your email",
                "example01@tufts.edu");
    
    // Validate email with regex
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    while (! re.test(email)) {
    email = prompt("Please re-enter your email",
                "example01@tufts.edu");

    }
     
    var params = "username=" + username + "&email=" + email +
        	"&score=" + score;
     
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200){
            if (typeof callback === 'function') {
                callback(request.responseText);
            }
        }
    }
     
    request.open('POST', myurl, true);
    request.setRequestHeader("Content-type",
                  "application/x-www-form-urlencoded");
    request.send(params);
}
 
function askQ1(p, q){
    if (q1asked == false ){
        q1asked = true;
        q      = 'I have a question for you! \nIn impcore operational semantics, \nwhat kind of environment does \nphi represent?';
        wrong1 = 'Global Variable';
        wrong2 = 'Formal Variable';
        right  = 'Function';
        askQuestion(q, wrong1, wrong2, right, 'norman');
    }
}

function askQ2(p, q){
    if (q2asked == false) {
        q2asked = true;
        q      = "Mwahaha I've got a good question!\nWhen making server-side code \nwhen is it a good idea to trust \nuser input?";
        wrong1 = "Always! It's safe!";
        wrong2 = "Sometimes - its not very serious";
        right  = 'Never!';
        askQuestion(q, wrong1, wrong2, right, 'ming');
    }
}

function pausePlayer(){
	player.body.moves = false;
    game.camera.follow(null);
}

function unPausePlayer(){
	player.body.moves = true;
    game.camera.follow(player);
}

function askQuestion(quest, wr1, wr2, right, prof){
    // stop the game timer and player movement
    pausePlayer();

    var menu = game.add.sprite(game.camera.x + 3*(game.camera.width) / 4, h/2, 'answeroption');
    menu.scale.setTo(1.71,1.71);

    menu.anchor.setTo(0.5, 0.5);

    var prof = game.add.sprite(game.camera.x + 70, 197, prof);
    prof.anchor.setTo(0.5,0.5);



    var introText = game.add.text(game.camera.x + 3*(game.camera.width) / 4, 130, quest, {font:'24px Arial', fill:'#000'});
    introText.anchor.setTo(.5, .5);

    var wrong1 = game.add.text(game.camera.x + 1*(game.camera.width) / 2 + 15, 240, wr1, {font:'24px Arial', fill:'#000'});
    wrong1.inputEnabled = true;
    wrong1.events.onInputDown.add(function(){wrongAnswer(introText)});

    var wrong2 = game.add.text(game.camera.x + 1*(game.camera.width) / 2 +15, 300, wr2, {font:'24px Arial', fill:'#000'});
    wrong2.inputEnabled = true;
    wrong2.events.onInputDown.add(function(){wrongAnswer(introText)});

    var rightAns = game.add.text(game.camera.x + 1*(game.camera.width) / 2 + 15, 360, right, {font:'24px Arial', fill:'#000'});
    rightAns.inputEnabled = true;
    rightAns.events.onInputDown.add(function(){
        introText.alpha = 0;
        menu.alpha = 0;
        prof.alpha = 0;
        wrong1.alpha = 0;
        wrong2.alpha = 0;
        rightAns.alpha = 0;
        unPausePlayer();
    });
}

function wrongAnswer(text1){
    text1.text = "Wrong! Let's try again!";
}

function winGame(){
    if(finished == false){
        finished = true;
        endGame();
    }
}

function update() {
    // check for collisions
    game.physics.arcade.collide(player, barrier);

    game.physics.arcade.overlap(player, q1, function(){askQ1(player, q1);}, null, this);
    game.physics.arcade.overlap(player, q2, function(){askQ2(player, q2);}, null, this);
 
    game.physics.arcade.overlap(player, finish, winGame, null, this);

    // CHECK IF HIT BY CAR
     game.physics.arcade.overlap(player, cars, hitByCar, null, this);
    
    
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (cursors.left.isDown)
	{
	    //  Move to the left
	    player.body.velocity.x = -150;
	    player.animations.play('lwalk', 5, true);
	}
    else if (cursors.right.isDown)
	{
	    //  Move to the right
	    player.body.velocity.x = 150;
	    player.animations.play('rwalk', 5, true);
	}
    else if (cursors.up.isDown)
	{
	    // Move up
	    player.body.velocity.y = -150;
	}
    else if (cursors.down.isDown)
	{
	    // Move down
	    player.body.velocity.y = 150;
	}
    else{
	player.animations.stop();
    }

    // DESTORY OFF SCREEN CARS
    cars.forEach(destroyCar, this);
}