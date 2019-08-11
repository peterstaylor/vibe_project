function notify_instructors(){
  var all = DriveApp.getFiles();
  var contact_forms = [];

// collecting all instructor contact forms
  while(all.hasNext()){
    var tmp = all.next();
    var name = tmp.getName().split(" ");
    var len = name.length;
    var b1 = name[len-1] == "Form";
    var b2 = name[len-2] == "Contact";
    var b3 = name[len-3] == "Instructor";

    if (b1 && b2 && b3){
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
          //todo open spreadsheet and grab instructor email address
          var instSS = SpreadsheetApp.openById("1zDeEDDzH7i7SLFz4YBZe6xRYOZXC0e7Ge3nbYgX0Ew4").getSheets()[0];
          var range = instSS.getDataRange().getValues();
          opened = true;
        }
        var studentNameArray = contact_forms[ii].getName().split(" ");
        var description = form.getDescription().split("\n");
        var instFN = description[0].split(" ")[1];
        var instLN = description[0].split(" ")[2];

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

        var client = description[1].split(":")[1].substring(1);

        for(nn = 0; nn<studentNameArray.length; nn++){
          if(studentNameArray[nn] == "Instructor")
            break;
        }
        var studentName = "";
        for(mm = 0; mm < nn; mm++){
          studentName = studentName + studentNameArray[mm] + " "
        }
        studentName = studentName.substring(0, studentName.length -1)
        // then somehow get it to register and save that the message was sent
        var headline = client + " has requested you to contact them";
        var message = "<br>Hello " + instFN + ",</br>";
        message = message + "<br>Your client " + client + " has logged a request for you to ";
        message = message + "contact them regarding " + studentName + "'s recent lessons.</br>";
        message = message + "<br>Please contact them at your earliest convenience to sort out any issues.</br>"
        instEmail = "peters.taylor@gmail.com"
        MailApp.sendEmail({
          to: instEmail,
          subject: headline,
          htmlBody: message,
        })
      }
    }
  }
}
