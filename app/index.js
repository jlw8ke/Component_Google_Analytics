var string_utils = require('./string_utils')
var yeoman = require('yeoman-generator'),
chalk = require('./chalk_themes'),
fs = require('fs'),
path = require('path'),
self

var manifest_location = "./app/src/main/AndroidManifest.xml"
var xml_directory_location = "./app/src/main/res/xml/"
var res_directory_location = "./app/src/main/res"
var gradle_location = "./app/build.gradle"

var analyticsGenerator = yeoman.generators.Base.extend({
	greet: function() {
    	this.log(chalk.info("This component will configure the dependencies and boilerplate needed for google analytics"))
    	this.log(chalk.info("Please make sure you are in your project's root directory"))
	}, 
	init: function() {
		self = this
		this.trackers = new Array()
		this.on('end', function (code)  {
			this.log('\n')
			if(code != false) {
				this.log(chalk.success("Finished configuring google analytics"))
				this.log('\n')
			} else {
				this.log(chalk.error("Failed to configure google analytics"))
				this.log('\n')
				process.exit(1)
			}
		})	
	},
	confirmAndroidProject: function() {
		var in_root = fs.existsSync('settings.gradle')
		var manifest_exists = fs.existsSync(manifest_location)
		var gradle_exists = fs.existsSync(gradle_location)
		var res_exists = fs.existsSync(res_directory_location)

		fail = function(file_name, messages) {
			self.log('\n'+warning(file_name) + error(" not found"))
			messages.forEach(function (message) {
				self.log(chalk.error(message))
			})
			self.emit('end', false)
		}
		if(!in_root) {
			fail('settings.gradle', "Are you in the android project's root directory?")
		} else if(!manifest_exists) {
			fail(manifest_location, ["Are you in the android project's root directory?",
					"Is the manifest in the correct location?"])
		} else if(!gradle_exists) {
			fail(gradle_location, ["Are you in the android project's root directory?",
					"Is the app gradle file in the correct location?"])
		} else if(!res_exists) {
			fail(res_directory_location, ["Are you in the android project's root directory?",
					"Is the res folder in the correct location?"])
		}
	}, 
	promptTask: function() {
		var prompts = [{
			type : 'confirm',
			name : 'proguard',
			message : 'Generate Proguard?'
		}, {
			when : function(response) { return response.proguard },
			name : 'proguard_location',
			message : "Where is the proguard file?",
			default : './app/proguard-rules.pro',
			validate : function(input) {
				if(fs.existsSync(input)) {
					return true
				} else {
					return "Please enter a valid path"
				}
			}
		}]
		var done = this.async()
		this.prompt(prompts, function (answers) {
			self.proguard = answers.proguard
			self.proguard_location = answers.proguard_location
			done()
		})
	}, 
	promptForTrackers: addTracker,
	addManifestDependencies: function() {
		this.conflicter.force = true	
		var manifest_file = this.readFileAsString(manifest_location)
		var manifest_begin = manifest_file.indexOf("<application")	

		var manifest = self.read("_manifest.xml").trim().split('\n')
		manifest.forEach(function (entry) {
			if(!string_utils.contains(manifest_file, entry)) {
				manifest_file = string_utils.insert(manifest_file, entry+'\n', manifest_begin)
			}
		})
		
		this.log(chalk.success("Adding metadata and permissions to manifest..."))
		this.write(manifest_location, manifest_file)
	},
	addGradleDependencies: function() {
		var gradle_file = this.readFileAsString(gradle_location)
		var dependency_start = gradle_file.indexOf("{", gradle_file.indexOf("dependencies"))+1

		var gradle = self.read("_build.gradle").trim().split('\n')		
		gradle.forEach(function (entry) {
			if(!string_utils.contains(gradle_file, entry)) {
				gradle_file = string_utils.insert(gradle_file, '\n\t'+entry+'\n', dependency_start)
			}
		}) 

		this.log(chalk.success("Adding google play services to gradle dependencies..."))
		this.write(gradle_location, gradle_file)
	},
	createProguard: function() {
		if(this.proguard) {
			this.log(chalk.success("Creating proguard file..."))
			var proguard_file = this.readFileAsString(this.proguard_location)
			var proguard = this.read("_proguard.pro").split('-')
			proguard.forEach(function (entry) {
				if(!string_utils.contains(proguard_file, entry)) {
					proguard_file = proguard_file.concat('-'+entry)
				}
			})
			this.write(this.proguard_location, proguard_file)
		}
	}, 
	createTrackers: function() {
		if(this.trackers.length > 0) {
			this.log(chalk.success("Creating trackers..."))
			this.trackers.forEach(function (tracker) {
				self.log(chalk.success_light("Creating tracker: " + tracker) )
				self.copy("_tracker.xml", xml_directory_location+tracker+".xml")
			})
			this.log('\n')
		}
	}
})


//Recursive prompt to add trackers
function addTracker() {
	var done = self.async()
	self.prompt([{
		type : 'input',
		name : 'tracker',
		message : 'What is the tracker name: (q to finish)',
		validate : function(input) {
			var filteredInput = filterInput(input)
			var pathLoc = xml_directory_location.concat(filteredInput, ".xml")
			if(!input) {
				return chalk.error_light("You need to name your tracker")
			}
			if(fs.existsSync(pathLoc) || 
				self.trackers.indexOf(filteredInput) > -1) {
				return chalk.error_light("File already exists")
			}
			var pass = input.match("^([a-z|A-Z])+$")
			if(!pass) {
				return chalk.error_light("Invalid tracker name")
			}
			return true
		},
		filter : function(rawInput) {
			return filterInput(rawInput)
		}
	}], function (answers) {
		if(answers.tracker === "q") {
			done()
		} else {
			this.trackers.push(answers.tracker)
			addTracker()
		}
	}.bind(self))
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

module.exports = analyticsGenerator