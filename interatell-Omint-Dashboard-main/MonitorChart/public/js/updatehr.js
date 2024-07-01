function updateEveryHour() {
    const oneHour = 60 * 60 * 1000; // 1 hora em milissegundos

    setInterval(() => {
        location.reload(); // Recarregar a página a cada hora
    }, oneHour);
}

// Chame a função para iniciar a atualização a cada hora
updateEveryHour();
