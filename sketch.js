let player;
let enemy;
let speedEnemy = 55;
let speedPlayer = 50;
let maxSpeed = 500;
let lastTime;
let gameOver = false;
let score = 0;
let coinSound;

function preload() {
  // Простий звук монети (використовуємо генератор тону)
  coinSound = new Audio();
}

function setup() {
  createCanvas(600, 400);
  player = createVector(width / 2, height / 2);
  enemy = createVector(random(width), random(height));
  lastTime = millis();
}

function draw() {
  if (gameOver) {
    background(0);
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    return;
  }

  let currentTime = millis();
  let deltaTime = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;

  background(220);

  // ворог йде до гравця
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let dist1 = sqrt(dx * dx + dy * dy);
  
  if (dist1 > 0) {
    dx = dx / dist1;
    dy = dy / dist1;
  }
  
  enemy.x = enemy.x + dx * speedEnemy * deltaTime;
  enemy.y = enemy.y + dy * speedEnemy * deltaTime;

  // гравець тікає
  let dx2 = enemy.x - player.x;
  let dy2 = enemy.y - player.y;
  let dist2 = sqrt(dx2 * dx2 + dy2 * dy2);
  
  if (dist2 > 0) {
    dx2 = dx2 / dist2;
    dy2 = dy2 / dist2;
  }
  
  player.x = player.x - dx2 * speedPlayer * deltaTime;
  player.y = player.y - dy2 * speedPlayer * deltaTime;

  // щоб не вилазили за край
  if (player.x < 0) player.x = 0;
  if (player.x > width) player.x = width;
  if (player.y < 0) player.y = 0;
  if (player.y > height) player.y = height;
  
  if (enemy.x < 0) enemy.x = 0;
  if (enemy.x > width) enemy.x = width;
  if (enemy.y < 0) enemy.y = 0;
  if (enemy.y > height) enemy.y = height;

  // малюємо кола
  fill(0, 0, 255);
  ellipse(player.x, player.y, 30, 30);

  fill(255, 0, 0);
  ellipse(enemy.x, enemy.y, 30, 30);

  // якщо торкнулися
  let distance = dist(player.x, player.y, enemy.x, enemy.y);
  if (distance < 30) {
    if (speedEnemy < maxSpeed) {
      speedEnemy = speedEnemy + 5;
    }
    score = score + 1;
    player.x = random(width);
    player.y = random(height);
    
    // Програємо звук монети
    playSound();
  }
  
  // показуємо рахунок
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
  text("Enemy speed: " + speedEnemy, 10, 35);
  text("Max speed: " + maxSpeed, 10, 60);
}

function playSound() {
  // Простий синтезований звук монети
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}