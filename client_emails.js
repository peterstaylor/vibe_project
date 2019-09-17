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

    var rosters = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA');
    var roster = rosters.getSheets()[1];

    var active = active_range(roster);

    var guardian_records = [];

    // this loops through all instructors to
    // result in the guard record array
    var calData = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0];
    var cdLastRow = calData.getLastRow();
    if (cdLastRow > 2){
      var calDataPile = calData.getRange(3, 1, cdLastRow-2, 13).getValues();
      var rosterLastColumn = roster.getLastColumn();
      var roster_vals = roster.getRange(active[0], 1, active[1] - active[0], rosterLastColumn).getValues();
      all_clients = [];

      for(var ii = 0; ii<calDataPile.length; ii++){
        // pretty much everything but the email can be grabbed quickly from calendar
        // data interpter
        var temp_ln = calDataPile[ii][0];
        var temp_fn = calDataPile[ii][1];
        var temp_guard = calDataPile[ii][2];
        var temp_inst_fn = calDataPile[ii][3].split(" ")[0];
        var temp_inst_ln = calDataPile[ii][3].split(" ")[1];
        var temp_inst = new instructor(temp_inst_fn, temp_inst_ln);
        var temp_thismonth = calDataPile[ii][9];
        var temp_nextmonth = calDataPile[ii][11];

        // find the email address from the roster
        for(var jj = 0; jj < roster_vals.length; jj++){
          if(temp_ln == roster_vals[jj][0] && temp_guard == roster_vals[jj][2]){
            temp_email = roster_vals[jj][3].split(',');
            break;
          }
        }
        // this is currently ignoring the (INVOICE) appendation
        // todo: add feature to LOOK for that line
        if(temp_email.length > 1){
          var first = temp_email[0].split(" ");
          var second = temp_email[1].split(" ");
          temp_client = new Client (temp_inst, temp_ln, temp_fn, temp_guard, first[0], second[0], temp_thismonth, temp_nextmonth);
        }
        else{
          var first = temp_email[0].split(" ");
          temp_client = new Client(temp_inst, temp_ln, temp_fn, temp_guard, first[0]);
          temp_client.thismonth = temp_thismonth;
          temp_client.nextmonth = temp_nextmonth;
        }
        all_clients.push(temp_client);

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
      var allAddresses = []; //this variable is for debugging purposes pre-rollout
      var newline = "<br></br>";
      var emailsSent = 0;
      //todo: loop thru test stable and copmare it to guardian records to determine email sending
      for (ii = 0; ii < guardian_records.length; ii++) {
      var match = false;
        // if we are not rolling out to all clients, check the test stable
        if(!rolloutBool){
          for(aa = 0; aa < testStable.length; aa++){
            var name = guardian_records[ii].name;
            var b1 = (testStable[aa][0] == guardian_records[ii].name);
            var b2 = false;
            for(bb = 0; bb < guardian_records[ii].client_records.length; bb++){
              var grlname = guardian_records[ii].client_records[bb].stud_ln;
              var tslname = testStable[aa][1];
              var b2 = (tslname == grlname);
              if(b2){
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
          allAddresses.push(guardian_records[ii].email);
          var message = "<p>";
          message = message + "Dear " + guardian_records[ii].name + ","
          message = message + newline;
          message = message + "<br>Here is a recap of the sessions that your Vibe instructor(s) recorded ";
          message = message + "as having taken place this month, as well as a projection of what they have ";
          message = message + "planned for the next month. Your invoice for next month will be sent in a few days, ";
          message = message + "and we we'll base it on this info.</br>";
          message = message + newline;
          message = message + "<br>If anything seems incorrect, simply click on the appropriate link and follow the prompt ";
          message = message + "to flag your instructor, and they will receive a notification to reach out to you. </br>";
          message = message + "<br>(Note: you won't receive another summary email after changes are made.)</br>";
          message = message + newline;
          message = message + "<br>We're thankful to be working with you!</br>";
          message = message + "<br>Vibe Music Academy</br>";
          for (jj = 0; jj < guardian_records[ii].client_records.length; jj++) {
              if (!(guardian_records[ii].client_records[jj].thismonth == 0 && guardian_records[ii].client_records[jj].nextmonth == 0)){
                var formtitle = "Calendar Discrepancy for " + guardian_records[ii].client_records[jj].stud_fn;
                formtitle = formtitle + " " + guardian_records[ii].client_records[jj].stud_ln;
                var existing = DriveApp.getFilesByName(formtitle);
                var neednew = true;
                while(existing.hasNext()){
                  var file = existing.next();
                  var tmpform = FormApp.openById(file.getId());
                  var tmpdesc = tmpform.getDescription().split(" ");
                  var subtmp = tmpdesc[2].split("\n")[0];
                  b1 = tmpdesc[1] == guardian_records[ii].client_records[jj].inst.firstname;
                  b2 = subtmp == guardian_records[ii].client_records[jj].inst.lastname;
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
                item.setTitle("Would you like us to prompt your instructor to reach out at their earliest conveinence to reconcile their calendar with you?")
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
              message = message + " lessons planned for next month.</br>";
              message = message + "<br><a href ='" + url + "'>If this info seems incorrect, please click here.</a></br>";
            }
          }
          message = message + "<br>---</br>";
          message = message + "</p>";


          if(!testRolloutBool && rolloutBool){
            // this stays here until i'm certain everything is working
            email_dest = "peters.taylor@gmail.com";
            //email_dest = guardian_records[ii].email;
          }
          else{
            email_dest = testEmail;
          }

          var headline = "Your Monthly Instruction Summary - From Vibe";
          if (emailsSent <= testCount && emailsSent < testStable.length){
            MailApp.sendEmail({
                to:email_dest,
                subject: headline,
                htmlBody: message,
            });
            emailsSent = emailsSent + 1;
          }
          else{
            ii = guardian_records.length;
          }

        }


      }
    }

}
