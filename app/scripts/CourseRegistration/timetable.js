/**
* REST based Module for Managing the Course Registration of a Student Resource.
* @module CourseRegistration
* @author jjperezaguinaga
**/

var CourseRegistration = (function(c, undefined) {
	var config = {};


	/**
	* An Error class for our Timetable error.
	* @class TimetableError
	* @constructor
	* @private
	**/
	var TimetableError = function(message) {
		this.name = "TimetableError";
		this.message = message;
	}

	/**
	* The Timetable is a widget that displays the courses of a Student Resource within specific Days and Hours
	* @class Timetable
	* @constructor
	**/
	c.Timetable = function() {
		TimetableError.prototype = new Error();
		TimetableError.prototype.constructor = TimetableError;

		this.days = config.days;
		try {
			if(!this.days) {
				throw new TimetableError("[Config] Days were not given by the configuration")
			}	
		} catch(e) {
			
		}
		
	}

	c.Timetable.prototype.method_name = function(first_argument) {
		// body...
	};

})(CourseRegistration || {})