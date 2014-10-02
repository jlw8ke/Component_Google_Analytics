var yeoman = require('yeoman-generator'),
execSync = require("exec-sync"),
path = require('path'),
self,
trackers = new Array()

module.exports = yeoman.generators.Base.extend({
	downloadSdk:function() {
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

function runScript(name, params) {
	var file_loc = path.join(__dirname, name)
	var paramsString = ""
	if(params) {
		paramsString = params.toString().replace(",", " ")
	}
	var script = execSync(file_loc.concat(" "+paramsString))
	process.stdout.write(script)
	process.stdout.write('\n')	
}

function addTracker() {
	var done = self.async()
	self.prompt([{
		type : 'input',
		name : 'tracker',
		message : 'What is the tracker name: (q to finish)',
		validate : function(input) {
			var done = this.async()
			setTimeout(function() {
				if(!input) {
					done("You need to name your tracker")
					return
				}
				done(true)
			}, 10)
		}
	}], function (answers) {
		if(answers.tracker === "q") {
			self.log(trackers)
			done()
		} else {
			trackers.push(answers.tracker)
			addTracker()
			done()
		}
	}.bind(self))
}

