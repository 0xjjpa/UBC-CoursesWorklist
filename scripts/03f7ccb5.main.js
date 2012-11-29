window.courseData = [
{
	name: "Introduction to Parallel Programming",
	faculty: "Science",
	id: "CPSC 418",
	terms: [1],
	status: "Full",	
	schedule: {days: ["Tue", "Thu"], hours: ["15:30", "16:00", "16:30"]}
},
{
	name: "Introduction to Human Computer Interaction",
	faculty: "Science",		
	id: "CPSC 344",
	terms: [1,2],
	status: "Open",	
	schedule: {days: ["Tue", "Thu"], hours: ["9:30", "10:00", "10:30"]}
},
{
	name: "Data Mining and Machine Learning",		
	faculty: "Science",
	id: "CPSC 314",
	terms: [1],
	status: "Open",	
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["15:00", "15:30"]}
},
{
	name: "Computer Graphics",		
	faculty: "Science",
	id: "CPSC 318",
	terms: [1,2],
	status: "Waitlist",	
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["9:00", "9:30"]}
},
{
	name: "Software Construction",		
	faculty: "Science",
	id: "CPSC 212",
	terms: [2],
	status: "Registered",	
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["11:00", "11:30"]}
},
{
	name: "Computing in the Life Sciences",		
	faculty: "Science",
	id: "CPSC 218",
	terms: [2],
	status: "Registered",	
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["9:00", "9:30"]}
},
{
	name: "Nanotechnology",		
	faculty: "Engineering",
	id: "CPEE 332",
	terms: [2],
	status: "Open",	
	schedule: {days: ["Tue", "Thu"], hours: ["14:00", "14:30", "15:00"]}
}
];

$(document).ready(function() {

	var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

	var Course = function(data, index) {
		data.checked = ko.observable(false);
		data.isFull = ko.observable(data.status == "Full" ? true : false);
		data.isWaitingList = ko.observable(data.status == "Waitlist" ? true : false);		
		data.isOpen = ko.observable(data.status == "Open" ? true : false);		
		data.isRegistered = ko.observable(data.status == "Registered" ? true : false);		
		data.id = data.id || data.courseId;
		data.color = ko.observable();

		data.nameWithId = (function() {
			return data.name + "- " + data.id;
		})();	

		if (data.isFull()) {
			data.color("red");			
		} else if (data.isWaitingList()) {
			data.color("gray");
		} else if (data.isRegistered()) {
			data.color("black");	
		} else {
			data.color(colors[index]);
		}
		return data;		
	}

	var Hour = function(hour, militarHour, index, days) {
		var self = {};

		self.hour = "";
		self.militarHour = 0;
		self.index = 0;
		self.days = [];
		self.color = ko.observable();

		self.init = function(hour, militarHour, index, days) {
			self.hour = hour;
			self.militarHour =  militarHour;
			self.index = index;
			self.color("white");

			days.unshift("");
			$.each(days, function(i, v){
				self.days.push( new Day(v, self.index, i) );
			});			
			return self;
		}

		return self.init(hour, militarHour, index, days);		
	}

	var Day = function(name, parentIndex, index) {
		var self = {};
		self.name = "";
		self.parentIndex = 0;
		self.index = 0;
		self.color = ko.observable("white");
		self.course = ko.observable({id: null});

		self.isFirstColumn = function(index) {			
			return (index() == 0)
		}

		self.init = function(name, parentIndex, index) {
			self.parentIndex =  parentIndex;
			self.index = index;
			self.name = name;
			return self;
		}

		return self.init(name, parentIndex, index);
	}

	var Timetable = function() {
		var self = {};

		var localeDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var minutesPerHour = 30;		
		var startClass = 800;
		var endClass = 2300;
		var hoursToDisplay = 20;

		self.hours = ko.observableArray([]);
		self.classesHours = ko.observableArray([]);
		self.minimumHourDisplay = ko.observable(startClass);
		self.maximumHourDisplay = ko.observable(endClass);
		self.days = []		

		var parseMilitarHourToString = function(militarHour) {
			var hour = parseInt(militarHour/100)
			var minutes =  militarHour%100;
			return hour + ":" + minutes;
		}

		self.parseStringHourToMilitar = function(stringHour) {
			var hourArray = stringHour.split(/:/ig);
			var hour = parseInt(hourArray[0]) * 100;
			var minutes = parseInt(hourArray[1]);
			return hour + minutes;
		}

		var loadHours = function(selfHours) {
			//@toDo Check minutesPerHour is not bigger than 60. If it is, floor it.
			var mH = minutesPerHour || 30;
			var minutesInDay = 60 * 24;
			var hours = [];
			var appendZero = false;
			var hour = "";
			var militarHour = 0;

			for (var i = 0; i < minutesInDay; i+=mH) {				
				militarHour = parseInt(i/60) * 100 + (i%60);			
				hour = parseMilitarHourToString(militarHour);				
				appendZero = i%60 == 0 ? true : false;
				if(appendZero) hour = hour + "0";											
				hours.push(new Hour(hour, militarHour, i/mH, localeDays.slice(0)));				
			}			
			selfHours(hours);
		}

		var loadClassesHours = function(selfHours, selfClassesHours) {
			var classesHours = [];
			var index = 0;
			classesHours = ko.utils.arrayFilter(selfHours(), function(hour) {
				return hour.militarHour > startClass && hour.militarHour < endClass && index++ < hoursToDisplay;
			})
			selfClassesHours(classesHours);
		}

		self.up = function() {			
			var minimumHourDisplay = self.minimumHourDisplay();
			if(minimumHourDisplay > startClass) {				
				var currentMinimumHour = self.classesHours()[0];			     			   
				var newMinimunHour = self.hours()[currentMinimumHour.index - 1];
				var newMaximumHour = self.classesHours()[self.classesHours().length - 2];
				self.minimumHourDisplay(newMinimunHour.militarHour);				
				self.maximumHourDisplay(newMaximumHour.militarHour);				
				self.classesHours.unshift(newMinimunHour);
				self.classesHours.pop();
			}
		}

		self.down = function() {
			var maximumHourDisplay = self.maximumHourDisplay();						
			if(maximumHourDisplay <= endClass) {				
				var currentMaximumHour = self.classesHours()[self.classesHours().length - 1];			     			   
				var newMaximumHour = self.hours()[currentMaximumHour.index + 1];
				var newMinimumHour = self.classesHours()[0];
				self.maximumHourDisplay(newMaximumHour.militarHour);				
				self.minimumHourDisplay(newMinimumHour.militarHour);				
				self.classesHours.push(newMaximumHour);
				self.classesHours.shift();
			}
		}

		self.init = function() {
			loadHours(self.hours);
			loadClassesHours(self.hours, self.classesHours);

			var days = (localeDays.slice(0));
			days.unshift(" ");	
			self.days = days;

			return self;
		}

		return self.init();		
	}

	var Search = function() {
		var self = {};
		self.input = ko.observable();

		self.backlog = ko.observableArray();
		self.results = ko.observableArray([]);
		self.maxResults = 10;

		self.containsElements = ko.computed(function() {
			return self.results().length > 0;
		});

		self.removeFromBacklog = function(course) {
			self.backlog.remove(course);
		}

		self.addToBacklog = function(course) {
			self.backlog.push(course);
		}

		self.cleanInput = function() {
			self.input("");
			self.results.removeAll();
		}

		self.input.subscribe(function(value) {
			var resultsCounter = 0;			
			if (value.length === 0) { self.cleanInput(); return; }
			var results = ko.utils.arrayFilter(self.backlog(), function(course) {
				if(resultsCounter >= self.maxResults) {
					return false;
				}
				resultsCounter++;				
				var courseName = course.name + " " + course.id;
				var keywords = courseName.split(/\W+/g);
				var word = "";
				for(var i = 0; i < keywords.length; i++) {
					word = keywords[i].toLowerCase();							
					if (word.indexOf(value.toLowerCase()) >= 0) return true;
				}
				return false;				
			});

			self.results(results);		
		});

		self.parseCourses = function(rawCourses) {				
			var parsedCourses = $.map(rawCourses, function(rawCourse, index){ 
				return new Course(rawCourse.attributes, index);
			});

			self.backlog(parsedCourses);
		}

		self.load = function() {
			Parse.initialize("s5XRK5EQxsoLQ7bd9lIz35fqKaWHTTNQwQCXkr3O", "8sYc7dACntCwXHSMC3qJ4TaTO8k3DgKuVl0wOQc9");
			var coursesParse = Parse.Object.extend("courses");
			var query = new Parse.Query(coursesParse);			
			query.find({
				success: self.parseCourses,
				error: function(error) {
					console.log("Connection error with the database.");
				}
			});
		}

		self.mockLoad = function() {
			var parsedCourses = $.map(window.courseData, function(course, index){ return new Course(course, index); });
			self.backlog(parsedCourses);
		};


		self.init = function() {
			//self.load();
			//self.mockLoad();
			return self;
		}

		return self.init();
	}

	var Worklist = function (index) {
		var self = {};

		self.isActive = ko.observable(true);
		self.name = ko.observable("");
		self.label = ko.observable("");
		self.timetable = ko.observable({});
		self.search = ko.observable({});
		self.courses = ko.observableArray([]);

		self.hasConflict = ko.observable(false);
		self.courseConflictA = ko.observable();
		self.courseConflictB = ko.observable();
		self.courseConflictAName = ko.observable();
		self.courseConflictBName = ko.observable();

		self.hasCourses = ko.computed(function() {
			return self.courses().length > 0;
		})

		self.paintCourseInTimetable = function(course, operation) {
			var timetable = self.timetable();
			var courseDays = course.schedule.days;
			var courseHours = course.schedule.hours;

			var indexesHours = [];
			
			$.each(courseHours, function(i, courseHour) {
				$.each(timetable.hours(), function(j, hour) {
					if(hour.hour == courseHour) indexesHours.push(j);
				}) 								
			})

			var indexesDays = [];
			var sampleDays = timetable.hours()[0].days;
			$.each(courseDays, function(i, courseDay) {
				$.each(sampleDays, function(j, day) {
					if(day.name == courseDay) indexesDays.push(j);
				})				
			})
			
			var weekDays = []
			$.each(indexesHours, function(i, hourIndex) {
				weekDays = timetable.hours()[hourIndex].days;
				$.each(weekDays, function(j, day) {
					$.each(indexesDays, function(k, indexDay) {
						if(day.index == indexDay) {
							var courseGivenInDay = day.course;							
							if(operation == "Repaint") {
								day.color("black")
							} else {
								if(courseGivenInDay().id && operation === "Add") {								
									day.color("red")
									self.courseConflictA(courseGivenInDay());
									self.courseConflictB(course);
									self.courseConflictAName(" " +courseGivenInDay().name+ " ");
									self.courseConflictBName(" " + course.name + " ");
									self.hasConflict(true);								
								} else {
									if(operation === "Add" && !self.hasConflict()) {
										day.course(course);
										day.color(course.color());								
									}

									if(operation === "Remove") {
										day.course({id:null});
										day.color("white");								
									}										
								}
							}							
						}
					})
				})				
			});
			
		}

		self.updateLabel = function() {
			self.label = self.name().replace(/ /ig, "_");
		}

		self.parseCourses = function(rawCourses) {				
			var course;
			var courses = [];
			var faculties = {};
			$.each(rawCourses, function(index, rawCourse) {
				$.extend(true, rawCourse.attributes, {parseId: rawCourse.id})
				course = new Course(rawCourse.attributes, index);				
				faculties[course.faculty] = 1;

				var backlog = self.search().backlog();
				if(course.isRegistered()) {
					self.paintOver(course);
				} else {
					courses.push(course);
				}
			});

			self.search().backlog(courses);
		}

		self.load = function() {
			Parse.initialize("s5XRK5EQxsoLQ7bd9lIz35fqKaWHTTNQwQCXkr3O", "8sYc7dACntCwXHSMC3qJ4TaTO8k3DgKuVl0wOQc9");
			var coursesParse = Parse.Object.extend("courses");
			var query = new Parse.Query(coursesParse);			
			query.find({
				success: self.parseCourses,
				error: function(error) {
					console.log("Connection error with the database.");
				}
			});
		}

		self.mockLoad = function() {			
			var rawCourses = [];
			$.each(window.courseData, function(index, course) {
				var mock = new Object;
				mock.attributes = course;
				rawCourses.push(mock);	
			})			
			self.parseCourses(rawCourses);
		}
		
		self.init = function(index) {
			var name = "Worklist " + index;
			self.name = ko.observable(name);

			self.updateLabel();
			self.timetable = ko.observable( new Timetable() );	
			self.search = ko.observable( new Search() );	

			//self.mockLoad();
			self.load();
			return self;
		}

		self.paintOver = function(course) {			
			self.paintCourseInTimetable(course, 'Add');
		}

		self.paintOut = function(course) {	
			if (!self.hasConflict()) {
				self.paintCourseInTimetable(course, 'Remove');	
			} else {
				self.paintCourseInTimetable(course, 'Repaint');
			}
			self.hasConflict(false);
		}

		self.addCourse = function(course) {			
			self.courses.push(course);
			var searchGUI = self.search();
			self.paintCourseInTimetable(course, 'Add');
			searchGUI.removeFromBacklog(course);			
			searchGUI.cleanInput();
			return false;
		}

		self.removeCourse = function(course) {
			var addBecauseOfConflict = false;
			if(self.courseConflictB() == course) {
				addBecauseOfConflict = true;
			}

			self.courses.remove(course);
			var searchGUI = self.search();
			self.paintCourseInTimetable(course, 'Remove');
			searchGUI.addToBacklog(course);

			self.hasConflict(false);
			self.paintOver(self.courseConflictA());

		}

		return self.init(index);		
	}

	var WorklistViewModel = function() {
		var self = this;
		
		self.currentWorklist = ko.observable({});
		self.worklists = ko.observableArray([]);		

		self.copyActive = function() {			
			var courses = self.currentWorklist().courses();			
			var worklist = new Worklist(self.worklists().length+1);

			for(var i = 0; i< courses.length; i++) {
				worklist.addCourse(courses[i]);
			}
			
			worklist.name(worklist.name() + " (Copy)");
			worklist.updateLabel();
			
			console.log(worklist.courses());
			
			self.currentWorklist(worklist);			
			self.worklists.push(worklist);
			self.selectWorklist(worklist);
		}

		self.addWorklist = function() {
			var worklist = new Worklist(self.worklists().length+1);
			self.currentWorklist(worklist);			
			self.worklists.push(worklist);
			self.selectWorklist(worklist);
		}

		self.selectWorklist = function(worklist) {
			var worklists = self.worklists();		
			for (var i = 0; i < worklists.length; i++) {
				worklists[i].isActive(false);
			}
			worklist.isActive(true);
			self.currentWorklist(worklist);
		}

		self.register = function() {
			var worklist = self.currentWorklist();
			var courses = worklist.courses();
			var coursesToRegister = [];
			if(!courses.length) { alert("Please select at least one course to your worklist."); return; }
			for (var i = 0; i < courses.length; i++) {
				if(courses[i].checked()) coursesToRegister.push(courses[i]);
			}
			if(!coursesToRegister.length) { alert("Please check the courses to register."); return; }
			if(worklist.hasConflict()) { alert("You can't register"+worklist.courseConflictBName()+"because it has a conflict. Please remove it."); return; }

			var confirmationMessage = "";
			for (var j = 0; j < coursesToRegister.length; j++) {
				confirmationMessage += coursesToRegister[j].name + ", ";
			}
			result = confirm("Are you sure you want to register: "+ confirmationMessage);
			if(result) {
				var parseBatchArray = $.map(coursesToRegister, function(course, index){
					return {
						"method": "PUT",
						"path": "/1/classes/courses/"+course.parseId,
						"body": {
							"status": "Registered"
						}
					}
				});

				var putMessageData = {
					"requests": parseBatchArray
				}

				var putMessageRESTOptions = {
					url: "https://api.parse.com/1/batch",
					type: "POST",
					dataType: "json",
					data: JSON.stringify(putMessageData),
					beforeSend: function(xhr){
						xhr.setRequestHeader('X-Parse-Application-Id', 's5XRK5EQxsoLQ7bd9lIz35fqKaWHTTNQwQCXkr3O');
						xhr.setRequestHeader('X-Parse-REST-API-Key', '99zJUQTnqandl08VrT2cZVB6wgbkEcR6mxmZfRdV');
						xhr.setRequestHeader('Content-Type', 'application/json');
					},
					success: function(data) { console.log("SUCCESS"); alert("You course was registered successfully."); window.location.reload(); },
					error: function(data) { console.log("ERROR"); console.log(data); }
				}

				$.ajax(putMessageRESTOptions);
			}
			return false;
		}

		self.init = function() {			
			self.addWorklist();
		}
		

		return self.init();
	}




	ko.applyBindings(new WorklistViewModel(), document.getElementById("worklist"));
})