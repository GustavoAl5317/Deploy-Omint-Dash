import odbc from "odbc";

// Função para realizar a consulta e retornar os dados no formato adequado
export default async function queryInformix() {
  let connection;

  try {
    // Estabelecer a conexão
    connection = await odbc.connect('DSN=intdc_omt_uccx01_uccx');

    // Executar a consulta
    const data = await connection.query(`
      SELECT 
        csqname, 
        offered, 
        handled, 
        total_aband, 
        aband5, 
        abandlower5, 
        sloffered60 AS servicelevel, 
        sloffered30 AS servicelevel30, 
        notaccountable AS aband_not_accountable, 
        ringtime, 
        talktime, 
        holdtime, 
        queuetime, 
        maxqueuetime AS max_queuetime, 
        timetoaband AS aband_time, 
        maxtimetoaband AS max_time_aband, 
        aband5wait 
      FROM (
        SELECT 
          csqname, 
          COUNT(*) AS offered, 
          SUM(CASE WHEN disposition = 2 THEN 1 ELSE 0 END) AS handled, 
          SUM(CASE WHEN disposition = 1 THEN 1 ELSE 0 END) AS total_aband, 
          SUM(aband5) AS aband5, 
          SUM(abandlower5) AS abandlower5, 
          MAX(queuetime) AS maxqueuetime, 
          MAX(timetoaband) AS maxtimetoaband, 
          SUM(CASE WHEN timetoaband > 0 THEN timetoaband ELSE 0 END) AS timetoaband, 
          SUM(ans60+aband60) AS sloffered60, 
          SUM(ans30+aband30) AS sloffered30, 
          SUM(talktime) AS talktime, 
          SUM(queuetime) AS queuetime, 
          SUM(holdtime) AS holdtime, 
          SUM(notaccountable) AS notaccountable, 
          SUM(ringtime) AS ringtime, 
          SUM(aband5wait) AS aband5wait 
        FROM (
          SELECT 
            ccd.sessionid AS id, 
            csq.csqname, 
            ccd.startdatetime AS datetime, 
            MAX(CASE WHEN cqd.disposition = 1 THEN 0 ELSE cqd.queuetime END) AS queuetime, 
            SUM(CASE WHEN ccd.sessionid = acd.sessionid THEN acd.talktime ELSE 0 END) AS talktime, 
            cqd.disposition AS disposition, 
            SUM(ccd.connecttime) AS connecttime, 
            SUM(acd.ringtime) AS ringtime, 
            MAX(CASE WHEN cqd.disposition = 1 AND cqd.queuetime <= 5 THEN 1 ELSE 0 END) AS abandlower5, 
            MAX(CASE WHEN cqd.disposition = 1 AND cqd.queuetime > 5 THEN 1 ELSE 0 END) AS aband5, 
            MAX(CASE WHEN cqd.disposition = 1 AND cqd.queuetime > 5 THEN queuetime ELSE 0 END) AS aband5wait, 
            MAX(CASE WHEN cqd.disposition = 1 AND cqd.queuetime BETWEEN 0 AND 30 THEN 1 ELSE 0 END) AS aband30, 
            MAX(CASE WHEN cqd.disposition = 1 AND cqd.queuetime BETWEEN 0 AND 60 THEN 1 ELSE 0 END) AS aband60, 
            MAX(CASE WHEN cqd.disposition = 2 AND cqd.queuetime > 5 THEN 1 ELSE 0 END) AS ans5, 
            MAX(CASE WHEN cqd.disposition = 2 AND cqd.queuetime BETWEEN 0 AND 30 THEN 1 ELSE 0 END) AS ans30, 
            MAX(CASE WHEN cqd.disposition = 2 AND cqd.queuetime BETWEEN 0 AND 60 THEN 1 ELSE 0 END) AS ans60, 
            CASE WHEN cqd.disposition = 1 THEN cqd.queuetime ELSE 0 END AS timetoaband, 
            SUM(acd.holdtime) AS holdtime, 
            CASE WHEN cqd.disposition = 1 AND cqd.queuetime <= 5 THEN 1 ELSE 0 END AS notaccountable 
          FROM 
            contactcalldetail AS ccd 
            INNER JOIN contactqueuedetail AS cqd ON ccd.sessionid = cqd.sessionid AND ccd.sessionseqnum = cqd.sessionseqnum AND ccd.profileid = cqd.profileid AND ccd.nodeid = cqd.nodeid 
            INNER JOIN contactservicequeue AS csq ON cqd.targetid = csq.recordid AND cqd.profileid = csq.profileid 
            LEFT JOIN agentconnectiondetail AS acd ON cqd.sessionid = acd.sessionid AND ccd.sessionseqnum = acd.sessionseqnum AND ccd.profileid = acd.profileid AND ccd.nodeid = acd.nodeid 
          where ccd.startdatetime >= (extend(today) + interval(3) hour to hour)
          and ccd.startdatetime <= (extend(today+1) + interval(3) hour to hour)
            AND csq.csqname IN ('Associados', 'Bilingue', 'Cliente_nao_Identificado', 'Emergencia', 'Empresa', 'Prestador', 'Rechamada', 'Representante', 'VIP', 'Vendas') 
          GROUP BY 
            csqname, datetime, disposition, id, timetoaband, notaccountable 
        ) AS subquery 
        GROUP BY 
          csqname 
      ) AS outerquery`);

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
