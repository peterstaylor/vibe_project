function scan_calendar(events, client_f, client_l, date1, date2, date3, date4, date5, date6) {
    // first get the client name
    var firstname = client_f.split(' ')[0]; // we will use name[0] by default
    var lastname = client_l.split(' ')[0];  // default to using first value here too 
    // create an empty array to return the student information
    var Student_Info = []; 
    var bill_bool = 0; 
    for (jj = 0; jj < events.length; jj++) {

        // split up the title by spaces 
        var title = events[jj].title.split(' '); 

        // check for cancellation or free trial, neither get counted for billing
        if (title[0] == 'CANCELLED' || title[0] == '[CANCELLED]' || title[0] == '(CANCELLED)' || title[0] == 'FREE') {
        }

        // if there was not a cancellation
        else {
            for (kk = 0; kk < title.length; kk++) {
                // check if the name of the client is in the calendar event
                if (title[kk] == firstname) {
                    // if the firstname is in the calendar event, then check for the last name for robustness
                    for (nn = 0; nn < title.length; nn++) {
                        //if (title[nn] == lastname) {
                            // check if the student array is empty, i.e. it's the first match
                            if (Student_Info == []) {
                                // check for a travel fee
                                if (events[jj].location != '') {
                                    if (events[jj].location.split(' ')[0] == 'FEE') {
                                        var travel_fee = 1;
                                    }
                                    else {
                                        var travel_fee = 0;
                                    }
                                }
                                // below checks which set of lessons to increment if we are creating the first entry
                                if (events[jj].date >= date1 && events[jj].date <= date2) {
                                    var Line = new StudentReturn(1, 0, 0, travel_fee, 0, 0, events[jj].duration); 
                                }
                                else if (events[jj].date >= date3 && events[jj].date <= date4) {
                                    var Line = new StudentReturn(0, 1, 0, 0, travel_fee, 0, events[jj].duration);
                                }
                                else {
                                    var Line = new StudentReturn(0, 0, 1, 0, 0, travel_fee, events[jj].duration, events.date);
                                }
                                Student_Info.push(Line);
                            }
                            // if it's not the first time we have checked
                            else {
                                // check for a travel fee
                                if (events[jj].location != '') {
                                    if (events[jj].location.split(' ')[0] == 'FEE') {
                                        var travel_fee = 1;
                                    }
                                    else {
                                        var travel_fee = 0;
                                    }
                                }
                                // need to check if student had multiple lesson lengths
                                var duration_check = events[jj].duration;

                                // set a dummy value in row of info at first
                                // will use this value to figure out if we need a new row of student info 
                                // to handle different lesson lengths 
                                var row_of_info = 999;
                                for (mm = 0; mm < Student_Info.length; mm++) {
                                    if (duration_check == Student_Info[mm].lesson_length) {
                                        row_of_info = mm;
                                        mm = Student_Info.length;  // this will cause the loop to exit
                                    }
                                }

                                // now we have determined if we need a new row or not
                                // if row of info is still equal to 999 we need to create a new row
                                if (row_of_info == 999) {
                                    if (events[jj].date >= date1 && events[jj].date <= date2) {
                                        var Line = new StudentReturn(1, 0, 0, travel_fee, 0, 0, duration_check);
                                    }
                                    else if (events[jj].date >= date3 && events[jj].date <= date4) {
                                        var Line = new StudentReturn(0, 1, 0, 0, travel_fee, 0, duration_check);
                                    }
                                    else {
                                        var Line = new StudentReturn(0, 0, 1, 0, 0, travel_fee, duration_check);
                                    }
                                    Student_Info.push(Line);
                                }
                                // if we don't need a new row, just update number of lessons and travel fee
                                else {  
                                    if (events[jj].date >= date1 && events[jj].date <= date2) {
                                        Student_Info[row_of_info].num_tf_pm = Student_Info[row_of_info].num_tf_pm + travel_fee; 
                                        Student_Info[row_of_info].num_lessons_pm++; 
                                    }
                                    else if (events[jj].date >= date3 && events[jj].date <= date4) {
                                        Student_Info[row_of_info].num_tf_tm = Student_Info[row_of_info].num_tf_tm + travel_fee;
                                        Student_Info[row_of_info].num_lessons_tm++; 
                                    }
                                    else {
                                        if (bill_bool == 0) {
                                            Student_Info[row_of_info].bill_date = events[jj].date; 
                                            bill_bool = 1; 
                                        }
                                        Student_Info[row_of_info].num_tf_nm = Student_Info[row_of_info].num_tf_nm + travel_fee;
                                        Student_Info[row_of_info].num_lessons_nm++; 
                                    }
                                }
                            }
                            kk = title.length;  // set this value to exit the loop 
                            nn = title.length;
                        //}
                    }
                }
            }
        }
        
    }
    return Student_Info; 
}