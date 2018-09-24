function scan_calendar(events, client) {
    // first get the client name
    var name = client.split(' ')[0]; // we will use name[0] by default

    // create an empty array to return the student information
    var Student_Info = []; 

    for (jj = 0; jj < PML.length; jj++) {

        // split up the title by spaces 
        var title = events[jj].title.split(' '); 

        // check for cancellation
        if (title[0].slice(0, 6) == 'CANCEL' || title[0].slice(0, 7) == '[CANCEL' ||title[0].slice(0, 7) == '(CANCEL') {
            for (kk = 1; kk < title.length; kk++) {
                // check if the name of the client is in the calendar event
                if (title[kk] == name) {
                    // check if the student array is empty, i.e. it's the first match
                    if (Student_Info == []) {
                        // check for a travel fee
                        if (events[jj].location.split(' ')[0] == 'FEE') {
                            var travel_fee = 1; 
                        }
                        else {
                            var travel_fee = 0; 
                        }
                        var Line1 = new StudentReturn(1, travel_fee , events[jj].duration)
                        Student_Info.push(Line1); 
                    }
                    // if it's not the first time we have checked
                    else {
                        // check for a travel fee
                        if (events[jj].location.split(' ')[0] == 'FEE') {
                            var travel_fee = 1; 
                        }
                        else {
                            var travel_fee = 0; 
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
                                mm = Student_Info.length; 
                            }
                        }

                        // now we have determined if we need a new row or not
                        // if row of info is still equal to 999 we need to create a new row
                        if (row_of_info == 999) {
                            var NewLine = new StudentReturn(1, travel_fee, duration_check); 
                            Student_Info.push(NewLine); 
                        }
                        // if we don't need a new row, just update number of lessons and travel fee
                        else {
                            Student_Info[mm].num_lessons++;
                            Student_Info[mm].num_travelfees = Student_Info[mm].num_travelfees + travel_fee; 
                        }
                    }
                }
            }
        }
        // if there was not a cancellation
        else {

        }

    }
    return Student_Info; 
}