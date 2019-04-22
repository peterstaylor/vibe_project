function client_emails() {
    var dates = date_management();
    var begin_this_month = dates[2];
    var end_this_month = dates[3];
    var begin_next_month = dates[4];
    var end_next_month = dates[5];

    var rosters = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA');
    var roster = rosters.getSheets()[1];

    // get active range 
    var lr = roster.getLastRow();
    var m = 0;
    var start = 0;
    var finish = 0;
    var colors = roster.getRange(1, 1, lr, 1).getBackgrounds();
    var barrier = "#00ff00"; 
    for (var j = 0; j < colors.length && m < 2; j++) {
        if (colors[j] == barrier && m == 0){
            start = j + 2; // this stores the first row of data
            m = m + 1; 
        }
        else if (colors[j] == barrier && m == 1){
            finish = j; 
            m = m + 1; 
        }

    }

}
