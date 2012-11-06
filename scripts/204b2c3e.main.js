window.courseData=[{name:"Introduction to Parallel Programming",faculty:"Science",id:"CPSC 418",terms:[1],status:"Full",schedule:{days:["Tue","Thu"],hours:["15:30","16:00","16:30"]}},{name:"Introduction to Human Computer Interaction",faculty:"Science",id:"CPSC 344",terms:[1,2],status:"Open",schedule:{days:["Tue","Thu"],hours:["9:30","10:00","10:30"]}},{name:"Data Mining and Machine Learning",faculty:"Science",id:"CPSC 314",terms:[1],status:"Open",schedule:{days:["Mon","Wed","Fri"],hours:["15:00","15:30"]}},{name:"Computer Graphics",faculty:"Science",id:"CPSC 318",terms:[1,2],status:"Waitlist",schedule:{days:["Mon","Wed","Fri"],hours:["9:00","9:30"]}},{name:"Software Construction",faculty:"Science",id:"CPSC 212",terms:[2],status:"Open",schedule:{days:["Mon","Wed","Fri"],hours:["11:00","11:30"]}},{name:"Computing in the Life Sciences",faculty:"Science",id:"CPSC 218",terms:[2],status:"Full",schedule:{days:["Mon","Wed","Fri"],hours:["9:00","9:30"]}}],$(document).ready(function(){var a=["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],b=function(b){return b.checked=ko.observable(!1),b.isFull=ko.observable(b.status=="Full"?!0:!1),b.isWaitingList=ko.observable(b.status=="Waitlist"?!0:!1),b.color=a.shift(),b},c=function(a,b,c,e){var f={};return f.hour="",f.militarHour=0,f.index=0,f.days=[],f.init=function(a,b,c,e){return f.hour=a,f.militarHour=b,f.index=c,f.color="white",e.unshift(""),$.each(e,function(a,b){f.days.push(new d(b,f.index,a))}),f},f.init(a,b,c,e)},d=function(a,b,c){var d={};return d.name="",d.parentIndex=0,d.index=0,d.color=ko.observable("white"),d.course=ko.observable({id:null}),d.isFirstColumn=function(a){return a()==0},d.init=function(a,b,c){return d.parentIndex=b,d.index=c,d.name=a,d},d.init(a,b,c)},e=function(){var a={},b=["Mon","Tue","Wed","Thu","Fri","Sat"],d=30,e=800,f=2300,g=20;a.hours=ko.observableArray([]),a.classesHours=ko.observableArray([]),a.minimumHourDisplay=ko.observable(e),a.maximumHourDisplay=ko.observable(f),a.days=[];var h=function(a){var b=parseInt(a/100),c=a%100;return b+":"+c};a.parseStringHourToMilitar=function(a){var b=a.split(/:/ig),c=parseInt(b[0])*100,d=parseInt(b[1]);return c+d};var i=function(a){var e=d||30,f=1440,g=[],i=!1,j="",k=0;for(var l=0;l<f;l+=e)k=parseInt(l/60)*100+l%60,j=h(k),i=l%60==0?!0:!1,i&&(j+="0"),g.push(new c(j,k,l/e,b.slice(0)));a(g)},j=function(a,b){var c=[],d=0;c=ko.utils.arrayFilter(a(),function(a){return a.militarHour>e&&a.militarHour<f&&d++<g}),b(c)};return a.up=function(){var b=a.minimumHourDisplay();if(b>e){var c=a.classesHours()[0],d=a.hours()[c.index-1],f=a.classesHours()[a.classesHours().length-2];a.minimumHourDisplay(d.militarHour),a.maximumHourDisplay(f.militarHour),a.classesHours.unshift(d),a.classesHours.pop()}},a.down=function(){var b=a.maximumHourDisplay();if(b<=f){var c=a.classesHours()[a.classesHours().length-1],d=a.hours()[c.index+1],e=a.classesHours()[0];a.maximumHourDisplay(d.militarHour),a.minimumHourDisplay(e.militarHour),a.classesHours.push(d),a.classesHours.shift()}},a.init=function(){i(a.hours),j(a.hours,a.classesHours);var c=b.slice(0);return c.unshift(" "),a.days=c,a},a.init()},f=function(){var a=this;return a.backlog=ko.observableArray([]),a.store=ko.observableArray([]),a.timetable=ko.observable({}),a.isStoreEmpty=ko.computed(function(){return a.store().length===0}),a.paintCourseInTimetable=function(b,c){var d=a.timetable(),e=b.schedule.days,f=b.schedule.hours,g=[];$.each(f,function(a,b){$.each(d.hours(),function(a,c){c.hour==b&&g.push(a)})});var h=[],i=d.hours()[0].days;$.each(e,function(a,b){$.each(i,function(a,c){c.name==b&&h.push(a)})});var j=[];$.each(g,function(a,e){j=d.hours()[e].days,$.each(j,function(a,d){$.each(h,function(a,e){if(d.index==e){var f=d.course;!f.id||c==="Remove"?c==="Add"?(d.course(b),d.color(b.color)):(d.course({id:null}),d.color("white")):alert("Conflict")}})})})},a.init=function(){return a.backlog=ko.observableArray($.map(window.courseData,function(a){return new b(a)})),a.timetable=ko.observable(new e),a},a.addDown=function(){var b=a.backlog(),c=[];$.each(b,function(b,d){d.checked()&&(a.paintCourseInTimetable(d,"Add"),c.push(d),a.store.push(d))}),a.backlog.removeAll(c)},a.addUp=function(){var b=a.store(),c=[];$.each(b,function(b,d){d.checked()&&(a.paintCourseInTimetable(d,"Remove"),c.push(d),a.backlog.push(d))}),a.store.removeAll(c)},a.allDown=function(){var b=a.backlog.removeAll();$.each(b,function(b,c){c.status!=="Full"?(a.paintCourseInTimetable(c,"Add"),a.store.push(c)):a.backlog.push(c)})},a.allUp=function(){var b=a.store.removeAll();$.each(b,function(b,c){c.status!=="Full"?(a.paintCourseInTimetable(c,"Remove"),a.backlog.push(c)):a.store.push(c)})},a.removeFromBacklog=function(b){a.backlog.remove(b)},a.init()};ko.applyBindings(new f,document.getElementById("worklist"))});