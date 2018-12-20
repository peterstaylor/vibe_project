function top_level() {
    // roster and tracker are the two spreadsheets we are dealing with 
    var roster = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA').getSheets()[0];
    var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0];

    //now find the last row we are dealing with
    //color that demarcates active clients == #00ff00, i.e. that lime green color in the spreadsheet
    var color_count = 0;
    for (var ii = 1; color_count != 2; ii++) {
        var row_color = roster.getRange(ii, 1).getBackground();
        if (row_color == '#00ff00' && color_count == 0) {
            color_count = 1;
            var first_row = ii;
        }
        else if (row_color == '#00ff00' && color_count == 1) {
            color_count = 2;
            var last_row = ii;
        }
    }

    // use this boolean in the spreadsheet to control if the function runs
    var boolean = tracker.getRange(1, 5, 1, 1).getValue();
    if (boolean == 1) {
        // if there is info on the spreadsheet we need to clean it out
        if (tracker.getLastRow() > 2) {
            cleanup();
        }

        var all_cals = CalendarApp.getAllCalendars();
        var num_cals = all_cals.length;

        // this is an empty array to store the names of all the calendars
        var cal_names = [];

        // get current date
        var now = new Date();
        // print when the script was run
        tracker.getRange(1, 2, 1, 1).setValue(now);
        var month = now.getMonth();
        var year = now.getFullYear();



        // formatting date information 
        // december
        if (month == 11) {
            var begin_this_month = new Date(year, month, 1, 0, 0, 0, 0);
            var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
            var begin_next_month = new Date(year + 1, 0, 1, 0, 0, 0, 0);
            var end_next_month = new Date(year + 1, 0, 1, 31, 23, 59, 59, 999);
            var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
            var end_prev_month = new Dat(year, month - 1, 30, 23, 59, 59, 999);
        }

        else {
            var begin_this_month = new Date(year, month, 1, 0, 0, 0, 0);
            var begin_next_month = new Date(year, month + 1, 1, 0, 0, 0, 0);

            // january 
            if (month == 0) {
                var begin_prev_month = new Date(year - 1, 11, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year - 1, 11, 31, 23, 59, 59, 999);
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { 	// leap year
                    var end_next_month = new Date(year, month + 1, 29, 23, 59, 59, 999);
                }
                else {
                    var end_next_month = new Date(year, month + 1, 29, 23, 59, 59, 999);
                }
            }

            // february
            else if (month == 1) {
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);

                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                    var end_this_month = new Date(year, month, 29, 23, 59, 59, 999);
                }
                else {
                    var end_this_month = new Date(year, month, 28, 23, 59, 59, 999);
                }
            }
            //march, may, august, october
            else if ((month == 2) || (month == 4) || (month == 7) || (month == 9)) {
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 30, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                if (month == 2) {
                    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                        var end_prev_month = new Date(year, 1, 29, 23, 59, 59, 999);
                    }
                    else {
                        var end_prev_month = new Date(year, 1, 28, 23, 59, 59, 999);
                    }
                }
                else if (month == 7) {
                    var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);
                }
                else {
                    var end_prev_month = new Date(year, month - 1, 30, 23, 59, 59, 999);
                }
            }
            // april, june, september, november
            else if ((month == 3) || (month == 5) || (month == 8) || (month == 10)) {
                var end_this_month = new Date(year, month, 30, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);
            }
            else if (month == 6) {
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 30, 23, 59, 59, 999);
            }

        }

        // getting the first names of all the instructors 
        for (var ii = 0; ii < num_cals; ii++) {
            // declaring an empty string to hold the first name temporarily
            var empty_name = '';
            for (var jj = 0; (jj < all_cals[ii].getName().length) && (all_cals[ii].getName()[jj] != ' '); jj++) {
                empty_name += all_cals[ii].getName()[jj];
            }
            cal_names.push(empty_name);
        }

        // removing the unneeded calendars 
        for (var ii = 0; ii < num_cals; ii++) {
            if (cal_names[ii] == 'Admin') {
                all_cals.splice(ii, 1);
                cal_names.splice(ii, 1);
            }
            else if (cal_names[ii] == '-') {
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
        for (var inst_count = 0; inst_count < num_cals; inst_count++) {
            //var inst_count = 2;
            //tracker.getRange(1, 3, 1, 1).setValue(inst_count);


            // put all lessons from the three month window into one data struture
            var tmo_lessons = all_cals[inst_count].getEvents(begin_prev_month, end_next_month);
            // array that contains the titles of this month's lessons for each instructor
            var LESSONS = [];
            for (var ii = 0; ii < tmo_lessons.length; ii++) {
                var start = tmo_lessons[ii].getStartTime();
                var end = tmo_lessons[ii].getEndTime();
                var length = (end - start) / (1000 * 60 * 60);
                var CAL = new CalendarInfo(tmo_lessons[ii].getTitle(), start, length, tmo_lessons[ii].getLocation());
                LESSONS.push(CAL);
            }

            //get the location column
            var location_col = 0;
            for (var jj = 17; location_col == 0; jj++) {
                if (roster.getRange(1, jj, 1, 1).getValue() == 'Location') {
                    location_col = jj;
                }
            }

            // as long as things don't get moved around this is true
            var cost_col = location_col + 1;
            var travel_col = cost_col + 1;

            // below returns the column in the roster for the instructor we are dealing with
            var name_length = cal_names[inst_count].length;

            // need to handle when it returns and email address
            for (var ii = 0; ii <= name_length; ii++) {
                if (cal_names[inst_count][ii] == '@') {
                    name_length = ii - 1;
                }
            }

            var column = 0;
            for (var jj = 17; (jj < location_col) && (column == 0); jj = jj + 1) {
                var column_val = roster.getRange(1, jj, 1, 1).getValue().slice(0, name_length).toLowerCase();                           // get instructor name column value

                if (column_val == cal_names[inst_count].slice(0, name_length).toLowerCase()) {
                    column = jj;
                }
            }
            
            if (column != 0) {

                // next step is getting a list of students that the instructor works with 
                var client_first = [];     // 2
                var client_last = [];      // 1
                var guardian = [];          // 3
                var location = [];          // location_col
                var lesson_cost = [];       // cost_col
                var travel_fee = [];        // travel_col   
                for (ii = first_row + 1; ii < last_row; ii++) {
                    if (roster.getRange(ii, column, 1, 1).getValue()) {
                        client_first.push(roster.getRange(ii, 2, 1, 1).getValue());
                        client_last.push(roster.getRange(ii, 1, 1, 1).getValue());
                        guardian.push(roster.getRange(ii, 3, 1, 1).getValue());
                        location.push(roster.getRange(ii, location_col, 1, 1).getValue());
                        lesson_cost.push(roster.getRange(ii, cost_col, 1, 1).getValue());
                        travel_fee.push(roster.getRange(ii, travel_col, 1, 1).getValue());
                    }
                }


                // instructor Array contains
                // Student First, Student Last, Guardian, Lesson Duration, Location, Lesson Cost, Travel Fee
                // TML_full_names contains titles of current month's lessons 
                // NML_full_names contains titles of next month's lessons


                // now do the work for last month
                // below loops for each student that belongs to each individual instructor 

                for (ii = 0; ii < client_first.length; ii++) {
                    var first_empty = tracker.getLastRow() + 1; // return the first empty row so we know where to put all the info

                    // this little function right here reads all the calendars and returns the data we need to output
                    All_Cal_Info = scan_calendar(LESSONS, client_first[ii], client_last[ii], begin_prev_month, end_prev_month, begin_this_month, end_this_month, begin_next_month, end_next_month);
                    var bill_boolean = 0;
                    // print the info in All_Call_Info to the spreadsheet 
                    for (jj = 0; jj < All_Cal_Info.length; jj++) {
                        tracker.getRange(first_empty + jj, 1, 1, 1).setValue(client_last[ii]); // client last
                        tracker.getRange(first_empty + jj, 2, 1, 1).setValue(client_first[ii]); // client first
                        tracker.getRange(first_empty + jj, 3, 1, 1).setValue(guardian[ii]);  // guardian first
                        tracker.getRange(first_empty + jj, 4, 1, 1).setValue(cal_names[inst_count]); // instructor
                        tracker.getRange(first_empty + jj, 6, 1, 1).setValue((lesson_cost[ii]) * All_Cal_Info[jj].lesson_length); // lesson cost
                        tracker.getRange(first_empty + jj, 5, 1, 1).setValue(travel_fee[ii]); // travel fee amount
                        tracker.getRange(first_empty + jj, 7, 1, 1).setValue(All_Cal_Info[jj].lesson_length); // lesson length 
                        tracker.getRange(first_empty + jj, 8, 1, 1).setValue(All_Cal_Info[jj].num_lessons_pm); // previous month lessons

                        var tf_pm = All_Cal_Info[jj].num_tf_pm; 
                        if (tf_pm == undefined) {
                            tf_pm = 0; 
                        }
                        tracker.getRange(first_empty + jj, 9, 1, 1).setValue(tf_pm); // travel fees in previous month
                        tracker.getRange(first_empty + jj, 10, 1, 1).setValue(All_Cal_Info[jj].num_lessons_tm); // number of lessons in this month

                        var tf_tm = All_Cal_Info[jj].num_tf_tm;
                        if (tf_tm == undefined) {
                            tf_tm = 0;
                        }

                        tracker.getRange(first_empty + jj, 11, 1, 1).setValue(tf_tm); // number of travel fees this month
                        tracker.getRange(first_empty + jj, 12, 1, 1).setValue(All_Cal_Info[jj].num_lessons_nm); // lessons next month

                        var tf_nm = All_Cal_Info[jj].num_tf_nm;
                        if (tf_nm == undefined) {
                            tf_nm = 0;
                        }

                        tracker.getRange(first_empty + jj, 13, 1, 1).setValue(tf_nm); // travel fees next month
                        tracker.getRange(first_empty + jj, 14, 1, 1).setValue(All_Cal_Info[jj].bill_date); // print bill date

                    }
                } // end of big loop 
            }
        }
            tracker.getRange(1, 5, 1, 1).setValue(0);
            final_sort();
            //var last_row = tracker.getLastRow()-3; 
            //var last_column = tracker.getLastColumn(); 
            //var data_pass = tracker.getRange(3, 1, last_row, last_column).getValues();  
            //bill_date_handling(last_row, data_pass, tracker); 
        }
        else if (boolean == 2) {
            if (last_row > 2) {
                cleanup();
                tracker.getRange(1, 5, 1, 1).setValue(0);
                tracker.getRange(1, 2, 1, 1).setValue('');
            }
        }
    }
