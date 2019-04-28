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
    var cal_names = []; 

    // removing unneeded calendars
    for (var ii = 0; ii < all_cals.length; ii++) {
        if ((all_cals[ii].getName() == 'Admin') || (all_cals[ii].getName() == '-')) {
            all_cals.splice(ii, 1); 
        }
    }

    for (ii = 0; ii < all_cals.length; ii++) {
        cal_names.push(all_cals[ii].getName().split(" ")[0].split("@")[0] + " " + all_cals[ii].getName().split(" ")[1]); 
    }
}
