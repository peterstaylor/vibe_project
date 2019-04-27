function active_range(roster) {
    var output = []; 

    var lr = roster.getLastRow();
    var m = 0;
    var colors = roster.getRange(1, 1, lr, 1).getBackgrounds();
    var barrier = "#00ff00";
    for (var j = 0; j < colors.length && m < 2; j++) {
        if (colors[j] == barrier && m == 0) {
            output.push(j + 2); 
            m = m + 1;
        }
        else if (colors[j] == barrier && m == 1) {
            output.push(j); 
            m = m + 1;
        }
    } 

    return output;  
}
