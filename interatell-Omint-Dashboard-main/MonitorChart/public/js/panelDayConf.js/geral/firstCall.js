function update() {
    fetch('http://10.175.15.27:3000/firstCall')
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            let callCounts = {};
            
            // Conta a quantidade de chamadas por id apenas para 'Associados'
            data.forEach(call => {
                if (call.csqname) {
                    if (callCounts[call.id]) {
                        callCounts[call.id]++;
                    } else {
                        callCounts[call.id] = 1;
                    }
                }
            });

            let totalCalls = Object.keys(callCounts).length; // Total de chamadas únicas

            let noRechamadasCount = 0;
            let repeatedCallsCount = 0;

            // Verifica a quantidade de rechamadas
            for (let id in callCounts) {
                if (callCounts.hasOwnProperty(id)) {
                    if (callCounts[id] === 1) {
                        noRechamadasCount++;
                    } else if (callCounts[id] >= 2) {
                        repeatedCallsCount++;
                    }
                }
            }

            // Calcula as porcentagens
            let percentNoRechamadas = ((noRechamadasCount / totalCalls) * 100).toFixed(2);
            let percentRechamadas = ((repeatedCallsCount / totalCalls) * 100).toFixed(2);

            // Atualiza o elemento HTML com a porcentagem de chamadas sem rechamadas
            document.getElementById('classNameId-FirstCall').innerText = percentNoRechamadas + '%';

            // Atualiza o elemento HTML com a porcentagem de chamadas realizadas 2 vezes ou mais
            document.getElementById('classNameId-Rechamada').innerText = percentRechamadas + '%';
        } else {
            console.log('Nenhuma chamada encontrada.');
        }
    })
    .catch(error => {
        console.error('Erro ao buscar as chamadas:', error);
    });
}

// Chama a função update ao carregar a página
update(); // Para atualização imediata ao carregar

setInterval(update, 5000); // Atualiza a cada 5 segundos