'use strict';

var express				= require('express'),
	app					= express(),
	bodyParser			= require('body-parser'),
	port				= process.env.PORT || 8080, 
	router				= require('./api/routes'), 
	mongoose   		= require('mongoose');

mongoose.connect('mongodb://<account>:<password>@<server>/ca_42'); // connect to our database, login are precious, so I keep them ;)

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
