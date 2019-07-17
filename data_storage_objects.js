function CalendarInfo(title, date, duration, location) {
    this.title = title; 
    this.date = date; 
    this.duration = duration; 
    this.location = location; 
}

function StudentReturn(num_lessons_pm, num_lessons_tm, num_lessons_nm, num_tf_pm, num_tf_tm, num_tf_nm, lesson_length, bill_date) {
    this.num_lessons_pm = num_lessons_pm; 
    this.num_lessons_tm = num_lessons_tm; 
    this.num_lessons_nm = num_lessons_nm; 
    this.num_tf_pm = num_tf_pm; 
    this.num_tf_tm = num_tf_tm; 
    this.num_tf_nm = num_tf_nm; 
    this.lesson_length = lesson_length; 
    this.bill_date = bill_date;
}

function instructor(fname, lname) {
    this.firstname = fname; 
    this.lastname = lname; 
}

function Client(inst, stud_ln, stud_fn, guardian, email1, email2, thismonth, nextmonth) {
    this.inst = inst; 
    this.stud_ln = stud_ln; 
    this.stud_fn = stud_fn; 
    this.guardian = guardian; 
    this.email1 = email1;
    this.email2 = email2; 
    this.thismonth = thismonth; 
    this.nextmonth = nextmonth; 
}

function Guardian_Record(name, email, client_records) {
    this.name = name; 
    this.email = email; 
    this.client_records = client_records; 
}