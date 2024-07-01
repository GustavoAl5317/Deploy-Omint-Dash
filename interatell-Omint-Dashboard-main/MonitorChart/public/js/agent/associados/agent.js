// let associadosAgents = [];

// function formatTime(seconds) {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs}h ${mins}m ${secs}s`;
// }

// function formatAverageTime(seconds, count) {
//     if (count === 0) return '0h 0m 0s'; // Evita divisão por zero

//     const averageSeconds = Math.round(seconds / count);
//     return formatTime(averageSeconds);
// }

// function updateValue() {
//     fetch('http://localhost/queryagent')
//     .then(response => response.json())
//     .then(data => {
//         if (data && data.length > 0) {
//             associadosAgents = data.filter(agent => agent.csqname === "Associados");
            
//             if (associadosAgents.length > 0) {
//                 const nameFila = associadosAgents[0].csqname;
//                 document.getElementById('nameFl').innerHTML = nameFila;

//                 const tableBody = document.getElementById('tableBody');
//                 tableBody.innerHTML = '';

//                 associadosAgents.forEach(agent => {
//                     const row = document.createElement('tr');
                    
//                     const agentCell = document.createElement('td');
//                     agentCell.textContent = agent.resourcename;
//                     row.appendChild(agentCell);
                    
//                     const handled = document.createElement('td');
//                     handled.textContent = agent.handled;
//                     row.appendChild(handled);

//                     const totalAband = document.createElement('td');
//                     totalAband.textContent = agent.total_aband;
//                     row.appendChild(totalAband);

//                     const ringTimeCell = document.createElement('td');
//                     ringTimeCell.textContent = formatAverageTime(agent.ringtime, agent.handled); // Média do ringtime
//                     row.appendChild(ringTimeCell);
                    
//                     const holdTimeCell = document.createElement('td');
//                     holdTimeCell.textContent = formatAverageTime(agent.holdtime, agent.handled); // Média do holdtime
//                     row.appendChild(holdTimeCell);
                    
//                     const talkTimeCell = document.createElement('td');
//                     talkTimeCell.textContent = formatAverageTime(agent.talktime, agent.handled); // Média do talktime
//                     row.appendChild(talkTimeCell);

//                     tableBody.appendChild(row);
//                 });
//             } else {
//                 console.log('No agents found in the "Associados" queue');
//                 document.getElementById('nameFl').innerText = "No agents found in the 'Associados' queue";
//             }
//         } else {
//             console.log("No data found");
//         }
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });
// }

// function exportReport() {
//     if (associadosAgents.length > 0) {
//         const headers = ['Agente', 'Atendidas', 'Abandonadas', 'RingTime', 'HoldTime', 'TalkTime'];

//         const csvContent = [
//             headers.join(';'),
//             ...associadosAgents.map(agent => [
//                 agent.resourcename,
//                 agent.handled,
//                 agent.total_aband,
//                 formatAverageTime(agent.ringtime, agent.handled), // Média do ringtime
//                 formatAverageTime(agent.holdtime, agent.handled), // Média do holdtime
//                 formatAverageTime(agent.talktime, agent.handled)   // Média do talktime
//             ].join(';'))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'relatorio_agentes_associados.csv';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     } else {
//         console.log('No data to export');
//     }
// }

// updateValue();

// document.getElementById('exportBtn').addEventListener('click', exportReport);
