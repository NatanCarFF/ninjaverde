document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const playerContainer = document.getElementById('player-container');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');

    // Configurações do jogo
    const gameWidth = 960;
    const gameHeight = 540;
    const playerSpeed = 5;
    const jumpPower = -15;
    const gravity = 0.8;
    const groundHeight = 100;
    const playerWidth = 50;
    const playerHeight = 50;
    const finalZoneWidth = 80;

    let player = {
        x: 50,
        y: gameHeight - groundHeight - playerHeight,
        velocityX: 0,
        velocityY: 0,
        isJumping: false
    };

    // Obstáculos, Pedras e Pontes
    let obstacles = [
        { x: 200, y: gameHeight - groundHeight - 30, width: 30, height: 30 },
        { x: 400, y: gameHeight - groundHeight - 60, width: 30, height: 60 },
        { x: 600, y: gameHeight - groundHeight - 45, width: 30, height: 45 },
        { x: 800, y: gameHeight - groundHeight - 70, width: 40, height: 70 },
        { x: 300, y: gameHeight - groundHeight - 20, width: 50, height: 20 },
        { x: 500, y: gameHeight - groundHeight - 50, width: 20, height: 50 },
        { x: 750, y: gameHeight - groundHeight - 50, width: 40, height: 50 }
    ];

    let environment = [
        { type: 'platform', x: 150, y: gameHeight - groundHeight + 20, width: 100, height: 20 },
        { type: 'platform', x: 550, y: gameHeight - groundHeight + 10, width: 80, height: 20 },
        { type: 'stone', x: 700, y: gameHeight - groundHeight - 10, width: 40, height: 40 }
    ];

    // Animação de Morcegos
    let bats = [
        { x: 300, y: 100, speedX: 2 },
        { x: 700, y: 150, speedX: -1.5 }
    ];

    // Animação de Tochas
    let torches = [
        { x: 100, y: gameHeight - groundHeight - 60, colorIndex: 0 },
        { x: 850, y: gameHeight - groundHeight - 70, colorIndex: 1 }
    ];
    const torchColors = ['#ff9900', '#ff6600'];
    let torchTimer = 0;
    const torchInterval = 15;

    let levelComplete = false;

    // Redimensiona o canvas e o player-container
    function resizeCanvas() {
        const aspectRatio = gameWidth / gameHeight;
        let newWidth, newHeight;

        if (window.innerWidth / window.innerHeight > aspectRatio) {
            newHeight = window.innerHeight;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = window.innerWidth;
            newHeight = newWidth / aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        const scaleX = newWidth / gameWidth;
        const scaleY = newHeight / gameHeight;

        ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

        playerContainer.style.width = playerWidth * scaleX + 'px';
        playerContainer.style.height = playerHeight * scaleY + 'px';
        playerContainer.style.transform = `translate(${player.x * scaleX}px, ${player.y * scaleY}px)`;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Lógica dos controles
    let keys = { left: false, right: false, jump: false };

    function handleKeyDown(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') keys.left = true;
        if (event.key === 'ArrowRight' || event.key === 'd') keys.right = true;
        if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') keys.jump = true;
    }

    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') keys.left = false;
        if (event.key === 'ArrowRight' || event.key === 'd') keys.right = false;
        if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') keys.jump = false;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    leftBtn.addEventListener('touchstart', () => keys.left = true);
    leftBtn.addEventListener('touchend', () => keys.left = false);
    rightBtn.addEventListener('touchstart', () => keys.right = true);
    rightBtn.addEventListener('touchend', () => keys.right = false);
    jumpBtn.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keys.jump = true;
    });
    jumpBtn.addEventListener('touchend', () => keys.jump = false);
    jumpBtn.addEventListener('mousedown', () => keys.jump = true);
    jumpBtn.addEventListener('mouseup', () => keys.jump = false);

    function checkCollision(rectA, rectB) {
        return rectA.x < rectB.x + rectB.width &&
               rectA.x + rectA.width > rectB.x &&
               rectA.y < rectB.y + rectB.height &&
               rectA.y + rectA.height > rectB.y;
    }

    // Lógica principal do jogo
    function update() {
        if (levelComplete) {
            window.location.href = 'https://www.google.com';
            return;
        }

        player.velocityX = 0;
        if (keys.left) player.velocityX = -playerSpeed;
        if (keys.right) player.velocityX = playerSpeed;
        player.x += player.velocityX;

        if (keys.jump && !player.isJumping) {
            player.velocityY = jumpPower;
            player.isJumping = true;
        }

        player.velocityY += gravity;
        player.y += player.velocityY;

        if (player.y + playerHeight > gameHeight - groundHeight) {
            player.y = gameHeight - groundHeight - playerHeight;
            player.velocityY = 0;
            player.isJumping = false;
        }

        for (let obstacle of obstacles) {
            if (checkCollision(player, obstacle)) {
                player.x = 50;
                player.y = gameHeight - groundHeight - playerHeight;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }

        for (let bat of bats) {
            bat.x += bat.speedX;
            if (bat.x < 0 || bat.x > gameWidth) {
                bat.speedX *= -1;
            }
            if (checkCollision(player, { x: bat.x, y: bat.y, width: 30, height: 20 })) {
                player.x = 50;
                player.y = gameHeight - groundHeight - playerHeight;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }

        torchTimer++;
        if (torchTimer >= torchInterval) {
            torchTimer = 0;
            torches.forEach(torch => torch.colorIndex = 1 - torch.colorIndex);
        }

        const scaleX = canvas.width / gameWidth;
        const scaleY = canvas.height / gameHeight;
        playerContainer.style.transform = `translate(${player.x * scaleX}px, ${player.y * scaleY}px)`;
        playerContainer.style.width = playerWidth * scaleX + 'px';
        playerContainer.style.height = playerHeight * scaleY + 'px';

        if (player.x > gameWidth - finalZoneWidth) {
            levelComplete = true;
        }
    }

    function drawEnvironment() {
        ctx.fillStyle = '#4a4a4a';
        environment.forEach(obj => {
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });
    }

    function drawObstacles() {
        ctx.fillStyle = 'red';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function drawBats() {
        ctx.fillStyle = '#333';
        bats.forEach(bat => {
            ctx.fillRect(bat.x, bat.y, 30, 20);
        });
    }

    function drawTorches() {
        torches.forEach(torch => {
            ctx.fillStyle = torchColors[torch.colorIndex];
            ctx.fillRect(torch.x, torch.y, 10, 30);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
        drawEnvironment();
        drawObstacles();
        drawBats();
        drawTorches();

        ctx.fillStyle = 'green';
        ctx.fillRect(gameWidth - finalZoneWidth, gameHeight - groundHeight, finalZoneWidth, groundHeight);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});