$(document).ready(function(){


	function buildMiniCalendar(){
		var calendar_start_point = new Date(sessionStorage.year, sessionStorage.month, 1);
		if (calendar_start_point.getDay()>0){
			while (calendar_start_point.getDay() != 0){
				calendar_start_point = new Date(calendar_start_point.setDate(calendar_start_point.getDate()-1));
			};
		};
		var current_day = calendar_start_point;
		var output = '<tr class="MiniCalendarRow"><td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td></tr>';
		var Week = 1;
		while (current_day.getMonth() <= sessionStorage.month || current_day.getFullYear() < sessionStorage.year){
			if(Week>6){
				break;
			}
			if (current_day.getMonth() == sessionStorage.month && ( current_day.getDate() <= sessionStorage.day && current_day.getDate()+6 >= sessionStorage.day )){
				output += '<tr id="Week'+Week+'" class="MiniCalendarRow CurrentWeek" style="outline:thin solid black;">';
				sessionStorage.week = Week;
				changeDateRange();
			}
			else if(current_day.getMonth() < sessionStorage.month && sessionStorage.day <= 1+ ( 6 - new Date(sessionStorage.year, sessionStorage.month, 1).getDay() ) ){
				output += '<tr id="Week'+Week+'" class="MiniCalendarRow CurrentWeek" style="outline:thin solid black;">';
				sessionStorage.week = Week;
				changeDateRange();
			}
			else{
				output += '<tr id="Week'+Week+'" class="MiniCalendarRow">';
			}

			for(var i=0; i < 7; i++){
				if(current_day.getMonth() < sessionStorage.month || current_day.getMonth() > sessionStorage.month){
					output+= '<td style="background-color:lightgrey">'+current_day.getDate()+'</td>';
				}

				else{
					output+= '<td>'+current_day.getDate()+'</td>';
				}
				current_day = new Date(current_day.setDate(current_day.getDate()+1));
			}
			output+='</tr>'
			Week+=1;
		}
		$("#MiniCalendar").html(output)

	};
	function buildWeekView(){
		var days_of_week = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat']
		var schedule_start_point = new Date(sessionStorage.year, sessionStorage.month, sessionStorage.day);
		var true_start_point = schedule_start_point;
		if (schedule_start_point.getDay()>0){
			while (schedule_start_point.getDay() != 0){
				schedule_start_point = new Date(schedule_start_point.setDate(schedule_start_point.getDate()-1));
			};
		};
		var output = '<table id="ContentTable" border="1"><tr id="DateRow"><td class="DateCell"></td>';
		for (i=0; i<7; i++){
			output+='<td class="DateCell">'+days_of_week[schedule_start_point.getDay()]+' '+(schedule_start_point.getMonth()+1)+'/'+schedule_start_point.getDate()+'</td>';
			schedule_start_point = new Date(schedule_start_point.getFullYear(), schedule_start_point.getMonth(), schedule_start_point.getDate()+1);
		
		}
		
		var time = 12;
		var am = true;
		var temp_start_point = true_start_point;
		output+='<tr id="'+time+'am"> <td class="">'+time+'am</td>';
		for (i=0; i<7;i++){
			output += '<td class="'+time+'am '+temp_start_point.getMonth()+'/'+temp_start_point.getDate()+'"> </td>';
			temp_start_point=new Date(temp_start_point.getFullYear(), temp_start_point.getMonth(), temp_start_point.getDate()+1);
		}
		output+='</tr>'

		time=1;
		var running = true;
		while(running == true){
			var am_pm_output= ''
			if(am==true){
				am_pm_output='am'
			}
			else{
				am_pm_output='pm'
			}
			temp_start_point = true_start_point;
			
			output+='<tr id="'+time+am_pm_output+'"> <td class="">'+time+am_pm_output+'</td>';
			for (i=0; i<7;i++){
				output += '<td class="'+time+am_pm_output+' '+temp_start_point.getMonth()+'/'+temp_start_point.getDate()+'"> </td>';
				temp_start_point=new Date(temp_start_point.getFullYear(), temp_start_point.getMonth(), temp_start_point.getDate()+1);
			}
			output+='</tr>'
			time++;
			if (time==12 && am==false){
				running=false;
			}
			else{

				if (time >12){
					time=1;
				}
				if(time==12){
				am=false
				}
			}
		}
		output+="</table>"

		$("#MainWindow").html(output)
		$("#ContentTable").css("width","100%")
		$(".DateCell").css('padding-left','5%').css('padding-right','5%').css("width","10%")


		//Begin Populating Calendar
		$.get("/getevents/", function(data){
			console.log(data);
			var old_data = data['events'];
			var new_data = {};
			for(i in old_data){
				console.log(old_data[i])

			}

		});
	};
	function buildMonthView(){

	};
	function buildDayView(){

	};
	function changeDateRange(){
		var monthlist = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec" ];
		var date_range_start = new Date(sessionStorage.year, sessionStorage.month, 1);
		if (date_range_start.getDay()>0){
			while (date_range_start.getDay() != 0){
				date_range_start = new Date(date_range_start.setDate(date_range_start.getDate()-1));
			};
		};
		for( var i =1; i<sessionStorage.week; i++){
			date_range_start = new Date(date_range_start.setDate(date_range_start.getDate()+7));
		}
		var date_range_end = new Date(date_range_start.getFullYear(), date_range_start.getMonth(), date_range_start.getDate()+6);
		output = monthlist[date_range_start.getMonth()]+" "+date_range_start.getDate()+" - ";
		if(date_range_start.getMonth() != date_range_end.getMonth()){
			output += monthlist[date_range_end.getMonth()];
		}
		output+= " "+date_range_end.getDate()+", "+date_range_start.getFullYear();
		$("#CurrentWeek").html(output);
	}

	var start_date = new Date();
	if(sessionStorage.month == null){
		sessionStorage.month = start_date.getMonth();
	}
	if(sessionStorage.year == null){
		sessionStorage.year = start_date.getFullYear();
	}
	if(sessionStorage.day == null){
		sessionStorage.day = start_date.getDate();
	}
	if(sessionStorage.view == null){
		sessionStorage.view = 1;
	}
	buildMiniCalendar();
	buildWeekView();

	function redrawView(){
		if(sessionStorage.view == 1){
			buildWeekView();
		}
		else if(sessionStorage.view == 2){
			buildDayView();
		}
		else if(sessionStorage.view == 3){
			buildMonthView();
		}
		else{
			buildWeekView();
		}
	}

	$("#MiniCalendar").on('click', 'tr', function(e){
		var target = e.target.parentNode.id;
		if (target != ""){
			target = parseInt(target.replace("Week",""));
			var date_range_start = new Date(sessionStorage.year, sessionStorage.month, 1);
			if (date_range_start.getDay()>0){
				while (date_range_start.getDay() != 0){
					date_range_start = new Date(date_range_start.setDate(date_range_start.getDate()-1));
				};
			};
			for( var i =1; i<target; i++){
				date_range_start = new Date(date_range_start.setDate(date_range_start.getDate()+7));
			}
			$("#Week"+sessionStorage.week)[0].style.outline = "";
			$("#Week"+target)[0].style.outline = "thin solid black";
			sessionStorage.week = target;
			sessionStorage.month = date_range_start.getMonth();
			sessionStorage.year = date_range_start.getFullYear();
			sessionStorage.day = date_range_start.getDate();
			redrawView();
		};
	});
	$("#TodayButton").on('click',function(e){
		'use strict';
		var start_date = new Date();
		sessionStorage.month = start_date.getMonth();
		sessionStorage.year = start_date.getFullYear();
		sessionStorage.day = start_date.getDate();
		buildMiniCalendar();
		redrawView();

	});
	$("#OneWeekBack").on('click', function(e){
		'use strict';
		var temp_date = new Date(sessionStorage.year, sessionStorage.month, parseInt(sessionStorage.day)-7);
		sessionStorage.month = temp_date.getMonth();
		sessionStorage.year = temp_date.getFullYear();
		sessionStorage.day = temp_date.getDate();
		buildMiniCalendar();
	});
	$("#OneWeekForward").on('click', function(e){
		'use strict';
		console.log(sessionStorage.day)
		console.log("Math Test"+(sessionStorage.day+7));
		var temp_date = new Date(sessionStorage.year, sessionStorage.month, parseInt(sessionStorage.day)+7 );
		sessionStorage.month = temp_date.getMonth();
		sessionStorage.year = temp_date.getFullYear();
		sessionStorage.day = temp_date.getDate();
		console.log(sessionStorage.day)
		console.log(temp_date)
		buildMiniCalendar();
		redrawView();
	});


});