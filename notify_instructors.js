function notify_instructors(){
  var all = DriveApp.getFiles();
  var contact_forms = [];

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
  debug;
}
