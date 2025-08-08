document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
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
    const groundHeight = 100; // Aumentamos a altura do chão
    const finalZoneWidth = 80;

    let player = {
        x: 50,
        y: gameHeight - groundHeight - 50,
        width: 50,
        height: 50,
        velocityX: 0,
        velocityY: 0,
        isJumping: false
    };

    let ninjaImage = new Image();
    ninjaImage.src = 'seu_arquivo.gif'; // Substitua 'seu_arquivo.gif' pelo nome do seu arquivo GIF

    let obstacles = [
        { x: 200, y: gameHeight - groundHeight - 30, width: 30, height: 30 },
        { x: 400, y: gameHeight - groundHeight - 60, width: 30, height: 60 },
        { x: 600, y: gameHeight - groundHeight - 45, width: 30, height: 45 }
    ];

    let levelComplete = false;

    // Redimensiona o canvas para se ajustar à tela
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

        // Ajusta a proporção do contexto de renderização
        ctx.setTransform(newWidth / gameWidth, 0, 0, newHeight / gameHeight, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Lógica dos controles
    let keys = {
        left: false,
        right: false,
        jump: false
    };

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

    // Lógica para os botões da tela
    leftBtn.addEventListener('touchstart', () => keys.left = true);
    leftBtn.addEventListener('touchend', () => keys.left = false);
    rightBtn.addEventListener('touchstart', () => keys.right = true);
    rightBtn.addEventListener('touchend', () => keys.right = false);
    jumpBtn.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Impede o comportamento padrão do touch, como o zoom
        keys.jump = true;
    });
    jumpBtn.addEventListener('touchend', () => keys.jump = false);
    jumpBtn.addEventListener('mousedown', () => keys.jump = true);
    jumpBtn.addEventListener('mouseup', () => keys.jump = false);

    // Lógica para detecção de colisão
    function checkCollision(objA, objB) {
        return objA.x < objB.x + objB.width &&
               objA.x + objA.width > objB.x &&
               objA.y < objB.y + objB.height &&
               objA.y + objA.height > objB.y;
    }

    // Lógica do jogo
    function update() {
        if (levelComplete) {
            window.location.href = 'https://www.google.com';
            return;
        }

        // Movimento horizontal
        player.velocityX = 0;
        if (keys.left) {
            player.velocityX = -playerSpeed;
        }
        if (keys.right) {
            player.velocityX = playerSpeed;
        }
        player.x += player.velocityX;

        // Pulo
        if (keys.jump && !player.isJumping) {
            player.velocityY = jumpPower;
            player.isJumping = true;
        }
        
        // Gravidade
        player.velocityY += gravity;
        player.y += player.velocityY;
        
        // Colisão com o chão
        if (player.y + player.height > gameHeight - groundHeight) {
            player.y = gameHeight - groundHeight - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }

        // Colisão com os obstáculos
        for (let i = 0; i < obstacles.length; i++) {
            if (checkCollision(player, obstacles[i])) {
                // Redefine a posição do jogador
                player.x = 50;
                player.y = gameHeight - groundHeight - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
        
        // Simulação de final de fase: passar por todos os obstáculos
        if (player.x > gameWidth - finalZoneWidth) {
            levelComplete = true;
        }
    }

    // Renderiza o jogo na tela
    function draw() {
        // Limpa o canvas
        ctx.clearRect(0, 0, gameWidth, gameHeight);

        // Desenha o chão
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(0, gameHeight - groundHeight, gameWidth, groundHeight);

        // Desenha os obstáculos
        ctx.fillStyle = 'red';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Desenha o final de fase
        ctx.fillStyle = 'green';
        ctx.fillRect(gameWidth - finalZoneWidth, gameHeight - groundHeight, finalZoneWidth, groundHeight);

        // Desenha o personagem
        if (ninjaImage.complete) {
            ctx.drawImage(ninjaImage, player.x, player.y, player.width, player.height);
        } else {
            // Se a imagem ainda não carregou, desenha um quadrado temporário
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }

    // Loop principal do jogo
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Inicia o loop do jogo
    ninjaImage.onload = () => {
        gameLoop();
    };

    // Caso a imagem falhe ao carregar
    ninjaImage.onerror = () => {
        console.error('Erro ao carregar a imagem do ninja. Verifique se o arquivo "seu_arquivo.gif" está no local correto.');
        gameLoop();
    };
});