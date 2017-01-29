var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');


var log = {};
log.info = console.log;


var port = process.env.PORT || 8080;

var app = express();
var server = require('http').createServer(app);
var socketIO = require('socket.io')(server);


app.use(bodyParser());
app.use(cookieParser());
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan(':date[web] :remote-addr :remote-user :url :status', {stream: accessLogStream}));


app.get('/', function(req, res) {
    // res.send('Test');
    res.sendFile(__dirname + '/templates/index.html');
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
    log.info('Express server listening on port ' + port);
});