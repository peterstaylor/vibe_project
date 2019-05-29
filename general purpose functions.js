function cleanup() {
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  last_row = tracker.getLastRow(); 
  last_column = tracker.getLastColumn(); 
  tracker.getRange(3, 1, last_row-2, last_column).setValue(""); 
}

function column_find(roster, cal_names, i_count) {
    var column = 0;
    var last_column = roster.getLastColumn();
    var top_row = roster.getRange(1, 1, 1, last_column).getValues();
    for (ii = 0; ii < top_row.length && column == 0; ii++) {
        if (cal_names[i_count].firstname == top_row[ii].split(" ")[0]) {
            column = ii + 1;
        }
    }

    return column; 
}

function calendar_names(all_cals) {
    var fname, lname, inst; 
    var cal_names = []; 

    for (ii = 0; ii < all_cals.length; ii++) {
        fname = all_cals[ii].getName().split(" ")[0].split("@")[0];
        lname = all_cals[ii].getName().split(" ")[1];
        inst = new instructor(fname, lname);
        cal_names.push(inst);
    }

    return cal_names; 
}