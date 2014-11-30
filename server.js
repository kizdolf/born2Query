'use strict';

var express				= require('express'),
	app					= express(),
	bodyParser			= require('body-parser'),
	port				= process.env.PORT || 8080, 
	router				= require('./api/routes'), 
	mongoose   		= require('mongoose');

// mongoose.connect('mongodb://donkino:public65ENEMY@ds053160.mongolab.com:53160/ca_42'); // connect to our database
mongoose.connect('mongodb://localhost/ca_4'); // connect to our database

app.set('views', __dirname + '/app')


.engine('html', require('jade').__express)

.use('/app', express.static(__dirname + '/app'))

.use(express.static(__dirname + '/app'))

.use('/app', function(req, res){
	res.render('index.html');
})
.use(
	bodyParser.urlencoded(
		{
			extended: true
		})
)
.use(bodyParser.json())

.use('/api', router)

.listen(port);

console.log('port used : ' + port);
