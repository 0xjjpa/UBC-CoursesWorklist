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
		var self = {};

		for(var key in data) {
			if(data.hasOwnProperty(key)) self[key] = data[key];
		}
		
		self.checked = ko.observable(false);
		return self;		
	}
		

	var WorklistViewModel = function() {
		var self = this;
		self.backlog = ko.observableArray($.map(window.courseData, function(course){ return new Course(course); }));
		self.store = ko.observableArray([]);

		self.init = function() {
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