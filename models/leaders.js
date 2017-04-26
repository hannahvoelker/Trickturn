var mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	username: String,
	highScore: Number
});
mongoose.Promise = require('q').Promise;
// assert.ok(query.exec() instanceof require('q').makePromise);


module.exports = mongoose.model('User', userSchema);