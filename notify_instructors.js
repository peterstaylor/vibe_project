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
        if(opened == false){
          //todo open spreadsheet and grab instructor email address
        }
        else{

        }
      }
    }

  }

  debug;
}
