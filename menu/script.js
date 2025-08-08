document.addEventListener('DOMContentLoaded', () => {
    const botaoIniciar = document.getElementById('iniciar-partida');

    botaoIniciar.addEventListener('click', () => {
        // Redireciona para o Google quando o botão for clicado
        window.location.href = 'https://www.google.com';
    });
});