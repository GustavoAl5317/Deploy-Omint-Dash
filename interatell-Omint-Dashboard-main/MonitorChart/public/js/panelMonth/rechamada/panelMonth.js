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

function capitalizeFirstLetter(string) {
    return string.replace(/(^|\s)\S/g, function(char) {
        return char.toUpperCase();
    });
}

function displayCurrentDate() {
    const day = new Date();
    const currentDay = day.getDate();
    const currentMonth = day.toLocaleDateString('pt-BR', { month: 'long' });
    const currentYear = day.getFullYear();

    const formattedStartDate = `Painel do dia 1 até o dia ${currentDay} de ${currentMonth} de ${currentYear}`;
    const capitalizedFormattedStartDate = capitalizeFirstLetter(formattedStartDate);

    const dateElement = document.getElementById('dateMon');
    if (dateElement) {
        dateElement.innerHTML = capitalizedFormattedStartDate;
    } else {
        console.error('Elemento de data não encontrado.');
    }
}

displayCurrentDate()

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
                if (empresa.csqname === "Rechamada") {
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
