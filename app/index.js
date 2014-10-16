var yeoman = require('yeoman-generator'),
chalk = require('chalk'),
fs = require('fs'),
self

//Chalk themes
var info = chalk.bold.magenta
var error = chalk.bold.red
var warning = chalk.bold.yellow
var success = chalk.bold.green

var analyticsGenerator = yeoman.generators.Base.extend({
	greet: function() {
    	this.log(info("This component will configure the dependencies and boilerplate needed for google analytics"))
    	this.log(info("Please make sure you are in your project's root directory"))
	}, 
	init: function() {
		self = this
		this.on('end', function (code)  {
			this.log('\n')
			if(code != false) {
				this.log(success("Finished configuring google analytics"))
				this.log('\n')
			} else {
				this.log(error("Failed to configure google analytics"))
				this.log('\n')
				process.exit(1)
			}
		})
	},
	confirmInAndroidProject: function() {
		var exists = fs.existsSync('settings.gradle')
		if(!exists) {
			this.log('\n'+warning("settings.gradle") + error(" not found"))
			this.log(error("Are you in the android project's root directory?"))
			this.emit('end', false)
		}
		this.log("am i the real life?")

	}
})



function filterInput(rawInput) {
	var input
	if(rawInput.length > 1) {
		input = rawInput.substring(0,1).toLowerCase() + rawInput.substring(1).replace(/[A-Z]/g, function x() {
			return "_"+arguments[0].toString().toLowerCase()
		})
	} else {
		input = rawInput.toLowerCase()
	}
	return input
}

module.exports = analyticsGenerator

