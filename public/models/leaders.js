var mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	username: String,
	highScore: Number
});

module.exports = mongoose.model('user', userSchema);