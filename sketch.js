// created by Aadi Golecha On 15 jan 2022
//City Runner Game (Commented)

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
var engine, world

/* 
when the game is in gamemode "0" there is a click to continue screen to start the game and this Default gamemode
when the gamemode is between "1 to 45" it is the normal playing mode
gamemode is "50" when the playing character hits any Obstacle
gamemode is "100" when the player loses all three hearts and this is gameover state
*/
var gameMode = 0;

//distance is about how much the player has move this keeps increasing according to the speed of the player
var distance = 0;

//boost the like the stamina and if we use it all up our health will decrease
var boost = 200;

//life is the player's health
var life = 200;

//when the player's life is very low he loses a heart and if he loses all hearts "game over"
var heart = 3;

//other than distance the game have score 
var score = 0;

var backGround, backGroundImg, backGroundMusic;
var ground, roof;
var dog, dog_walk, dog_jump, dog_dead, dog_idle, dog_run, dog_blinking;
var cone, cone1Img, cone2Img, cone3Img, cone4Img;
var bird, bird1Img, bird2Img;
var coneGroup, birdGroup;
var coins;
var  bone, energy;
var coinImg, boneImg, energyImg;
var coinGroup, boneGroup, energyGroup;
var boostIcon, lifeIcon;;
var gameOverImg;

function preload()
{
  //it is the image that run in the game background
  backGroundImg = loadImage("./assets/background.png");

  //this image appears as click to contnue screen
  intro = loadImage("./assets/intro.png");

  //this image is shown when the gamemode is 100
  gameOverImg = loadImage("./assets/gameOver.png");

  //loading all cone Obstacle images
  cone1Img = loadImage("./assets/cone1.png");
  cone2Img = loadImage("./assets/cone2.png");
  cone3Img = loadImage("./assets/cone3.png");
  cone4Img = loadImage("./assets/cone4.png");

  //loading all colltectable things images
  coinImg = loadImage("./assets/coin.png");
  boneImg = loadImage("./assets/bone.png");
  energyImg  = loadImage("./assets/energy.png");

  //loading health and stamina icons
  boostIcon = loadImage("./assets/energyIcon.png");
  lifeIcon = loadImage("./assets/lifeIcon.png");

  //loading animations for the two types of birds (Obstacle)
  bird1Img = loadAnimation("./assets/bird1/bird1.png","./assets/bird1/bird2.png","./assets/bird1/bird3.png","./assets/bird1/bird4.png","./assets/bird1/bird5.png","./assets/bird1/bird6.png","./assets/bird1/bird7.png","./assets/bird1/bird8.png","./assets/bird1/bird9.png");
  bird2Img = loadAnimation("./assets/bird2/bird1.png","./assets/bird2/bird2.png","./assets/bird2/bird3.png","./assets/bird2/bird4.png","./assets/bird2/bird5.png","./assets/bird2/bird6.png","./assets/bird2/bird7.png","./assets/bird2/bird8.png","./assets/bird2/bird9.png");

  //loading all dog animations
  dog_walk = loadAnimation("./assets/dog/Walk/Walk (1).png","./assets/dog/Walk/Walk (2).png","./assets/dog/Walk/Walk (3).png","./assets/dog/Walk/Walk (4).png","./assets/dog/Walk/Walk (5).png","./assets/dog/Walk/Walk (6).png","./assets/dog/Walk/Walk (7).png","./assets/dog/Walk/Walk (8).png","./assets/dog/Walk/Walk (9).png","./assets/dog/Walk/Walk (10).png");
  dog_jump = loadAnimation("./assets/dog/Jump/Jump(1).png","./assets/dog/Jump/Jump(2).png","./assets/dog/Jump/Jump(3).png","./assets/dog/Jump/Jump(4).png","./assets/dog/Jump/Jump(10).png","./assets/dog/Jump/Jump(11).png","./assets/dog/Jump/Jump(12).png");
  dog_dead = loadAnimation("./assets/dog/Dead/Dead(1).png","./assets/dog/Dead/Dead(2).png","./assets/dog/Dead/Dead(3).png","./assets/dog/Dead/Dead(4).png","./assets/dog/Dead/Dead(5).png","./assets/dog/Dead/Dead(6).png","./assets/dog/Dead/Dead(7).png","./assets/dog/Dead/Dead(8).png","./assets/dog/Dead/Dead(9).png","./assets/dog/Dead/Dead(10).png");
  dog_idle = loadAnimation("./assets/dog/idle/Idle(1).png","./assets/dog/idle/Idle(2).png","./assets/dog/idle/Idle(3).png","./assets/dog/idle/Idle(4).png","./assets/dog/idle/Idle(5).png","./assets/dog/idle/Idle(6).png","./assets/dog/idle/Idle(7).png","./assets/dog/idle/Idle(8).png","./assets/dog/idle/Idle(9).png","./assets/dog/idle/Idle(10).png");
  dog_run = loadAnimation("./assets/dog/Run/Run(1).png","./assets/dog/Run/Run(2).png","./assets/dog/Run/Run(3).png","./assets/dog/Run/Run(4).png","./assets/dog/Run/Run(5).png","./assets/dog/Run/Run(6).png","./assets/dog/Run/Run(7).png","./assets/dog/Run/Run(8).png");
  dog_blinking = loadAnimation("./assets/dog/Blinking/Walk (1).png","./assets/dog/Blinking/Walk (2).png","./assets/dog/Blinking/Walk (3).png","./assets/dog/Blinking/Walk (4).png","./assets/dog/Blinking/Walk (5).png","./assets/dog/Blinking/Walk (6).png","./assets/dog/Blinking/Walk (7).png","./assets/dog/Blinking/Walk (8).png","./assets/dog/Blinking/Walk (9).png","./assets/dog/Blinking/Walk (10).png");

  //music in background to keep user intersted
  backGroundMusic = loadSound("./assets/backgroundMusic.mp3");
}

function setup() 
{
  createCanvas(1440, 700);
  engine = Engine.create();
  world = engine.world;

  //this is the moving city road  
  backGround = createSprite(width + 80, height/2, width, height);
  backGround.addImage(backGroundImg);
  backGround.scale = 1.1;
  backGround.velocityX = -5;

  //sprites to limit the player's movement 
  ground = createSprite(width/2,height-100,width,20);
  ground.visible = false;
  roof = createSprite(width/2,370,width,20);
  roof.visible = false;

  //main character as dog with custom collider and gravity 
  dog = createSprite(width/9, 517);
  dog.scale = 0.3;
  dog.velocityY = 2;
  dog.setCollider("rectangle",-20,0,280,400)
  
  //animation for the dog
  dog.addAnimation("walking", dog_walk);
  dog.addAnimation("running", dog_run);
  dog.addAnimation("standing", dog_idle);
  dog.addAnimation("dying", dog_dead);
  dog.addAnimation("jumping", dog_jump);
  dog.addAnimation("blinking", dog_blinking);

  //debug to see the collider (you may comment it)
  //dog.debug = true;

  //creating groups to handle the Obstacles and collectables
  coneGroup = createGroup();
  birdGroup = createGroup();
  coinGroup = createGroup();
  boneGroup = createGroup();
  energyGroup = createGroup();

  //playing light music
  backGroundMusic.play();
  backGroundMusic.setVolume(0.5);
}

function draw() 
{
  //setting a distant color background 
  background(255,25,255);  
  Engine.update(engine);
  drawSprites();

  //limiting the player's movement
  dog.collide(ground);
  dog.collide(roof);

  //moving the background towards the player to give a effect of moving player
  if(backGround.x < 0)
  {
    backGround.x = width + 100;
  }
  
  // code to make a "click to continue" screen
  if(gameMode < 1) 
  {
    imageMode(CENTER);
    image(intro,width/2,height/2,width,height);
    backGround.visible = false;
    dog.changeAnimation("standing");
  }

  //play mode
  if(gameMode > 0 && gameMode < 50)
  {
    //making the background visible to see the city road moving
    backGround.visible = true;

    // incrementing the distance according to the players speed
    if(frameCount%20 === 0 && backGround.velocityX === -5)
    {
      distance = distance + Math.round(getFrameRate()/40);
    }else if(frameCount%5 === 0 && backGround.velocityX === -10)
    {
      distance = distance + Math.round(getFrameRate()/40);
    }
   
    // showing the distance covered as a text
    fill("orange");
    textSize(width/25);
    text(distance + " : Distance Covered",100,100);

    //calling movement function inside if condition to only allow the player to move when gamemode is play
    movement();

    //calling these three functions to show stamin bar, health bar, and hearts.
    energyF();
    lifeF();
    heartF();

    //spawning Energy bottle and Bird Obstacle after a cretain delay
    if(frameCount % 500 === 0)
    {
      spawnEnergyDrink();
      spawnBird();
    }

    //spawning Bone (increases health) and Cone Obstacle after a cretain delay
    if(frameCount % 200 === 0)
    {
      spawnCone();
      spawnBone();
    }

    //this code is incomplete
    if(frameCount % 20 === 0 )
    {
      spawnCoins();
    }
    if(coinGroup.isTouching(dog))
    {
      coinGroup.destroyEach();
    }

    //if the bone is touching dog, its health will increase by 50
    if(boneGroup.isTouching(dog))
    {
      boneGroup.destroyEach();

      if(life < 151)
      {
        life += 50
      } else
      {
        life = 200;
      }
    }

     //if the energy is touching dog, its stamina will increase to full
    if(energyGroup.isTouching(dog))
    {
      energyGroup.destroyEach();
      boost = 200;
    }

    //if the dog is touching any Obstacles, next lines of code runs
    if(birdGroup.isTouching(dog) || coneGroup.isTouching(dog))
    {
      gameMode = 50;
    }

    if(gameMode === 50)
    {
      if(life > 25)
      {
        life -= 50;
      }

      dog.changeAnimation("blinking");

      coinGroup.destroyEach();
      boneGroup.destroyEach();
      energyGroup.destroyEach(); 
      birdGroup.destroyEach();
      coneGroup.destroyEach();

      setTimeout(() => {
        dog.changeAnimation("walking");
        gameMode = 2;
      }, 1200);

    }

  }

  //if stamina(boost) is very low health will decrease
  if(boost < 3 && life > 0)
  {
    life -= 0.5;
  }

  //
  if(life < 1)
  {
    dog.changeAnimation("blinking");
    backGround.velocityX = 0;
    coinGroup.destroyEach();
    boneGroup.destroyEach();
    energyGroup.destroyEach(); 
    birdGroup.destroyEach();
    coneGroup.destroyEach();
    
      
    setTimeout(timeKeeper(), 1000);
    
  }

  if(gameMode === 100)
  {
    setTimeout(() => {
      dog.changeAnimation("standing");
      boost = 200;
      life = 200;
    }, 1200);
  }

}

function keyPressed()
{
  if(gameMode < 1) 
  {
    gameMode += 1;
  }
}

function spawnCone()
{
  cone = createSprite(width + 20,height-130);
  cone.scale = 0.3;
  cone.lifetime = 500;
  cone.velocityX = -5;
  cone.debug = true;
  cone.setCollider("rectangle",0,0,150,200)

  var x = Math.round(random(1,4));
  if (x == 1) {
    cone.addImage(cone1Img);
  } else if (x == 2) {
    cone.addImage(cone2Img);
  }else if (x == 3) {
    cone.addImage(cone3Img);
  }else if (x == 4) {
    cone.addImage(cone4Img);
  }
  coneGroup.add(cone);
}

function spawnBird()
{
  bird = createSprite(width + 300,height-300);
  bird.scale = 0.05;
  bird.lifetime = 500;
  bird.velocityX = -5;
  bird.addAnimation("blue",bird1Img);
  bird.addAnimation("green",bird2Img);
  bird.debug = true;
  bird.setCollider("circle",0,0,600)

  var x = Math.round(random(1,2));
  if (x == 1) {
    bird.changeAnimation("blue");
  } else if (x == 2) {
    bird.changeAnimation("green");
  }
  birdGroup.add(bird);
}

function movement()
{
  dog.velocityY = 5;
  
  if(keyIsDown("32"))
  {
    console.log("space key pressed");
    dog.changeAnimation("jumping");
    dog.y -= 10;

    if(backGround.velocityX === -10 &&  boost > 2)
    {
      boost -= 1;
    }

  }else if(keyIsDown("17") &&  boost > 2)
  {
    backGround.velocityX = -10;
    dog.changeAnimation("running");
    coneGroup.setVelocityXEach(-10);
    energyGroup.setVelocityXEach(-10);
    coinGroup.setVelocityXEach(-10);
    boneGroup.setVelocityXEach(-10);
    birdGroup.setVelocityXEach(-10);

    boost -= 1;
  }else{
    backGround.velocityX = -5;
    dog.changeAnimation("walking");
    coneGroup.setVelocityXEach(-5);
    energyGroup.setVelocityXEach(-5);
    coinGroup.setVelocityXEach(-5);
    boneGroup.setVelocityXEach(-5);
    birdGroup.setVelocityXEach(-5);

    boost = boost;
  }

}

function spawnCoins()
{
  coin = createSprite(width +500, 500)
  coin.lifetime = 500;
  coin.velocityX = -5;
  coin.addImage(coinImg);
  coin.scale = 0.2

  coinGroup.add(coin);

}

function spawnBone()
{
  bone = createSprite(width +50, 500)
  bone.lifetime = 500;
  bone.velocityX = -5;
  bone.addImage(boneImg);
  bone.scale = 0.2

  boneGroup.add(bone);
}

function spawnEnergyDrink()
{
  energy = createSprite(width +100, 500)
  energy.lifetime = 500;
  energy.velocityX = -5;
  energy.addImage(energyImg);
  energy.scale = 0.2

  energyGroup.add(energy);
}
  
function energyF()
{
  image(boostIcon,width/9 - 120, 350,30,35);

  fill("white");
  rect(width/9 - 80, 350,200,25);

  fill("#ffcb04");
  rect(width/9 - 80, 350,boost,25);
}

function lifeF()
{
  image(lifeIcon,width/9 - 120, 320,35,30);

  fill("white");
  rect(width/9 - 80, 320,200,25);

  fill("red");
  rect(width/9 - 80, 320,life,25);
}

function heartF()
{
  if(heart === 3)
  {
    image(lifeIcon,700,50,50,50);
    image(lifeIcon,760,50,50,50);
    image(lifeIcon,820,50,50,50);
  }

  if(heart === 2)
  {
    image(lifeIcon,700,50,50,50);
    image(lifeIcon,760,50,50,50);
  }

  if(heart === 1)
  {
    image(lifeIcon,700,50,50,50);
  }
}

function timeKeeper()
{
  heart -=1;
  console.log("heart = " + heart);
  boost = 200;
  console.log("life = " + life);
  life = 200;
}