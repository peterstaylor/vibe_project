function client_emails() {
    var dates = date_management();
    var begin_this_month = dates[2];
    var end_this_month = dates[3];
    var begin_next_month = dates[4];
    var end_next_month = dates[5];

    var rosters = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA');
    var roster = rosters.getSheets()[1];

    var active = active_range(roster); 

    var all_cals = CalendarApp.getAllCalendars(); 
    all_cals = remove(all_cals); 

    var cal_names = calendar_names(all_cals);     

    for (var i_count = 0; i_count < 1; i_count++) {
        var lesson_pile = all_cals[i_count].getEvents(begin_this_month, end_next_month); 
        var lessons = []; 

        // creating data objects for each lesson within the window we are considering
        for (ii = 0; ii < lesson_pile.length; ii++) {
            var start = lesson_pile[ii].getStartTime(); 
            var end = lesson_pile[ii].getEndTime(); 
            var length = (end - start) / (1000 * 60 * 60); 
            var CAL = new CalendarInfo(lesson_pile[ii].getTitle(), start, length, lesson_pile[ii].getLocation()); 
            lessons.push(CAL); 
        }

        // returning the column that counts up the number of instructor lessons 
        var column = column_find(roster, cal_names, i_count); 

        //collect all clients under this particular instructor 
        roster_vals = roster.getRange(active[0], 1, active[1] - active[0], column).getValues(); 
        all_clients = []; 

        for (ii = 0; ii < roster_vals.length; ii++) {
            if (roster_vals[ii][column - 1]) {
                temp_ln = roster_vals[ii][0];
                temp_fn = roster_vals[ii][1]; 
                temp_guard = roster_vals[ii][2]; 
                temp_email = roster_vals[ii][3].split(',');

                // if email is blank, correct email is always stored a row or two up in the master roster
                // scan upwards until you get a hit
                if (temp_email[0] == "") {
                    jj = 1; 
                    while (temp_email[0] == "") {
                        temp_email = roster_vals[ii - jj][3].split(','); 
                        jj = jj + 1; 
                    }
                }

                if (temp_email.length > 1) {
                    temp_client = new Client(temp_ln, temp_fn, temp_guard, temp_email[0], temp_email[1]);
                }
                else {
                    temp_client = new Client(temp_ln, temp_fn, temp_guard, temp_email[0]);
                }
                all_clients.push(temp_client); 
            }
        }

    }
}
