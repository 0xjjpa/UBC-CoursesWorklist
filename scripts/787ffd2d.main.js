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
	status: "Open",
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["11:00", "11:30"]}
},
{
	name: "Computing in the Life Sciences",		
	faculty: "Science",
	id: "CPSC 218",
	terms: [2],
	status: "Full",
	schedule: {days: ["Mon", "Wed", "Fri"], hours: ["9:00", "9:30"]}
}
];

$(document).ready(function() {

	var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

	var Course = function(data, index) {		
		data.checked = ko.observable(false);
		data.isFull = ko.observable(data.status == "Full" ? true : false);
		data.isWaitingList = ko.observable(data.status == "Waitlist" ? true : false);		

		if (data.isFull()) {
			data.color = "#B94A48";			
		} else if (data.isWaitingList()) {
			data.color = "gray";
		} else {
			data.color = colors[index];
		}
		return data;		
	}

	var Hour = function(hour, militarHour, index, days) {
		var self = {};

		self.hour = "";
		self.militarHour = 0;
		self.index = 0;
		self.days = [];

		self.init = function(hour, militarHour, index, days) {
			self.hour = hour;
			self.militarHour =  militarHour;
			self.index = index;
			self.color = "white";

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

		self.backlog = ko.observableArray($.map(window.courseData, function(course, index){ return new Course(course, index); }));
		self.results = ko.observableArray([]);

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
			if (value.length === 0) { self.cleanInput(); return; }
			var results = ko.utils.arrayFilter(self.backlog(), function(course) {
				var courseName = course.name;
				var keywords = courseName.split(/\W+/g);
				var word = "";
				for(var i = 0; i < keywords.length; i++) {
					word = keywords[i].toLowerCase();							
					if (word.indexOf(value.toLowerCase()) >= 0) return true;
				}
				return false;				
			});

			self.results(results);		
		})

		return self;
	}

	var Worklist = function (index) {
		var self = {};

		self.isActive = ko.observable(true);
		self.name = ko.observable("");
		self.label = ko.observable("");
		self.timetable = ko.observable({});
		self.search = ko.observable({});
		self.courses = ko.observableArray([]);

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
							if(!courseGivenInDay.id || operation === "Remove") {
								if(operation === "Add") {
									day.course(course);
									day.color(course.color);	
								} else {
									day.course({id:null});
									day.color("white");
								}								
							} else {
								alert("Conflict");
							}
						}
					})
				})				
			});
			
		}

		self.updateLabel = function() {
			self.label = self.name().replace(/ /ig, "_");
		}
		
		self.init = function(index) {
			var name = "Worklist " + index;
			self.name = ko.observable(name);

			self.updateLabel();
			self.timetable = ko.observable( new Timetable() );	
			self.search = ko.observable( new Search() );	
			return self;
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
			self.courses.remove(course);
			var searchGUI = self.search();
			self.paintCourseInTimetable(course, 'Remove');
			searchGUI.addToBacklog(course);

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
			
			var confirmationMessage = "";
			for (var j = 0; j < coursesToRegister.length; j++) {
				confirmationMessage += coursesToRegister[j].name + ", ";
			}
			result = confirm("Are you sure you want to register: "+ confirmationMessage);
			if(result) alert("Demo is completed. Thank you.");
			return false;
		}

		self.init = function() {			
			self.addWorklist();
		}
		

		return self.init();
	}




	ko.applyBindings(new WorklistViewModel(), document.getElementById("worklist"));
})