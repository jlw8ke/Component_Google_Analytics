//String utility functions
module.exports = {
	contains : function(string, data) {
		return compress(string).indexOf(compress(data)) > -1
	},

	insert : function(source, data, index) {
		return source.substring(0,index) 
		+ data
		+ source.substring(index)
	}
}

function compress (string) {
	return string.replace(/ /g, "").replace(/"/g,"").replace(/'/g,"")
}