'use strict';

var	mongoose	= require('mongoose'),
	Schema	= mongoose.Schema,
	typesOpe	= ['cb', 'cheque', 'mobile', 'internet', 'desk'],
	InOut		= ['credit', 'debit'];


var opeSchema = new Schema({
	date : {
		type : Date, 
		default: new Date()
	},
	amount : {
		type: Number, 
		required : true, 
		min : 1
	},
	type : {
		type: String, 
		enum: typesOpe, 
		required: true, 
		lowercase: true
	},
	InOut: {
		type: String, 
		enum: InOut, 
		required: true, 
		lowercase: true
	},
	sucess: {
		type: Boolean,
		required: true,
		default: true
	}
});

module.exports = mongoose.model('Ope', opeSchema); 
