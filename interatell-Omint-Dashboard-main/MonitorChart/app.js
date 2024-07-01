import express from 'express';
import path from 'path';
import queryInformix from './query/queryInformix.js';
import queryTime from './query/queryTime.js';
import queryMon from './query/queryMes.js';
import { fileURLToPath, pathToFileURL } from 'url';
import cors from 'cors';
import queryAgent from './query/queryAgent.js';
import queryFirst from './query/queryFirst.js';
import queryFirstMon from './query/queryFirstMon.js';
import { error } from 'console';
// import queryPanelMonth from './query/queryPanel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));    

// Use cors middleware to allow cross-origin requests
app.use(cors());

app.get("/empresa", function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'empresa.html'));
});

app.get ("/emergencia", function(req, res){
res.sendFile((path.join(__dirname, 'public', 'emergencia.html')))})

app.get("/geral", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'geral.html'))
})

app.get("/vip", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'vip.html'))
})

app.get("/associados", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'associados.html'))
})
app.get("/rechamada", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'rechamada.html'))
})

app.get("/clientnot", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'clientnot.html'))
})

app.get("/vendas", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'vendas.html'))
})

app.get("/bilingue", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'bilingue.html'))
})

app.get("/prestador", function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'prestador.html'))
})

app.get("/firstCall", async function(req, res){
    try{
        // Call the function to get data from Informix query
        const data = await queryFirst();

        // Send data as JSON response
        res.json(data);
    } catch (error) {
        console.log("Error processing request:", error)
        res.status(500).send("Error processing request");
    }
}); 

app.get("/firstCallMon", async function(req, res){
    try{
        const data = await queryFirstMon();
        res.json(data);
    }catch {
        console.log("Error processing request")
        res.status(500).send("Error processinf request",error);
    }
})
// app.get("/querypanel", async function (req, res){
//     try{

//         // Call the function to get data from Informix query
//         const data = await queryPanelMonth();
//         res.json(data)
//     } catch (error) {

//         // Send data as JSON response
//         console.log("Error processing request:", error);
//         res.status(500).send("Error processing request");
//     }
// });

app.get("/queryagent", async function(req, res){
    try{
        // Call the function to get data from Informix query
        const data = await queryAgent();

        // Send data as JSON response
        res.json(data);
    } catch (error) {
        console.log("Error processing request:", error)
        res.status(500).send("Error processing request");
    }
});

app.get("/query", async function(req, res) {
    try {
        // Call the function to get data from Informix query
        const data = await queryInformix();

        // Send data as JSON response
        res.json(data);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing request");
    }
});

// Define another route where you want to include the function
app.get("/querymonth", async function(req, res) {
    try {
        // Call the function to get data from Informix query within this route
        const data = await queryMon();

        // Send data as JSON response
        res.json(data);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing request");
    }
});

app.get("/querytime", async function(req, res) {
    try {
        // Call the function to get data from Informix query within this route
        const data = await queryTime();

        // Send data as JSON response
        res.json(data);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing request");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
