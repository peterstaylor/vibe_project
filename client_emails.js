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
                    temp_client = new Client(cal_names[i_count], temp_ln, temp_fn, temp_guard, temp_email[0], temp_email[1]);
                }
                else {
                    temp_client = new Client(cal_names[i_count], temp_ln, temp_fn, temp_guard, temp_email[0]);
                }
                // initialize these to zero so we can count later 
                temp_client.thismonth = 0; 
                temp_client.nextmonth = 0; 
                all_clients.push(temp_client); 
            }
        }
        Logger.log(all_clients); 
        // now with all clients and all lessons in our window collected we can begin 
        var big_list = []; 
        for (ii = 0; ii < all_clients.length; ii++) {

            for (jj = 0; jj < lessons.length; jj++) {
                title = lessons[jj].title.split(' ');
                firstname = all_clients[ii].stud_fn.split(' ');
                lastname = all_clients[ii].stud_ln.split(' ')[0];

                // check for cancellation or free trial, neither get counted for billing
                if (title[0] == 'CANCELED' || title[0] == 'CANCELLED' || title[0] == '[CANCELLED]' || title[0] == '(CANCELLED)' || title[0] == 'FREE') {
                }

                // check for cancellation or free trial, neither get counted for billing
                else if (title[1] == 'CANCELED' || title[1] == 'CANCELLED' || title[1] == '[CANCELLED]' || title[1] == '(CANCELLED)' || title[1] == 'FREE') {
                }

                // again we are checking to see if there is a match between client info and calendar info
                else {
                    for (kk = 0; kk < title.length; kk++){
                        if ((title[kk] == firstname[0] && title[kk + 1] == lastname) || (title[kk] == firstname[0] && title[kk + 1] == firstname[1])) {
                            if (lessons[jj].date >= begin_next_month) {
                                all_clients[ii].nextmonth = all_clients[ii].nextmonth + 1; 
                            }
                            else {
                                all_clients[ii].thismonth = all_clients[ii].thismonth + 1; 
                            }
                            kk = title.length;
                        }
                    }
                }
            }
        }
    }
    // here is where we push the list of all clients up to the next level 
    // scan through the big list for a client name that matches
    // if it matches we append to the end of the list itme
    // if no matches, we push it ot the end of the big list 

    // first pass big list is empty 
    if (big_list.length == 0) {
        for (ii = 0; ii < all_clients.length; ii++) {
            temp_list = new List(all_clients[ii], null); 
            big_list.push(temp_list); 
        }
    }


    else {
        for (ii = 0; ii < all_clients.length; ii++) {
            for (jj = 0; jj < big_list.length; jj++) {

            }
        }
    }
    
}
