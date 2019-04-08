function forms_todo() {
    var end = new Date();
    // check for other events within the last week that are not fixed
    var start = end - 7*86400000;
    var start = new Date(start);
    var all_cals = CalendarApp.getAllCalendars();

    for (var i = 0; i < all_cals.length; i++) {
        var events = all_cals[i].getEvents(start, end); 
        var todos = []; 
        if (events.length > 0) {
            for (var j = 0; j < events.length; j++) {
                var desc = events[j].getDescription();
                if (desc == 'Y') {
                    // means it has been corrected
                }
                else if (desc == 'N') {
                    // means it has not been corrected
                    todos.push(events[j]);
                }
                else {
                    //means it has not been under the range of this app for the time being 
                    events[j].setDescription('N');
                    todos.push(events[j]);
                }
            }
        }

        if (todos.length > 0) {
           
            // what needs to happen? 
            /*
                1. get the event name
                2. get the email of the instructor
                3. get duration
                4. get location 
            */

        }
    }
    



}
