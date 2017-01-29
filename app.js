var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var fs = require('fs');


var log = {};
log.info = console.log;


var port = process.env.PORT || 3000;
var nodeEnv = process.env.NODE_ENV;
var nodeServerUrl = process.env.NODE_SERVER_URL;

var protocol = nodeEnv=='production' ? 'https' : 'http';
var serverUrl = protocol + '://' + nodeServerUrl + ':' + port;
var secure = nodeEnv=='production' ? true : false;

var app = express();
var server = require('http').createServer(app);
var socketIO = require('socket.io')(server);


app.use(bodyParser());
app.use(cookieParser());
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan(':date[web] :remote-addr :remote-user :url :status', {stream: accessLogStream}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render(__dirname + '/templates/index.ejs', { serverUrl:serverUrl, secure:secure});
});

app.get('/jquery.min.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

socketIO.on('connection', function (socket) {
    socket.emit('news', { text: 'hello world' });
    socket.on('event', function (data) {
        socket.emit('news', { text: 'hello world' });
    });
    socket.broadcast.emit('user connected');
});

server.listen(port, function(){
    log.info('Express server listening on ' + serverUrl);
});