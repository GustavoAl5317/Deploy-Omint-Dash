import odbc from "odbc";

// Função para realizar a consulta e retornar os dados no formato adequado
export default async function queryMon() {
  let connection;

  try {
    // Estabelecer a conexão
    connection = await odbc.connect('DSN=intdc_omt_uccx01_uccx');

    // Executar a consulta
    const data = await connection.query(`
    select 
  csqname
  , datetime_gmt as date
  , day(datetime_gmt) as day
  , offered
  , handled
  , total_aband
  , aband5
  , abandlower5
  , sloffered60 as servicelevel
  , sloffered30 as servicelevel30
  , notaccountable as aband_not_accountable
  , ringtime
  , talktime
  , holdtime
  , queuetime
  , maxqueuetime as max_queuetime
  , timetoaband as aband_time
  , maxtimetoaband as max_time_aband
  , aband5wait
  
  from(select
    csqname
    , date(datetime_gmt) as datetime_gmt
    , count(*) as offered
    , sum(case when disposition = 2 then 1 else 0 end) as handled
    , sum(case when disposition = 1 then 1 else 0 end) as total_aband
    , sum(aband5) as aband5
    , sum(abandlower5) as abandlower5
    , max(queuetime) as maxqueuetime
    , max(timetoaband) as maxtimetoaband
    , sum(case when timetoaband > 0 then timetoaband else 0 end) as timetoaband
    , sum(ans60+aband60) as sloffered60
    , sum(ans30+aband30) as sloffered30
    , sum(talktime) as talktime
    , sum(queuetime) as queuetime
    , sum(holdtime) as holdtime
    , sum(notaccountable) as notaccountable
    , sum(ringtime) as ringtime
    , sum(aband5wait) as aband5wait

    from(select
      ccd.sessionid as id
      , csq.csqname
      , ccd.startdatetime as datetime
      , extend(ccd.startdatetime - interval(3) hour to hour) as datetime_gmt
      , max(case when cqd.disposition = 1 then 0 else cqd.queuetime end) as queuetime
      , sum(case when ccd.sessionid = acd.sessionid then acd.talktime else 0 end) as talktime
      , cqd.disposition as disposition
      , sum(ccd.connecttime) as connecttime
      , sum(acd.ringtime) as ringtime
      , max(case when cqd.disposition = 1 and cqd.queuetime <= 5 then 1 else 0 end) as abandlower5
      , max(case when cqd.disposition = 1 and cqd.queuetime > 5 then 1 else 0 end) as aband5
      , max(case when cqd.disposition = 1 and cqd.queuetime > 5 then queuetime else 0 end) as aband5wait
      , max(case when cqd.disposition = 1 and cqd.queuetime between 0 and 30 then 1 else 0 end) as aband30
      , max(case when cqd.disposition = 1 and cqd.queuetime between 0 and 60 then 1 else 0 end) as aband60
      , max(case when cqd.disposition = 2 and cqd.queuetime > 5 then 1 else 0 end) as ans5
      , max(case when cqd.disposition = 2 and cqd.queuetime between 0 and 30 then 1 else 0 end) as ans30
      , max(case when cqd.disposition = 2 and cqd.queuetime between 0 and 60 then 1 else 0 end) as ans60      
      , case when cqd.disposition = 1 then cqd.queuetime else 0 end as timetoaband
      , sum(acd.holdtime) as holdtime
      , case when cqd.disposition = 1 and cqd.queuetime <= 5 then 1 else 0 end as notaccountable
              
      from contactcalldetail as ccd
  
      inner join contactqueuedetail as cqd
        on ccd.sessionid = cqd.sessionid
        and ccd.sessionseqnum = cqd.sessionseqnum
        and ccd.profileid = cqd.profileid
        and ccd.nodeid = cqd.nodeid
      inner join contactservicequeue as csq
        on cqd.targetid = csq.recordid
        and cqd.profileid = csq.profileid
      left join agentconnectiondetail as acd
        on cqd.sessionid = acd.sessionid
        and ccd.sessionseqnum = acd.sessionseqnum
        and ccd.profileid = acd.profileid
        and ccd.nodeid = acd.nodeid
    
      where ccd.startdatetime >= (extend(today-day(today)+1) + interval(3) hour to hour)
        and ccd.startdatetime <= (extend(today+1) + interval(3) hour to hour)
        and csq.csqname in ('Associados','Bilingue','Cliente_nao_Identificado','Emergencia','Empresa','Prestador','Rechamada','Representante','VIP','Vendas')

      group by csqname, datetime, disposition, id, timetoaband, notaccountable
    )
  
    group by csqname, datetime_gmt)`);

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
