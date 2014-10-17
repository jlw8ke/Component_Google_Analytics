var yeoman = require('yeoman-generator'),
chalk = require('chalk'),
fs = require('fs'),
path = require('path'),
self

//Chalk themes
var info = chalk.bold.magenta
var error_light = chalk.red
var error = chalk.bold.red
var warning = chalk.bold.yellow
var success = chalk.bold.green

var internet_permission = "<uses-permission android:name=\"android.permission.INTERNET\" />"
var network_state_permission = "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />"

var manifest_location = "./app/src/main/AndroidManifest.xml"
var xml_directory_location = "./app/src/main/res/xml/"
var res_directory_location = "./app/src/main/res"
var gradle_location = "./app/build.gradle"

var gps_check="com.google.android.gms.version"
var gps_meta_data = "<meta-data android:name=\"com.google.android.gms.version\"\n\t\tandroid:value=\"@integer/google_play_services_version\" />"
var gps_dependency = "compile \"com.google.android.gms:play-services:6.1.+\""
var analyticsGenerator = yeoman.generators.Base.extend({
	greet: function() {
    	this.log(info("This component will configure the dependencies and boilerplate needed for google analytics"))
    	this.log(info("Please make sure you are in your project's root directory"))
	}, 
	init: function() {
		self = this
		this.trackers = new Array()
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
	confirmAndroidProject: function() {
		var in_root = fs.existsSync('settings.gradle')
		var manifest_exists = fs.existsSync(manifest_location)
		var gradle_exists = fs.existsSync(gradle_location)
		var res_exists = fs.existsSync(res_directory_location)

		fail = function(file_name, messages) {
			self.log('\n'+warning(file_name) + error(" not found"))
			messages.forEach(function (message) {
				self.log(error(message))
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
			this.proguard = answers.proguard
			this.proguard_location = answers.proguard_location
			done()
		})
	}, 
	promptForTrackers: addTracker,
	addManifestDependencies: function() {
		this.conflicter.force = true	
		var manifest = this.readFileAsString(manifest_location)
		var manifest_begin = manifest.indexOf("<application")	

		this.log(success("Adding google play services meta-data..."))
		if(!manifest.compress().contains(gps_check)) {
			manifest = manifest.insert(gps_meta_data+'\n\n', manifest_begin )
		}

		this.log(success("Adding permissions to the manifest..."))
		if(!manifest.compress().contains(network_state_permission.compress())) {
			manifest = manifest.insert(network_state_permission+'\n\n\t', manifest_begin)
		}
		if(!manifest.compress().contains(internet_permission.compress())) {
			manifest = manifest.insert(internet_permission+'\n\n\t', manifest_begin)
		}
		
		this.log(manifest)
		this.write(manifest_location, manifest)
	},
	addGradleDependencies: function() {
		var gradle_file = this.readFileAsString(gradle_location)
		var dependency_start = gradle_file.indexOf("dependencies")
		dependency_start = gradle_file.indexOf("{", dependency_start)+1
		
		this.log(success("Adding google play services to gradle dependencies..."))
		if(!gradle_file.compress().contains(gps_check)) {
			gradle_file = gradle_file.insert('\n\t'+gps_dependency+'\n\n', dependency_start+1)
		}

		this.log(gradle_file)
		this.write(gradle_location, gradle_file)
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
				return error_light("You need to name your tracker")
			}
			if(fs.existsSync(pathLoc) || 
				self.trackers.indexOf(filteredInput) > -1) {
				return error_light("File already exists")
			}
			var pass = input.match("^([a-z|A-Z])+$")
			if(!pass) {
				return error_light("Invalid tracker name")
			}
			return true
		},
		filter : function(rawInput) {
			var done = this.async()
			setTimeout(done(filterInput(rawInput)) , 100)
		}
	}], function (answers) {
		if(answers.tracker === "q") {
			self.log(self.trackers)
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

//String utility functions
String.prototype.contains = function(s) {
	return this.indexOf(s) > -1
}

String.prototype.insert = function(data, index) {
	return this.substring(0,index) 
		+ data
		+ this.substring(index)
}

String.prototype.compress = function() {
	return this.replace(/ /g, "").replace(/"/g,"").replace(/'/g,"")
}

module.exports = analyticsGenerator