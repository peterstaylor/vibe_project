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

    }
}
