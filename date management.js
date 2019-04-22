function date_management() {
        // get current date
        var now = new Date();
        var month = now.getMonth();
        var year = now.getFullYear();

        // formatting date information 
        // december
        if (month == 11) {
            var begin_this_month = new Date(year, month, 1, 0, 0, 0, 0);
            var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
            var begin_next_month = new Date(year + 1, 0, 1, 0, 0, 0, 0);
            var end_next_month = new Date(year + 1, 0, 31, 23, 59, 59, 999);
            var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
            var end_prev_month = new Date(year, month - 1, 30, 23, 59, 59, 999);
        }

        else {
            var begin_this_month = new Date(year, month, 1, 0, 0, 0, 0);
            var begin_next_month = new Date(year, month + 1, 1, 0, 0, 0, 0);

            // january 
            if (month == 0) {
                var begin_prev_month = new Date(year - 1, 11, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year - 1, 11, 31, 23, 59, 59, 999);
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { 	// leap year
                    var end_next_month = new Date(year, month + 1, 29, 23, 59, 59, 999);
                }
                else {
                    var end_next_month = new Date(year, month + 1, 28, 23, 59, 59, 999);
                }
            }

            // february
            else if (month == 1) {
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);

                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                    var end_this_month = new Date(year, month, 29, 23, 59, 59, 999);
                }
                else {
                    var end_this_month = new Date(year, month, 28, 23, 59, 59, 999);
                }
            }
            //march, may, august, october
            else if ((month == 2) || (month == 4) || (month == 7) || (month == 9)) {
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 30, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                if (month == 2) {
                    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                        var end_prev_month = new Date(year, 1, 29, 23, 59, 59, 999);
                    }
                    else {
                        var end_prev_month = new Date(year, 1, 28, 23, 59, 59, 999);
                    }
                }
                else if (month == 7) {
                    var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);
                }
                else {
                    var end_prev_month = new Date(year, month - 1, 30, 23, 59, 59, 999);
                }
            }
            // april, june, september, november
            else if ((month == 3) || (month == 5) || (month == 8) || (month == 10)) {
                var end_this_month = new Date(year, month, 30, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 31, 23, 59, 59, 999);
            }
            else if (month == 6) {
                var end_this_month = new Date(year, month, 31, 23, 59, 59, 999);
                var end_next_month = new Date(year, month + 1, 31, 23, 59, 59, 999);
                var begin_prev_month = new Date(year, month - 1, 1, 0, 0, 0, 0);
                var end_prev_month = new Date(year, month - 1, 30, 23, 59, 59, 999);
            }

        }
        return [begin_prev_month, end_prev_month, begin_this_month, end_this_month, begin_next_month, end_next_month]; 
    }
