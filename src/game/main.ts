// import { AUTO, Game } from "phaser";
import Phaser, { Game } from "phaser";
import { Snow } from "./Snow.js";
import { EventBus } from "./EventBus.js";

// const GAME_PLAY_TIME = 30000; // 30 seconds
const GAME_PLAY_TIME = 5000; // 10 seconds
const GAME_WIDTH = 365;
const GAME_HEIGHT = 600;

// game objects & images
let player;
let rudolph;
let stars;
let bombs;
let platforms;

// Inputs
let leftKey;
let rightKey;

// let infoContainer;
let score = 0;
let scoreText;
// let axisInfo;

let remainingTimeText;
let gameTimer;
let gameOver = false;
let starSpawnId = null;
let bombSpawnId = null;
const earnedItems = new Set();
let earnedItemsSize = 0;

function generateRandomInteger(min: number, max: number) {
  return min + Math.floor(Math.random() * max);
}

function collectStar(player, star) {
  star.disableBody(true, true);

  player.preFX.addGlow(0x00b90c); // green
  setTimeout(() => player.preFX.clear(), 500);
  score += 10;
  scoreText.setText("Score: " + score);

  earnedItems.add("star");
}

function itemHitsPlatform(platforms, item) {
  item.disableBody(true, true);
}

function bombHitsPlayer(player, bomb) {
  score -= 5;
  scoreText.setText("Score: " + score);
  bomb.disableBody(true, true);
  player.preFX.addGlow(0xff0000); // red
  setTimeout(() => player.preFX.clear(), 500);

  earnedItems.add("bomb");
}

function spawnStar(x) {
  // gameObject.setRandomPosition
  let star = stars.create(x, 16, "star");
  star.setCollideWorldBounds(true);

  const DROP_SPEED = 100;
  star.setVelocity(0, DROP_SPEED);
}

function spwanBomb(x) {
  let bomb = bombs.create(x, 16, "bomb");
  // bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);

  const DROP_SPEED = 100; // bigger the value, faster drop
  bomb.setVelocity(0, DROP_SPEED);
}

function handleGameOver() {
  player.stop();
  gameTimer.destroy();
  console.log(this.scene, "#####SCENE");
  remainingTimeText.setText("Remaining time: 0s");

  gameOver = true;
}

function startTimer() {
  gameTimer = this.time.addEvent({
    delay: GAME_PLAY_TIME, // ms
    callback: handleGameOver,
    //args: [],
    // callbackScope: thisArg,
  });
}

function handleLeftKeydown() {
  player.setVelocityX(-400);
  player.anims.play("left", true);
}

function handleRightKeydown() {
  player.setVelocityX(400);
  player.anims.play("right", true);
}

function setPlayerToNeutral() {
  player.setVelocityX(0);

  player.anims.play("turn");
}

function preload() {
  this.load.image("background", "assets/christmas-bg.jpg");
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  //   this.load.image("star", "assets/items/1f384.svg");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet("rudolph", "assets/rudolph-v2.png", {
    frameWidth: 64,
    frameHeight: 92,
  });
}

function create() {
  // this.add.image(400, 300, "sky");
  this.make.image({
    x: 182,
    y: GAME_HEIGHT / 2 - 10,
    key: "background",
    scale: { x: 1.2, y: 1.2 },
  });

  platforms = this.physics.add.staticGroup();

  // platforms.create(400, 568, "ground").setScale(2).refreshBody();
  // platforms.create(400, 568, "ground").refreshBody();
  platforms.create(182, GAME_HEIGHT - 15, "ground").refreshBody();

  // player = this.physics.add.sprite(100, 450, "dude");
  player = this.physics.add.sprite(100, 450, "rudolph");
  player.setScale(0.8).refreshBody();

  // player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  // rudolph.setCollideWorldBounds(true);

  /** rudolph anims */
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("rudolph", {
      start: 0,
      end: 1,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "rudolph", frame: 2 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("rudolph", {
      start: 3,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //   axisInfo = this.add.text(10, 210, "", {
  //     font: "16px Courier",
  //     fill: "#00ff00",
  //   });

  leftKey = this.input.keyboard.addKey("LEFT"); // Get key object
  rightKey = this.input.keyboard.addKey("RIGHT"); // Get key object

  stars = this.physics.add.group();
  starSpawnId = setInterval(
    () => spawnStar(generateRandomInteger(10, GAME_WIDTH)),
    800
  );

  bombs = this.physics.add.group();
  bombSpawnId = setInterval(
    () => spwanBomb(generateRandomInteger(10, GAME_WIDTH)),
    1000
  );

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "20px",
    fill: "#000",
    backgroundColor: "#fff",
  });

  remainingTimeText = this.add.text(
    16,
    40,
    `Remaining Time: ${GAME_PLAY_TIME / 1000 + 1}s`,
    {
      fontSize: "20px",
      fill: "#000",
      backgroundColor: "#fff",
    }
  );

  //   infoContainer = this.physics.add.staticGroup();
  //   infoContainer.add(scoreText);
  //   infoContainer.add(remainingTimeText);
  //   console.log(infoContainer, "<<<< info container");
  //   infoContainer.position.set(10, 10);
  //   infoContainer.refreshBody();

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(platforms, stars, itemHitsPlatform, null, this);
  this.physics.add.collider(platforms, bombs, itemHitsPlatform, null, this);
  this.physics.add.collider(player, bombs, bombHitsPlayer, null, this);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  startTimer.call(this);
}

function update() {
  if (gameOver) {
    clearInterval(starSpawnId);
    clearInterval(bombSpawnId);

    this.game.events.emit("game-over", { score });
    this.game.pause();

    return;
    // game over scene 으로 전환?
  }

  if (
    leftKey.isDown ||
    (this.input.activePointer.isDown &&
      this.input.activePointer.x < GAME_WIDTH / 2)
  ) {
    player.setVelocityX(-400);
    player.anims.play("left", true);
  } else if (
    rightKey.isDown ||
    (this.input.activePointer.isDown &&
      this.input.activePointer.x >= GAME_WIDTH / 2)
  ) {
    player.setVelocityX(400);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  let remainingTime = Math.floor(gameTimer.getRemainingSeconds());

  if (remainingTime >= 0) {
    remainingTimeText.setText(`Remaining time: ${remainingTime + 1}s`);
  }

  if (earnedItemsSize !== earnedItems.size) {
    earnedItemsSize = earnedItems.size;
    const items = Array.from(earnedItems);
    this.game.events.emit("update-itemList", items);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#3366b2",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
        // x: 0,
      },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent });
};

export default StartGame;
