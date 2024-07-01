import odbc from "odbc";

// Função para realizar a consulta e retornar os dados no formato adequado
export default async function queryFirstMon() {
  let connection;

  try {
    // Estabelecer a conexão
    connection = await odbc.connect('DSN=intdc_omt_uccx01_uccx');

    // Executar a consulta
    const data = await connection.query(`
SELECT 
    ccd.sessionid AS id, 
    csq.csqname, 
    COUNT(*) AS total_calls, 
    MAX(ccd.startdatetime) AS last_call_datetime, 
    SUM(cqd.queuetime) AS total_queuetime, 
    SUM(COALESCE(acd.talktime, 0)) AS total_talktime, 
    SUM(COALESCE(acd.ringtime, 0)) AS total_ringtime, 
    SUM(COALESCE(acd.holdtime, 0)) AS total_holdtime, 
    SUM(CASE WHEN cqd.disposition = 1 THEN 1 ELSE 0 END) AS total_abandoned_calls, 
    SUM(CASE WHEN cqd.disposition = 2 THEN 1 ELSE 0 END) AS total_handled_calls
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
    ccd.startdatetime >= '2024-06-01 00:00:00'
    AND csq.csqname IN ('Associados', 'Bilingue', 'Cliente_nao_Identificado', 'Emergencia', 'Empresa', 'Prestador', 'Rechamada', 'Representante', 'VIP', 'Vendas') 
GROUP BY 
    ccd.sessionid, csq.csqname
ORDER BY 
    MAX(ccd.startdatetime);

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
