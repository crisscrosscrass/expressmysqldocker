const express = require('express');
const logger = require("./config/logger");
const mysqlConnection = require('./config/mysqlConnection');
const bodyParser = require('body-parser');
const port = 8000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  logger.info("loaded index page");
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
    { name: 'Tux', organization: "Linux", birth_year: 1996 },
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

app.get('/about', (req, res) => {
  logger.info("loaded about page");
  res.render('pages/about');
});

app.get('/createSample', (req, res) => {
  mysqlConnection.createSample(res);
});


// app.get('/clubreq', function (req, res, next) {
//   res.render('clubreq', {
//     title: 'Club Requests',
//     "clubreq": docs
//   });
// });
app.post('/testurl', function (req, res, next) {
  // req.body object has your form values
  //console.log(req);
  console.log(req.body);
  const responseData = JSON.stringify(req.body);
  //res.json(req.body);
  //res.send(`<script>console.log(${req.body})</script>`);
  return res.send('' + responseData);
});


// REAL TIME EVENTS
app.get('/status', (request, response) => response.json({ clients: clients.length }));

let clients = [];
let facts = [];

function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(facts)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

app.get('/events', eventsHandler);

function sendEventsToAll(newFact) {
  logger.info("send Events To All...");
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}

async function addFact(request, respsonse, next) {
  logger.info("Adding new fact to data...");
  const newFact = request.body;
  facts.push(newFact);
  respsonse.json(newFact)
  return sendEventsToAll(newFact);
}

app.post('/fact', addFact);





app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));
app.listen(port, () => {
  logger.info(`Starting Server, listening to request on port ${port}`);
})