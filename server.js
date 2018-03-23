let express     = require('express'),
    app         = express(),
    path        = require('path'),
    session     = require('express-session'),
    body_parser = require('body-parser'),
    mongoose    = require('mongoose');

app.use(body_parser.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: '^P%mUWCwF4hWAhtgUb8BrRqWPuR$%4w^@FSB3j*VfumMEJB8SPpr57%aqRmsEyHGhJKcvgu9#W&5ZvUrCZ*q4c%8^A9RJ49@Mf3X',
    proxy: true,
    resave: false,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/1955', function() {
    console.log(mongoose.connection.readyState + ' ' + "1 = connected");
});
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var PeopleSchema = new mongoose.Schema({
    name: {type: String, required: true},
});
mongoose.model('People', PeopleSchema);
var people = mongoose.model('People');

app.get('/', (req, res) => {
    People.find({}, function(err, people){
        if(err){
            res.json({message: 'error'});
        }
        else{
            res.json({people: people})
        }
    });
});

app.get('/new/:name/', (req, res) => {
    var person = new People({name: req.params.name});
    person.save(function(err){
        if(err){
          res.json({message: 'error'});
        }
        else{
          res.redirect('/');
        }
    });
});

app.get('/remove/:name/', (req, res) => {
    People.remove({name: req.params.name}, function(err){
        if(err){
          res.json({message: 'error'});
        } 
        else{
          res.redirect('/');
        }
    });
});

app.get('/:name', (req, res) => {
    People.find({name: req.params.name}, function(err, person){
        if(err){
            res.json({message: 'error'});
        }
        else{
            res.json({person: person});
        }
    })
});

let server = app.listen(6789, () => {
    console.log("listening on port 6789");
});
// io.sockets.on('connection', function (socket) {
//     console.log("Client/socket is connected!");
//     console.log("Client/socket id is: ", socket.id);
// });
