var yeoman = require('yeoman-generator'),
execSync = require("exec-sync"),
path = require('path'),
self

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
	}	
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

