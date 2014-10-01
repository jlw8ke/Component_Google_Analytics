var yeoman = require('yeoman-generator'),
spawn = require('child_process').spawn,
path = require('path'),
self

module.exports = yeoman.generators.Base.extend({
	downloadSdk:function() {
		self = this
		runScript("add_analytics_dependency.sh")		
	}, 
	updatePermissions:function() {
		runScript("update_permissions.sh")
	}
})

function runScript(name) {
	var file_loc = path.join(__dirname, name)
	var script = spawn(file_loc)
	script.stdout.on('data', function (data) {
		console.log('' + data);
	});
	script.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});	
}
