function toggleColor() {
    const levelElement = document.getElementById('cardNivel');
    const TextElement = document.getElementById('card-textNivel')
    const TextNumbers = document.getElementById('classNameId-level')
    const percentage = parseFloat(levelElement.innerText.replace('%', ''));

    if (percentage < 99.5) {
        levelElement.style.border = '2px solid red';
        TextElement.style.color = ''
        TextElement.style.fontSize = '24px'
        TextNumbers.style.color = 'red'
    } else {
        levelElement.style.color = 'black'; // Ou outra cor padrão
    }
}






function formatarTempo(tempoSegundos) {
    let horas = Math.floor(tempoSegundos / 3600);
    let minutos = Math.floor((tempoSegundos % 3600) / 60);
    let segundos = Math.floor(tempoSegundos % 60);

    // Adicionando zeros à esquerda para manter o formato de dois dígitos
    const formatoTempo = [
        horas.toString().padStart(2, '0'),
        minutos.toString().padStart(2, '0'),
        segundos.toString().padStart(2, '0')
    ].join(':');

    return formatoTempo;
}

//Função data
function capitalizeFirstLetter(string) {
    return string.replace(/(^|\s)\S/g, function(char) {
        return char.toUpperCase();
    });
}

function displayCurrentDate() {
    const day = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('date');

    if (dateElement) {
        let formattedDate = day.toLocaleDateString('pt-BR', options);
        formattedDate = capitalizeFirstLetter(formattedDate);
        dateElement.innerHTML = formattedDate;
    } else {
        console.error('Elemento de data não encontrado.');
    }
}

// Chama a função para exibir a data atual
displayCurrentDate();

function atualizarValor() {
    // Fazer a requisição para a sua rota
    fetch('http://10.175.15.27:3000/query')
    .then(response => response.json())
    .then(data => {
        // Verificar se a resposta contém dados válidos
        if (data && data.length > 0) {
            // Procurar o objeto com o csqname "Empresa" na matriz
            const emerg = data.find(objeto => objeto.csqname === "Emergencia");

            // Verificar se o objeto "Empresa" foi encontrado
            if (emerg) {
                // Atualizar o valor na div com o valor "offered" do objeto "emerg"
                const offeredValue =emerg.offered;
                document.getElementById('classNameId').innerText = offeredValue;

                // Calcular o nível de serviço (SL) em percentagem
                const serviceLevel =emerg.servicelevel;
                const slPercentage = (serviceLevel / offeredValue) * 100;

                // Exibir o nível de serviço em percentagem na outra div
                document.getElementById('classNameId-level').innerText = slPercentage.toFixed(0) + "%"; // Remover dois zeros após o ponto decimal
                
                // Atualizar o maior tempo de fila, se disponível
                const maxQueueTime = emerg.max_queuetime;
                if (maxQueueTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoFila = formatarTempo(maxQueueTime);
                    document.getElementById('classNameId-timeFila').innerText = formatoTempoFila;
                } else {
                    console.error('Propriedade "max_queuetime" não encontrada ou indefinida no objeto "emerg".');
                }

                // TME - tempo médio de espera

                const totalTME = emerg.queuetime;
                const totalHandled2 = emerg.handled;
                const averageServiceTimeTme = (totalTME / totalHandled2);
                if (averageServiceTimeTme !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoTalkTime = formatarTempo(averageServiceTimeTme);
                    document.getElementById('classNameId-TME').innerText = formatoTempoTalkTime;
                } else {
                    console.error('Propriedade "Holdtime" não encontrada ou indefinida no objeto "Emergência".');
                }

                // total chamadas abandonadas acima de 5 segundos
                const totalAbandHigher5 = emerg.aband5; // Corrigido o nome da variável
                document.getElementById('classNameId-totalAband-higher5').innerText = totalAbandHigher5;

                // total chamadas atendidas
                const totalHandled = emerg.handled;
                document.getElementById('classNameId-handled').innerText = totalHandled;


                // maior tempo de abandono
                const maxAbandonTime = emerg.max_time_aband; // Corrigido o nome da variável
                if (maxAbandonTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoAbandono = formatarTempo(maxAbandonTime);
                    document.getElementById('classNameId-timeAband').innerText = formatoTempoAbandono;
                } else {
                    console.error('Propriedade "max_time_aband" não encontrada ou indefinida no objeto "Emergencia".');
                }

                // tempo de conversa
                const totalTalkTime = emerg.talktime;
                const averageServiceTime = (totalTalkTime / totalHandled);
                if (averageServiceTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoTalkTime = formatarTempo(averageServiceTime);
                    document.getElementById('classNameId-talktime').innerText = formatoTempoTalkTime;
                } else {
                    console.error('Propriedade "talktime" não encontrada ou indefinida no objeto "Empresa".');
                }
            } else {
                console.error('Objeto "Empresa" não encontrado na matriz.');
            }
        } else {
            console.error('Resposta inválida ou vazia.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar valor:', error);
    });
}

atualizarValor()
setInterval(atualizarValor, 5000); // Atualiza a cada 5 segundos
