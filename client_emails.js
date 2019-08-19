// current version is attached to client emails gui spreadsheet

function client_emails() {
    var dates = date_management();
    var begin_this_month = dates[2];
    var end_this_month = dates[3];
    var begin_next_month = dates[4];
    var end_next_month = dates[5];

    var gui = SpreadsheetApp.openById('1dqGPiFz4jNzQCKopn64r6C2Hak0dcvB2IHVKLCR8xtI').getSheets()[0];
    var rollout = gui.getRange(7, 1, 1,1).getValue();
    var testRolloutBool = false;

    if (rollout == "No"){
      var rolloutBool = false
      var Avals = gui.getRange("F2:F").getValues();
      var Alast = Avals.filter(String).length;
      var testStable = gui.getRange(2,6,Alast, 2).getValues();
      var test = gui.getRange(10,1,1,1).getValue();
      if(test == "Yes"){
        testRolloutBool = true;
        var testEmail = gui.getRange(13,1,1,1).getValue();
        var testCount = gui.getRange(16,1,1,1).getValue();
      }
    }
    else{
      var rolloutBool = true
    }

    // testing booleans to see how final loop should run
    if (testRolloutBool && !rolloutBool){
      var loopLength = testCount;
      var email_dest = testEmail;
    }
    else {
      var loopLength = guardian_records.length;
    }

    var rosters = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA');
    var roster = rosters.getSheets()[1];

    var active = active_range(roster);

    var all_cals = CalendarApp.getAllCalendars();
    all_cals = remove(all_cals);

    var cal_names = calendar_names(all_cals);
    var guardian_records = [];

    // this loops through all instructors to
    // result in the guard record array
    all_clients = [];
    for (var i_count = 0; i_count < all_cals.length; i_count++) {
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

        // now with all clients and all lessons in our window collected we can begin
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

    // all client information for all instructors is in all_clients now
    // each guardian can have multiple client entries, client entries are per instructor
    for (ii = 0; ii < all_clients.length; ii++) {
        if (guardian_records.length == 0) {
            var tmp = new Guardian_Record(all_clients[ii].guardian, all_clients[ii].email1, [all_clients[ii]]);
            guardian_records.push(tmp);

        }
        else {
            for (jj = 0; jj < guardian_records.length; jj++) {
                // looking in the existing guardian records for a match
                yes = 0;
                if (guardian_records[jj].email == all_clients[ii].email1) {
                    guardian_records[jj].client_records.push(all_clients[ii]);
                    jj = guardian_records.length;
                    yes = 1;
                }
            }
            if (yes == 0) {
                var tmp = new Guardian_Record(all_clients[ii].guardian, all_clients[ii].email1, [all_clients[ii]]);
                guardian_records.push(tmp);
            }
        }
    }

    // this section will create the emails and forms
    var newline = "<br></br>";
    //todo: loop thru test stable and copmare it to guardian records to determine email sending
    for (ii = 0; ii < loopLength; ii++) {

      // if we are not rolling out to all clients, check the test stable
      if(!rolloutBool){
        for(aa = 0; aa < testStable.length; aa++){
          b1 = (testStable[aa][0] == guardian_records[ii].name);
          for(bb = 0; bb < guardian_records[ii].length; bb++){
            if(testStable[aa][1] == guardian_records[ii].client_records[bb].stud_ln){
              b2 = true;
              break;
            }
          }
          if(b1 && b2){
            var match = true;
            break;
          }
        }
      }

      if(match || rolloutBool){
        var message = "<p>";
        message = message + "Dear " + guardian_records[ii].name + ","
        message = message + newline;
        message = message + "<br>This is some placeholder text for John to help me write.</br>"
        for (jj = 0; jj < guardian_records[ii].client_records.length; jj++) {
            var formtitle = guardian_records[ii].client_records[jj].stud_fn;
            formtitle = formtitle + " " + guardian_records[ii].client_records[jj].stud_ln;
            formtitle = formtitle + " Instructor Contact Form";
            var existing = DriveApp.getFilesByName(formtitle);
            var neednew = true;
            while(existing.hasNext()){
                var file = existing.next();
                var tmpform = FormApp.openById(file.getId());
                var tmpdesc = tmpform.getDescription().split(" ");
                b1 = tmpdesc[1] == guardian_records[ii].client_records[jj].inst.firstname;
                b2 = tmpdesc[2] == guardian_records[ii].client_records[jj].inst.lastname;
                if(b1 && b2){
                  var form = tmpform;
                  neednew = false;
                  break;
                }
            }
            if (neednew == true){
              // to do: add more detail into form itself so it's easier to grab info later
              formdesc = "Instructor: " + guardian_records[ii].client_records[jj].inst.firstname;
              formdesc = formdesc + " " + guardian_records[ii].client_records[jj].inst.lastname;
              formdesc = formdesc + "\n";
              formdesc = formdesc + "Client: " + guardian_records[ii].name;
              var form = FormApp.create(formtitle);
              form.setDescription(formdesc);
              form.setRequireLogin(false);
              var url = form.getPublishedUrl();
              var item = form.addMultipleChoiceItem();
              item.setTitle("Would you like to report an issue with the lesson tally this month? If you select 'yes' your instructor will be notified to contact you.")
                  .setChoices([
                  item.createChoice('Yes'),
                  item.createChoice('No')
                  ])
                  .showOtherOption(false);
            }
            var url = form.getPublishedUrl();
            message = message + "<br>---</br>";
            message = message + newline;
            message = message + "<br>Student Name: " + guardian_records[ii].client_records[jj].stud_fn + " " + guardian_records[ii].client_records[jj].stud_ln + "</br>";
            message = message + newline;
            message = message + "<br>Instructor: " + guardian_records[ii].client_records[jj].inst.firstname + " " + guardian_records[ii].client_records[jj].inst.lastname + "</br>";
            message = message + newline;
            message = message + "<br>" + guardian_records[ii].client_records[jj].stud_fn;
            message = message + " had " + guardian_records[ii].client_records[jj].thismonth;
            message = message + " lessons this month and has " + guardian_records[ii].client_records[jj].nextmonth;
            message = message + " lessons scheduled next month.</br>";
            message = message + "<br>If there are any issues with this, please click the link below";
            message = message + " to fill out a form that will result in your instructor contacting you";
            message = message + " in order to rectify the situation.</br>";
            // todo: this link will be to the actual form eventually
            message = message + "<br><a href ='" + url + "'>Link to click.</a></br>";
        }
        message = message + "<br>---</br>";
        message = message + "<br>Thank you very much for your assistance in maintaining an ";
        message = message + "accurate account of lessons for billing purposes.</br>";
        message = message + "<br>Please respond to this email if you have any questions.</br>";
        message = message + newline;
        message = message + "<br>Closer closer closer closer, can put whatever text you want here.</br>";
        message = message + "</p>";

        // todo: add functionality so this can be rolled out to only certain clients
        if(!testRolloutBool && rolloutBool){
          // this stays here until i'm certain everything is working
          email_dest = "peters.taylor@gmail.com";
          //email_dest = guardian_records[ii].email;
        }

        headline = "Your Monthly Lesson Report From Vibe Music Academy";
        MailApp.sendEmail({
            to:email_dest,
            subject: headline,
            htmlBody: message,
        });
      }


    }
}
