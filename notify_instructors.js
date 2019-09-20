function notify_instructors(){
  var all = DriveApp.getFiles();
  var contact_forms = [];

// collecting all instructor contact forms
var emails = [];
  while(all.hasNext()){
    var tmp = all.next();
    var name = tmp.getName().split(" ");
    var b1 = name[0] == "Calendar";
    var b2 = name[1] == "Discrepancy";

    if (b1 && b2){
      contact_forms.push(tmp);
    }
  }
  // boolean re: if the instructor database has been opened
  var opened = false;
  var alreadySent = false;
  var logSS = SpreadsheetApp.openById("1dqGPiFz4jNzQCKopn64r6C2Hak0dcvB2IHVKLCR8xtI").getSheets()[1];
  var logRange = logSS.getDataRange().getValues();

 // new code to check for old data in the email out log
  if (logRange.length > 1){
    var checkTime = new Date();
    checkTime.setDate(checkTime.getDate() -1);
    for (ii = 0; ii<logRange.length; ii++){
      if (logRange[ii][0] < checkTime){
        logRange.splice(ii, 1);
        ii = ii - 1;
      }
    }
  }
  for(ii = 0; ii<contact_forms.length; ii++){
    var alreadySent = false;
    var id = contact_forms[ii].getId();
    var form = FormApp.openById(id);
    var start = new Date();
    start.setHours(0,0,0,0);
    var responses = form.getResponses(start);

    // this is the condition that we check to see if we need to send a message
    if (responses.length > 0){
      var resplen = responses.length;
      var answer = responses[resplen-1].getItemResponses()[0].getResponse();
      // if this is true we know to notify the instructor
      if (answer == "Yes"){
        // to do: add error handling so if instructor email is unset we get a notification
        var instEmail = "unset";
        if(opened == false){
          var instSS = SpreadsheetApp.openById("1zDeEDDzH7i7SLFz4YBZe6xRYOZXC0e7Ge3nbYgX0Ew4").getSheets()[0];
          var range = instSS.getDataRange().getValues();
          opened = true;
        }
        var description = form.getDescription().split("\n");
        var instFN = description[0].split(" ")[1];
        var instLN = description[0].split(" ")[2];
        var client = description[1].split(" ")[1] + " " + description[1].split(" ")[2];

        // grabbing the instructor's email
        // after this loop aa contains the instructor row
        for (aa = 2; aa <range.length; aa++){
          var nameColumn = range[aa][0].split(",");
          if (nameColumn.length > 1){
            var scannedLN = nameColumn[0];
            var scannedFN = nameColumn[1].trim();
          }
          else{
            var scannedLN = "dummy"
            var scannedFN = "other dummy"
          }
          if (scannedLN == instLN && scannedFN == instFN){
            instEmail = range[aa][4];
            break;
          }
        }
        var studentNameArray = contact_forms[ii].getName().split(" ");
        var studentName = "";
        for(var xx = 3; xx < studentNameArray.length; xx++){
          studentName = studentName + studentNameArray[xx] + " ";
        }
        // check the spreadsheet for matches in the last 24 hours of sends
        for (var zz = 0; zz <logRange.length; zz++){
          if(logRange[zz][1] == studentName && logRange[zz][2] == client && logRange[zz][3] == instLN && logRange[zz][4] == instFN){
            alreadySent = true;
            break;
          }
        }

        if (alreadySent == false){
          emails.push(instEmail);
          var headline = "TIME SENSITIVE: Please reach out to " + client;
          var message = "<br>Hello " + instFN + ",</br>";
          message = message + "<br>It's been requested by " + client + " that you reach out at your ";
          message = message + "earliest convenience to fix a discrepancy in your teaching calendar that pertains ";
          message = message + "to their upcoming invoice. Please do so as soon as possible.</br>";
          message = message + "<br></br>";
          message = message + "<br>Thank you!</br>";
          //instEmail = "peters.taylor@gmail.com"
          MailApp.sendEmail({
            to: instEmail,
            subject: headline,
            htmlBody: message,
          })
          //todo : add code here to print emailed info to log spreadsheet
          var now = new Date();
          var newRow = [now, studentName, client, instLN, instFN];
          logRange.push(newRow);
        }
      }
    }
  }
  if (emails.length > 0){
    var debugmsg = "";
    for(rr=0 ; rr<emails.length; rr++){
      debugmsg = debugmsg + "<br>" + emails[rr] + "</br>";
    }
    MailApp.sendEmail({
      to: "john@vibemusicacademy.com",
      subject: "Instructor Notification Debug",
      htmlBody: debugmsg,
    })
  }

  logSS.getRange(1,1, logRange.length, 5).setValues(logRange);
}
