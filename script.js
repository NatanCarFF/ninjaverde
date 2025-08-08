document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const gameArea = document.querySelector('.game-area');
    const gameContainer = document.querySelector('.game-container');
    const actionButton = document.getElementById('action');
    const totalItems = 10;
    let itemsCollected = 0;
    let characterPosition = { x: 50, y: 50 };
    let finalCircle = null;

    const items = [];

    // Função para posicionar o personagem
    function updateCharacterPosition() {
        character.style.left = `${characterPosition.x}%`;
        character.style.top = `${characterPosition.y}%`;
    }

    // Função para criar os itens
    function createItems() {
        for (let i = 0; i < totalItems; i++) {
            const item = document.createElement('img');
            item.src = 'item.png';
            item.classList.add('item');
            positionItem(item);
            gameArea.appendChild(item);
            items.push(item);
        }
    }

    // Função para posicionar um item aleatoriamente
    function positionItem(item) {
        const x = Math.random() * 90;
        const y = Math.random() * 90;
        item.style.left = `${x}%`;
        item.style.top = `${y}%`;
    }

    // Função para verificar colisão
    function checkCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    // Função principal do jogo (loop)
    function gameLoop() {
        // Verifica a colisão com os itens
        if (itemsCollected < totalItems) {
            items.forEach((item, index) => {
                if (item && checkCollision(character, item)) {
                    item.remove();
                    items[index] = null;
                    itemsCollected++;
                    console.log(`Itens coletados: ${itemsCollected}`);
                    if (itemsCollected === totalItems) {
                        createFinalCircle();
                    }
                }
            });
        }
        
        // Verifica a colisão com o círculo final
        if (finalCircle && checkCollision(character, finalCircle)) {
            // Ação do botão para o círculo
            actionButton.onclick = () => {
                window.location.href = 'https://www.google.com';
            };
        } else {
            // Remove a ação do botão para o círculo
            actionButton.onclick = null;
        }

        requestAnimationFrame(gameLoop);
    }

    // Função para criar o círculo final
    function createFinalCircle() {
        finalCircle = document.createElement('div');
        finalCircle.classList.add('game-end-circle');
        finalCircle.style.display = 'block';
        gameArea.appendChild(finalCircle);
    }

    // Event listeners para os botões direcionais
    document.getElementById('up').addEventListener('touchstart', (e) => {
        e.preventDefault();
        characterPosition.y = Math.max(0, characterPosition.y - 2);
        updateCharacterPosition();
    });

    document.getElementById('down').addEventListener('touchstart', (e) => {
        e.preventDefault();
        characterPosition.y = Math.min(90, characterPosition.y + 2);
        updateCharacterPosition();
    });

    document.getElementById('left').addEventListener('touchstart', (e) => {
        e.preventDefault();
        characterPosition.x = Math.max(0, characterPosition.x - 2);
        updateCharacterPosition();
    });

    document.getElementById('right').addEventListener('touchstart', (e) => {
        e.preventDefault();
        characterPosition.x = Math.min(90, characterPosition.x + 2);
        updateCharacterPosition();
    });

    // Inicia o jogo
    createItems();
    updateCharacterPosition();
    gameLoop();
});