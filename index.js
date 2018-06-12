var express = require('express');
var path = require('path');
var hbs = require('hbs');
var fs = require('fs');

// Register Partials
var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));



var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get('/', function (req, res) {
  res.render('index');
});