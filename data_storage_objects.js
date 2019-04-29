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