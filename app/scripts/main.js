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

	var Course = function(data) {		
		data.checked = ko.observable(false);
		data.isFull = ko.observable(data.status == "Full" ? true : false);
		data.isWaitingList = ko.observable(data.status == "Waitlist" ? true : false);
		data.color = colors.shift();
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


	var WorklistViewModel = function() {
		var self = this;
		self.backlog = ko.observableArray([]);
		self.store = ko.observableArray([]);
		self.timetable = ko.observable({});

		self.isStoreEmpty = ko.computed(function(){			
			return self.store().length === 0;
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

		self.init = function() {
			self.backlog = ko.observableArray($.map(window.courseData, function(course){ return new Course(course); }));
			self.timetable = ko.observable( new Timetable() );	
			return self;
		}

		self.addDown = function() {
			var backlog = self.backlog();
			var store = [];
			$.each(backlog, function(i, v) {
				if(v.checked()) { self.paintCourseInTimetable(v, "Add"); store.push(v); self.store.push(v); }
			})									
			self.backlog.removeAll(store);
		};

		self.addUp = function() {
			var store = self.store();
			var backlog = [];
			$.each(store, function(i, v) {				
				if(v.checked()) { self.paintCourseInTimetable(v, "Remove"); backlog.push(v); self.backlog.push(v); }	
			})
			self.store.removeAll(backlog);
		}

		self.allDown = function() {
			var backlog = self.backlog.removeAll();
			$.each(backlog, function(i, v) {
				if(v.status !== "Full") {
					self.paintCourseInTimetable(v, "Add");
					self.store.push(v);	
				} else {
					self.backlog.push(v);
				}				
			})			
		}

		self.allUp = function() {
			var store = self.store.removeAll();
			$.each(store, function(i, v) {
				if(v.status !== "Full") {
					self.paintCourseInTimetable(v, "Remove");
					self.backlog.push(v);					
				} else {
					self.store.push(v);
				}
			})			
		}

		self.removeFromBacklog = function(course) {
			self.backlog.remove(course);
		}

		return self.init();
	}




	ko.applyBindings(new WorklistViewModel(), document.getElementById("worklist"));
})