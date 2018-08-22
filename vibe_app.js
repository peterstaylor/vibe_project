function readCalendars() {
  // roster and tracker are the two spreadsheets we are dealing with 
  var roster = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA').getSheets()[0]; 
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  
  var all_cals = CalendarApp.getAllCalendars(); 
  var num_cals = all_cals.length; 
  
  // this is an empty array to store the names of all the calendars
  var cal_names = []; 
  
  // get current date
  var now = new Date(); 
  // print when the script was run
  tracker.getRange(1, 2,1,1).setValue(now); 
  var month = now.getMonth();
  var year = now.getFullYear(); 
  
 
  
  
   //now find the last row we are dealing with
   //color that demarcates active clients == #00ff00, i.e. that lime green color in the spreadsheet
  var color_count = 0; 
  for (var ii = 1 ; color_count !=2; ii++){
    var row_color = roster.getRange(ii, 1).getBackground(); 
    if (row_color == '#00ff00' && color_count == 0){
      color_count = 1; 
      var first_row = ii; 
    }
    else if (row_color == '#00ff00' && color_count == 1){
      color_count = 2; 
      var last_row = ii; 
    }
  }
  
  // formatting date information 
  // december
  if (month == 11){
    var begin_this_month = new Date(year, month, 1,0, 0, 0, 0); 
    var end_this_month = new Date(year, month, 31, 23, 59, 59, 999); 
    var begin_next_month = new Date(year+1, 0, 1, 0, 0, 0, 0); 
    var end_next_month = new Date(year+1, 0, 1, 31, 23, 59, 59, 999); 
    var begin_prev_month = new Date(year, month-1, 1, 0, 0, 0, 0); 
    var end_prev_month = new Dat(year, month-1, 30, 23, 59, 59, 999); 
  }
  
  else{
    var begin_this_month = new Date(year, month, 1,0, 0, 0, 0); 
    var begin_next_month = new Date(year, month+1, 1, 0, 0, 0, 0); 
    
    // january 
    if (month == 0){
	  var begin_prev_month = new Date(year-1, 11, 1, 0, 0, 0, 0); 
	  var end_prev_month = new Date(year-1, 11, 31, 23, 59, 59, 999); 
      var end_this_month = new Date(year, month, 31, 23, 59, 59, 999); 
      if (((year%4 == 0) && (year%100 !=0)) || (year%400 == 0)){ 	// leap year
        var end_next_month = new Date(year, month+1, 29, 23, 59, 59, 999); 
      }
      else{
        var end_next_month = new Date(year, month+1, 29, 23, 59, 59, 999);
      }
    }
    
	// february
    else if (month == 1){
      var begin_prev_month = new Date(year, month-1, 1, 0, 0, 0, 0); 
	  var end_prev_month = new Date(year, month-1, 31, 23, 59, 59, 999); 
	  
	  var end_next_month = new Date(year, month+1, 31, 23, 59, 59, 999);  
      if (((year%4 == 0) && (year%100 !=0)) || (year%400 == 0)){
        var end_this_month = new Date(year, month, 29, 23, 59, 59, 999);
      }
      else{
        var end_this_month = new Date(year, month, 28, 23, 59, 59, 999); 
    }
    }
   //march, may, august, october
    else if ((month==2) || (month== 4) || (month == 7) || (month == 9)){
		var end_this_month = new Date(year, month, 31, 23, 59, 59, 999); 
		var end_next_month = new Date(year, month+1, 30, 23, 59, 59, 999); 
		var begin_prev_month = new Date(year, month-1, 1, 0, 0, 0, 0); 
		if (month == 2){
			if (((year%4 == 0) && (year%100 !=0)) || (year%400 == 0)){
				var end_prev_month = new Date(year, 1, 29, 23, 59, 59, 999);
			}
			else{
				var end_prev_month = new Date(year, 1, 28, 23, 59, 59, 999); 
			}
		}
		else if (month == 7){
			var end_prev_month = new Date(year, month-1, 31, 23, 59, 59, 999); 
		}
		else{
			var end_prev_month = new Date(year, month-1, 30, 23, 59, 59, 999); 
		}
    }
    // april, june, september, november
    else if ((month == 3) || (month == 5) || (month == 8) || (month==10)){
      var end_this_month = new Date(year, month, 30, 23, 59, 59, 999); 
      var end_next_month = new Date(year, month+1, 31, 23, 59, 59, 999);
	  var begin_next_month = new Date(year, month-1, 1, 0, 0, 0, 0); 
	  var end_next_month = new Date(year, month-1, 31, 23, 59, 59, 999); 
    }
    else if (month == 6){
      var end_this_month = new Date(year, month, 31, 23, 59, 59, 999); 
      var end_next_month = new Date(year, month+1, 31, 23, 59, 59, 999);
	  var begin_prev_month = new Date(year, month-1, 1, 0, 0, 0, 0); 
	  var end_prev_month = new Date(year, month-1, 30, 23, 59, 59, 999); 
    }
                                                
  } 

  // getting the first names of all the instructors 
  for(var ii = 0; ii< num_cals; ii++){ 
    // declaring an empty string to hold the first name temporarily
    var empty_name = '';                             
    for(var jj = 0; (jj<all_cals[ii].getName().length) && (all_cals[ii].getName()[jj] != ' '); jj++){
      empty_name += all_cals[ii].getName()[jj]; 
    }
    cal_names.push(empty_name); 
  }
  
  // removing the unneeded calendars 
  for(var ii = 0; ii<num_cals; ii++){
    if(cal_names[ii] == 'Admin'){
      all_cals.splice(ii, 1); 
      cal_names.splice(ii, 1); 
    }
    else if (cal_names[ii] == '-'){
      all_cals.splice(ii, 1); 
      cal_names.splice(ii, 1); 
    }
  }
 
  // update the length of calendars we are dealing with 
  num_cals = all_cals.length; 
 
  /////////////////////////////////////////////////// 
  //HERE BEGINS THE BIG LOOP TO OUTPUT INFORMATION/// 
  //BIG LOOP///////////////////////////////////////// 
  //HERE IS THE BIG LOOP ////////////////////////////
  ///////////////////////////////////////////////////
  
	//for(var inst_count = 0; inst_count < num_cals; inst_count++){
		var inst_count = 0; 
			
		// checking this month's lessons  
		var this_month_lessons = all_cals[inst_count].getEvents(begin_this_month, end_this_month);   
		// array that contains the titles of this month's lessons for each instructor
		var TML_full_names = []; 	
		for(var ii = 0; ii < this_month_lessons.length; ii++){
			TML_full_names.push(this_month_lessons[ii].getTitle());
		}

		// check next month's lessons
		var next_month_lessons = all_cals[inst_count].getEvents(begin_next_month, end_next_month);    
		//create array that contains titles for next month's lessons
		var NML_full_names = []; 
		for(var ii = 0; ii < next_month_lessons.length; ii++){
			NML_full_names.push(next_month_lessons[ii].getTitle());  
		}
		
		// check previous month's lessons
		var prev_month_lessons = all_cals[inst_count].getEvents(begin_prev_month, end_prev_month); 
		// array that contains titles for prev month lessons for each instructor
		var PML_full_names = []; 
		for(var ii = 0; ii<prev_month_lessons.length; ii++){
			PML_full_names.push(prev_month_lessons[ii].getTitle()); 
		}
		
		var location_col = 0; 
		//get the location column
		for(var jj = 17; location_col == 0 ; jj++){
			if(roster.getRange(1, jj, 1,1).getValue() == 'Location'){
				location_col = jj; 
			}
		}
		
		// as long as things don't get moved around this is true
		cost_col = location_col + 1; 
		travel_col = cost_col + 1; 
		
		// below returns the column in the roster for the instructor we are dealing with
		var name_length = cal_names[inst_count].length; 
		//var students = []; 
		var column = 0; 
		for (var jj = 17; (jj < location_col) && (column == 0); jj = jj + 1){
			var column_val = roster.getRange(1, jj, 1, 1).getValue().slice(1, name_length);                           // get instructor name column value
			if (column_val == cal_names[inst_count].slice(1, name_length)){
				column = jj; 
			}
		}
		

		
		// next step is getting a list of students that the instructor works with 
		var client_first = [];     // 2
		var client_last = [];      // 1
		var guardian = [];          // 3
		var lesson_dur = [];        // column +1
		var location = [];          // location_col
		var lesson_cost = [];       // cost_col
		var travel_fee = [];        // travel_col   
		for(ii = first_row+1; ii<last_row; ii++){
			if(roster.getRange(ii, column, 1,1).getValue()){  
				client_first.push(roster.getRange(ii, 2, 1,1).getValue()); 
				client_last.push(roster.getRange(ii, 1,1,1).getValue()); 
				guardian.push(roster.getRange(ii, 3, 1,1).getValue()); 
				lesson_dur.push(roster.getRange(ii, column+1, 1,1).getValue()); 
				location.push(roster.getRange(ii, location_col, 1,1).getValue()); 
				lesson_cost.push(roster.getRange(ii, cost_col, 1,1).getValue()); 
				travel_fee.push(roster.getRange(ii, travel_col, 1,1).getValue()); 
			}
		}
		  

		// instructor Array contains
		// Student First, Student Last, Guardian, Lesson Duration, Location, Lesson Cost, Travel Fee
		// TML_full_names contains titles of current month's lessons 
		// NML_full_names contains titles of next month's lessons
		 
		  
		// now do the work for last month
		// below loops for each student that belongs to each individual instructor 
		 
		for (ii = 0; ii<client_first.length; ii++){
			var first_empty = tracker.getLastRow()+1; // return the first empty row so we know where to put all the info
			//put static information into the spreadsheet
			tracker.getRange(first_empty, 1, 1, 1).setValue(client_last[ii]); 
			tracker.getRange(first_empty, 2, 1, 1).setValue(client_first[ii]); 
			tracker.getRange(first_empty, 3, 1,1).setValue(guardian[ii]); 
			tracker.getRange(first_empty, 4, 1,1).setValue(cal_names[inst_count]);                   
			tracker.getRange(first_empty, 5, 1,1).setValue(lesson_cost[ii]); 
			tracker.getRange(first_empty, 6, 1,1).setValue(lesson_dur[ii]); 
			tracker.getRange(first_empty, 7, 1, 1).setValue(travel_fee[ii]); 
			
			
			// CHECK ONE MONTH BACK FOR COPMARISON
			// placing lesson-based information into the spreadsheet 
			// first check last month
			var omb_cancels = 0; 
			var omb_lessons = 0; 
			
			// loop through the values in the name array, match to student first name
			// first check for cancellations
			// ii is the index for the student we are talking about at each step 
			// jj is index of calendar events, we check each of them
			// kk is the index of the letter in each string
		    
			// set the length of the student name to check, this avoids issues with e.g. Caroline Gries 
			if (client_first[ii].length > 7){
				 var length_to_check = 7; 
			}
			else{
				var length_to_check = client_first[ii].length; 
			}
		   
			for (jj = 0; jj<PML_full_names.length; jj++){
			    // check if there was a cancellation 
				if(PML_full_names[jj].slice(0, 6) == 'CANCEL' || PML_full_names[jj].slice(0, 7) == '[CANCEL' || PML_full_names[jj].slice(0, 7) == '(CANCEL'){
				// skip the cancelled word and get to the name
					for(var kk = 0; PML_full_names[jj][kk] != ' '; kk++){ }
					
					if(PML_full_names[jj][kk+1] == '-'){
						kk = kk +2; 
					}
				
					if(client_first[ii].slice(0, length_to_check) == PML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
						omb_cancels = omb_cancels + 1; 
					}
			    }
			  
			  // if we aren't dealing with a cancellation 
				else{
				// check for other conditions where there would be leading information
				// as of right now it ignores all leading info except for cancellations
					if(PML_full_names[jj].slice(0,7) == 'NO SHOW'){
						var kk = 7; 

						if(client_first[ii].slice(0, length_to_check) == PML_full_names[jj].slice(kk+1, length_to_check)){
							lessons = lessons + 1; 
						}
					}
					else{
						if(PML_full_names[jj].slice(0, 2).toUpperCase() == PML_full_names[jj].slice(0, 2)){
							for(var kk = 0; TML_full_names[jj][kk] != ' '; kk++){ }
						}
						
						if(PML_full_names[jj][kk+1] == '-'){
							kk = kk +2; 
						}
						
						if(PML_full_names[jj].slice(kk+1, 2).toUpperCase() == PML_full_names[jj].slice(kk+1, 2)){
						// skip to th enext blank space
							for(; PML_full_names[jj][kk] != ' ' && (kk<20); kk++){ }
						}		
					  
						if(client_first[ii].slice(0, length_to_check) == PML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
							lessons = lessons + 1;  
						}
					  
						else{
							if(client_first[ii].slice(0, length_to_check) == PML_full_names[jj].slice(0, length_to_check)){
								lessons = lessons + 1;  
							}
						}
					}
				}
			}
		   
			tracker.getRange(first_empty, 8, 1,1).setValue(omb_lessons); 
			tracker.getRange(first_empty, 9, 1,1).setValue(omb_cancels); 
			
			
			///HERE IS A BREAK BETEWEEN ONE MONTH BACK AND LAST MONTH
			///
			// CHECK CURRENT MONTH (THE MONTH BEHIND) 
			// placing lesson-based information into the spreadsheet 
			// first check last month
			var cancellations = 0; 
			var lessons = 0; 
			
			// loop through the values in the name array, match to student first name
			// first check for cancellations
			// ii is the index for the student we are talking about at each step 
			// jj is index of calendar events, we check each of them
			// kk is the index of the letter in each string
		   
			for (jj = 0; jj<TML_full_names.length; jj++){
			    // check if there was a cancellation 
				if(TML_full_names[jj].slice(0, 6) == 'CANCEL' || TML_full_names[jj].slice(0, 7) == '[CANCEL' || TML_full_names[jj].slice(0, 7) == '(CANCEL'){
				// skip the cancelled word and get to the name
					for(var kk = 0; TML_full_names[jj][kk] != ' '; kk++){ }
					
					if(TML_full_names[jj][kk+1] == '-'){
						kk = kk +2; 
					}
				
					if(client_first[ii].slice(0, length_to_check) == TML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
						cancellations = cancellations + 1; 
					}
			    }
			  
			  // if we aren't dealing with a cancellation 
				else{
				// check for other conditions where there would be leading information
				// as of right now it ignores all leading info except for cancellations
					if(TML_full_names[jj].slice(0,7) == 'NO SHOW'){
						var kk = 7; 
						Logger.log(client_first[ii].slice(0, length_to_check)); 
                        Logger.log(TML_full_names[jj].slice(kk+1, length_to_check)); 
						if(client_first[ii].slice(0, length_to_check) == TML_full_names[jj].slice(kk+1, length_to_check)){
							lessons = lessons + 1; 
						}
					}
					else{
						if(TML_full_names[jj].slice(0, 2).toUpperCase() == TML_full_names[jj].slice(0, 2)){
							for(var kk = 0; TML_full_names[jj][kk] != ' '; kk++){ }
						}
						
						if(TML_full_names[jj][kk+1] == '-'){
							kk = kk +2; 
						}
						
						if(TML_full_names[jj].slice(kk+1, 2).toUpperCase() == TML_full_names[jj].slice(kk+1, 2)){
						// skip to th enext blank space
							for(; TML_full_names[jj][kk] != ' ' && (kk<20); kk++){ }
						}		
					  
						if(client_first[ii].slice(0, length_to_check) == TML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
							lessons = lessons + 1;  
						}
					  
						else{
							if(client_first[ii].slice(0, length_to_check) == TML_full_names[jj].slice(0, length_to_check)){
								lessons = lessons + 1;  
							}
						}
					}
				}
			}
		   
			tracker.getRange(first_empty, 10, 1,1).setValue(lessons); 
			tracker.getRange(first_empty, 11, 1,1).setValue(cancellations); 
		   
		   //CHECK THE NEXT MONTH, LOOK AHEAD TO FUTURE SCHEDULED APPOINTMENTS
		   
			var future_lessons = 0; 
			var future_cancels = 0; 
			var bill_date = 0; 
			var bill_boolean = 1; 
			
			for (jj = 0; jj<NML_full_names.length; jj++){
				// check if there was a cancellation 
				if(NML_full_names[jj].slice(0, 6) == 'CANCEL' || NML_full_names[jj].slice(0, 7) == '[CANCEL' || NML_full_names[jj].slice(0, 7) == '(CANCEL'){
				
					// skip the cancelled word and get to the name
					for(var kk = 0; NML_full_names[jj][kk] != ' '; kk++){ }
				
					// skip hyphen
					if(NML_full_names[jj][kk+1] == '-'){
						kk = kk +2; 
					}
				
					if(client_first[ii].slice(0, length_to_check) == NML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
						future_cancels = future_cancels + 1; 
				  
						//if(bill_boolean){
						//	var bill_date = all_cals[inst_count].getEvents(begin_next_month, end_next_month)[jj].getStartTime();
						//	bill_boolean = 0; 
						//}
					}
				}	
			

				// if we aren't dealing with a cancellation 
				else{
					// check for other conditions where there would be leading information
					// as of right now it ignores all leading info except for cancellations
					if(NML_full_names[jj].slice(0, 2).toUpperCase() == NML_full_names[jj].slice(0, 2)){
						// skip to th enext blank space
						for(var kk = 0; NML_full_names[jj][kk] != ' '; kk++){ }
					 
						// iterate forward to skip hyphens
						if(NML_full_names[jj][kk+1] == '-'){
							kk = kk+2; 
						}
					  
						
						if(client_first[ii].slice(0, length_to_check) == NML_full_names[jj].slice(kk+1, kk+1+length_to_check)){
							future_lessons = future_lessons + 1;  
							if(bill_boolean){
								var bill_date = all_cals[inst_count].getEvents(begin_next_month, end_next_month)[jj].getStartTime();
								bill_boolean = 0; 
							}
						}
					}
					else{
						if(client_first[ii].slice(0, length_to_check) == NML_full_names[jj].slice(0, length_to_check)){
							future_lessons = future_lessons + 1; 
							if(bill_boolean){
								var bill_date = all_cals[inst_count].getEvents(begin_next_month, end_next_month)[jj].getStartTime();
								bill_boolean = 0; 
							}
						}
					}
				}
			}
			tracker.getRange(first_empty, 12, 1,1).setValue(future_lessons); 
			
			if (future_lessons == 0){
					bill_date = 'n/a'; 
			}
			
          tracker.getRange(first_empty, 13, 1,1).setValue(bill_date); 
		  
		}
	//} // END OF BIG LOOP 
}