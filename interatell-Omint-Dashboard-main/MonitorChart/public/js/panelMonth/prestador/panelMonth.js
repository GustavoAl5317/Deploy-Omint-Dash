function toggleColor() {
    const levelElement = document.getElementById('cardNivel');
    const textElement = document.getElementById('card-textNivel');
    const textNumbers = document.getElementById('classNameId-level-monthly'); // ID corrected for monthly

    const percentage = parseFloat(levelElement.innerText.replace('%', ''));

    if (percentage < 99.5) {
        levelElement.style.border = '2px solid red';
        textElement.style.color = 'red';
        textElement.style.fontSize = '24px';
        textNumbers.style.color = 'red';
    } else {
        levelElement.style.border = ''; // Reset border
        // textElement.style.color = 'black'; // Reset color
        textElement.style.fontSize = ''; // Reset font size
        textNumbers.style.color = ''; // Reset color
    }
}

function formatDate(date) {
    // Formata a data no formato dd/mm/yy
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function displayCurrentDate() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();  // 0 = Janeiro, 1 = Fevereiro, ..., 11 = Dezembro
    const currentYear = today.getFullYear();

    // Cria um objeto de data para o primeiro dia do mês
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    // Formata as datas para o formato dd/mm/yy
    const startDateFormatted = formatDate(firstDayOfMonth);
    const endDateFormatted = formatDate(today);

    // Cria a string de data desejada
    const formattedDateRange = `Dados referentes ao período: De ${startDateFormatted} a ${endDateFormatted}`;

    // Exibe a data no elemento HTML com id 'dateMon'
    const dateElement = document.getElementById('dateMon');
    if (dateElement) {
        dateElement.innerHTML = formattedDateRange;
    } else {
        console.error('Elemento de data não encontrado.');
    }
}

// Chama a função para exibir a data
displayCurrentDate();

function formatarTempo(tempoSegundos) {
    let horas = Math.floor(tempoSegundos / 3600);
    let minutos = Math.floor((tempoSegundos % 3600) / 60);
    let segundos = Math.floor(tempoSegundos % 60);

    return [
        horas.toString().padStart(2, '0'),
        minutos.toString().padStart(2, '0'),
        segundos.toString().padStart(2, '0')
    ].join(':');
}

function atualizarValor() {
    fetch('http://10.175.15.27:3000/querymonth')
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            let sumOffered = 0;
            let sumHandled = 0;
            let sumAband = 0;
            let sumQueuetime = 0;
            let sumPercentage = 0;
            let sumMaxqueuetime = 0;
            let sumMaxTimeAband = 0;
            let sumTotalTalkTime = 0;

            data.forEach(empresa => {
                if (empresa.csqname === "Prestador") {
                    sumOffered += empresa.offered;
                    sumHandled += empresa.handled;
                    sumAband += empresa.aband5;
                    sumQueuetime += empresa.queuetime;
                    sumPercentage += empresa.servicelevel;
                    sumMaxqueuetime += empresa.max_queuetime;
                    sumMaxTimeAband += empresa.max_time_aband;
                    sumTotalTalkTime += empresa.talktime;
                }
            });

            let averageServiceTimeTme = sumHandled !== 0 ? sumQueuetime / sumHandled : 0;
            let averagePercentage = sumOffered !== 0 ? (sumPercentage / sumOffered) * 100 : 0;
            let averageServiceTime = sumHandled !== 0 ? sumTotalTalkTime / sumHandled : 0;
            let averageSumMaxqueutime = sumHandled !==0 ? sumMaxqueuetime / sumHandled: 0;

            document.getElementById('classNameId-monthly').innerText = sumOffered;
            document.getElementById('classNameId-handled-monthly').innerText = sumHandled;
            document.getElementById('classNameId-totalAband-higher5-monthly').innerText = sumAband;
            document.getElementById('classNameId-TME-monthly').innerText = formatarTempo(averageServiceTimeTme);
            document.getElementById('classNameId-level-monthly').innerText = averagePercentage.toFixed(2) + "%";
            document.getElementById('classNameId-timeFila-monthly').innerText = formatarTempo(averageSumMaxqueutime);
            document.getElementById('classNameId-timeAband-monthly').innerText = formatarTempo(sumMaxTimeAband);
            document.getElementById('classNameId-talktime-monthly').innerText = formatarTempo(averageServiceTime);
            toggleColor();
        } else {
            console.error('Resposta inválida ou vazia.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar valor:', error);
    });
}

atualizarValor()
setInterval(atualizarValor, 5000); // Atualiza a cada segundo
