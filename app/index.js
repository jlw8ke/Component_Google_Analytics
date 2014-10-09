var yeoman = require('yeoman-generator'),
execSync = require('exec-sync'),
path = require('path'),
fs = require('fs'),
trackers = new Array(),
self


module.exports = yeoman.generators.Base.extend({
	setupGooglePlayServices:function() {
		self = this
		runScript("add_analytics_dependency.sh")
	}, 
	updatePermissions:function() {
		runScript("update_permissions.sh")		
	},
	promptProguard:function() {
		var done = this.async()
		this.prompt([{
			type : 'confirm',
			name : 'proguard',
			message : 'Generate Proguard?'
		}, {
			when : function(response) { return response.proguard },
			name : 'proguard_location',
			message : "Where is the proguard file?",
			default : './app/proguard-rules.pro'
		}], function (answers) {
			if(answers.proguard) {
				runScript("setup_proguard.sh", [answers.proguard_location])
			}
			done()
		}.bind(this))
	},
	promptTrackerGeneration: addTracker
})

function addTracker() {
	var done = self.async()
	self.prompt([{
		type : 'input',
		name : 'tracker',
		message : 'What is the tracker name: (q to finish)',
		validate : function(input) {
			filteredInput = filterInput(input)
			pathLoc = "./app/src/main/res/xml/".concat(filteredInput, ".xml")
			if(!input) {
				return "You need to name your tracker"
			}
			if(fs.existsSync(pathLoc) || 
				trackers.indexOf(filteredInput) > -1) {
				return "Tracker already exists"
			}
			var pass = input.match("^([a-z|A-Z])+$")
			if(!pass) {
				return "Invalid tracker name"
			}
			return true
		},
		filter : function(rawInput) {
			var done = this.async()
			setTimeout(done(filterInput(rawInput)) , 100)
		}
	}], function (answers) {
		if(answers.tracker === "q") {
			runScript("init_trackers.sh", trackers)
			done()
		} else {
			trackers.push(answers.tracker)
			addTracker()
			done()
		}
	}.bind(self))
}

function runScript(name, params) {
	var file_loc = path.join(__dirname, name)
	var paramsString = ""
	if(params) {
		paramsString = params.toString().replace(/,/g, " ")
	}
	var script = execSync(file_loc.concat(" "+paramsString))
	process.stdout.write(script)
	process.stdout.write('\n')	
}

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

