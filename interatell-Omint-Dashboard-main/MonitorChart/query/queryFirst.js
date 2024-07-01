import odbc from "odbc";

// Função para realizar a consulta e retornar os dados no formato adequado
export default async function queryAgent() {
  let connection;

  try {
    // Estabelecer a conexão
    connection = await odbc.connect('DSN=intdc_omt_uccx01_uccx');

    // Executar a consulta
    const data = await connection.query(`
    SELECT 
    ccd.sessionid AS id, 
    csq.csqname, 
    ccd.startdatetime AS datetime, 
    cqd.queuetime, 
    SUM(CASE WHEN ccd.sessionid = acd.sessionid THEN acd.talktime ELSE 0 END) AS talktime, 
    cqd.disposition, 
    ccd.connecttime, 
    SUM(acd.ringtime) AS ringtime, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime <= 5 THEN 1 ELSE 0 END AS abandlower5, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime > 5 THEN 1 ELSE 0 END AS aband5, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime > 5 THEN cqd.queuetime ELSE 0 END AS aband5wait, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime BETWEEN 0 AND 30 THEN 1 ELSE 0 END AS aband30, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime BETWEEN 0 AND 60 THEN 1 ELSE 0 END AS aband60, 
    CASE WHEN cqd.disposition = 2 AND cqd.queuetime > 5 THEN 1 ELSE 0 END AS ans5, 
    CASE WHEN cqd.disposition = 2 AND cqd.queuetime BETWEEN 0 AND 30 THEN 1 ELSE 0 END AS ans30, 
    CASE WHEN cqd.disposition = 2 AND cqd.queuetime BETWEEN 0 AND 60 THEN 1 ELSE 0 END AS ans60, 
    CASE WHEN cqd.disposition = 1 THEN cqd.queuetime ELSE 0 END AS timetoaband, 
    SUM(acd.holdtime) AS holdtime, 
    CASE WHEN cqd.disposition = 1 AND cqd.queuetime <= 5 THEN 1 ELSE 0 END AS notaccountable 
FROM 
    contactcalldetail AS ccd 
    INNER JOIN contactqueuedetail AS cqd 
        ON ccd.sessionid = cqd.sessionid 
        AND ccd.sessionseqnum = cqd.sessionseqnum 
        AND ccd.profileid = cqd.profileid 
        AND ccd.nodeid = cqd.nodeid 
    INNER JOIN contactservicequeue AS csq 
        ON cqd.targetid = csq.recordid 
        AND cqd.profileid = csq.profileid 
    LEFT JOIN agentconnectiondetail AS acd 
        ON cqd.sessionid = acd.sessionid 
        AND ccd.sessionseqnum = acd.sessionseqnum 
        AND ccd.profileid = acd.profileid 
        AND ccd.nodeid = acd.nodeid 
WHERE 
    ccd.startdatetime >= (extend(today) + interval(3) hour to hour) 
    AND ccd.startdatetime <= (extend(today+1) + interval(3) hour to hour) 
    AND csq.csqname IN ('Associados', 'Bilingue', 'Cliente_nao_Identificado', 'Emergencia', 'Empresa', 'Prestador', 'Rechamada', 'Representante', 'VIP', 'Vendas') 
GROUP BY 
    ccd.sessionid, csq.csqname, ccd.startdatetime, cqd.queuetime, cqd.disposition, ccd.connecttime, cqd.queuetime 
ORDER BY 
    ccd.startdatetime;
`);

    console.log("Resultado da consulta:", data);

    return data;
  } catch (error) {
    console.error("Erro na consulta:", error);
    throw error; // Rejeitar o erro para o chamador, se houver algum problema
  } finally {
    // Certificar-se de fechar a conexão, independentemente de sucesso ou falha
    if (connection) {
      try {
        await connection.close();
        console.log("Conexão fechada com sucesso.");
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
}
