var express = require('express');
var path = require('path');
var hbs = require('hbs');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));


var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get('/', function (req, res) {
  res.render('index', {
    headline: 'Ancestry Tree',
    images: []
  });
});