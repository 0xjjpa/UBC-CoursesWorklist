/**
* Utils Module. Helper utilities for our Course Registratino System.
* @module CourseRegistration
* @author jjperezaguinaga
**/

var CourseRegistration = (function(c, undefined) {
	var config = {};

	/**
	* Helper Console method to register both the Error name and message
	* @event log
	* @for Error
	**/
	Error.prototype.log = function() {
		console.log("ERROR: " + this.name + ": " + this.message);
	};

})(CourseRegistration || {})