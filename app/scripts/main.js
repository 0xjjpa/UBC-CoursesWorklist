window.courseData = [
	{
		name: "Introduction to Parallel Programming",
		faculty: "Science",
		id: "CPSC 418",
		terms: [1],
		status: "Full"
	},
	{
		name: "Introduction to Human Computer Interaction",
		faculty: "Science",		
		id: "CPSC 344",
		terms: [1,2],
		status: "Open"
	},
	{
		name: "Data Mining and Machine Learning",		
		faculty: "Science",
		id: "CPSC 314",
		terms: [1],
		status: "Open"
	},
	{
		name: "Computer Graphics",		
		faculty: "Science",
		id: "CPSC 318",
		terms: [1,2],
		status: "Waitlist"
	},
	{
		name: "Software Construction",		
		faculty: "Science",
		id: "CPSC 212",
		terms: [2],
		status: "Open"
	},
	{
		name: "Computing in the Life Sciences",		
		faculty: "Science",
		id: "CPSC 218",
		terms: [2],
		status: "Full"
	}
];

$(document).ready(function() {

	var Course = function(data) {			
		data.checked = ko.observable(false);
		return data;		
	}

	var Day = function(name, hours) {
		var self = {};
		self.name = "";
		self.hours = [];

		self.isFirstColumn = function(index) {			
			return (index() == 0)
		}
			
		self.init = function(name, hours) {
			self.name = name;
			self.hours = hours;	
			return self;
		}
		
		return self.init(name, hours);
	}

	var Timetable = function() {
		var self = {};


		var localeDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var minutesPerHour = 30;		
		var startClass = 700;
		var endClass = 2300;
		var hoursToDisplay = 10;

		self.days = [];
		self.hours = ko.observableArray([]);
		self.classesHours = ko.observableArray([]);
		self.minimumHourDisplay = ko.observable(startClass);
		self.maximumHourDisplay = ko.observable(endClass);		

		var parseMilitarHourToString = function(militarHour) {
			var hour = parseInt(militarHour/100)
			var minutes =  militarHour%100;
			return hour + ":" + minutes;
		}

		var parseStringHourToMilitar = function(stringHour) {
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
				hours.push({hour:hour, militarHour:militarHour, index: i/mH});
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

		self.panelClassesHours = ko.computed(function() {			
			return ko.utils.arrayFilter(self.hours(), function(hour) {
				return hour.militarHour > self.minimumHourDisplay() && hour.militarHour < self.maximumHourDisplay();
			})
		})

		self.up = function() {			
			var minimumHourDisplay = self.minimumHourDisplay();
			console.log(minimumHourDisplay);	
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
			localeDays.unshift("");
			$.each(localeDays, function(i, v){
				self.days.push( new Day(v, self.hours) );
			});
			return self;
		}

		return self.init();		
	}
		

	var WorklistViewModel = function() {
		var self = this;
		self.backlog = ko.observableArray([]);
		self.store = ko.observableArray([]);
		self.timetable = ko.observable({});

		self.init = function() {
			self.backlog = ko.observableArray($.map(window.courseData, function(course){ return new Course(course); }));
			self.timetable = ko.observable( new Timetable() );	
			return self;
		}

		self.addDown = function() {
			var backlog = self.backlog();
			var store = [];
			$.each(backlog, function(i, v) {
				if(v.checked()) { store.push(v); self.store.push(v); }
			})									
			self.backlog.removeAll(store);
		};

		self.addUp = function() {
			var store = self.store();
			var backlog = [];
			$.each(store, function(i, v) {				
				if(v.checked()) { backlog.push(v); self.backlog.push(v); }	
			})
			self.store.removeAll(backlog);
		}

		self.allDown = function() {
			var backlog = self.backlog.removeAll();
			$.each(backlog, function(i, v) {
				self.store.push(v);
			})			
		}

		self.allUp = function() {
			var store = self.store.removeAll();
			$.each(store, function(i, v) {
				self.backlog.push(v);
			})			
		}

		self.removeFromBacklog = function(course) {
			self.backlog.remove(course);
		}

		return self.init();
	}




	ko.applyBindings(new WorklistViewModel(), document.getElementById("worklist"));
})