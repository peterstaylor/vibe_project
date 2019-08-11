// NOTE: this code had to be saved with teh email gui spreadsheet
// so it would be accessible to the script button 

function refreshEmailGui(){
  var rosters = SpreadsheetApp.openById('1_GwAU5cVNQEki7dH-jCqNiqy_bhAlQeH_yBOFCdg7TA');
  var roster = rosters.getSheets()[1];
  var active = active_range(roster);
  var data = roster.getDataRange().getValues();
  var start = active[0] - 1;
  var end =  active[1] - 1;

  var outputs = [];
  for(ii = start; ii <end; ii++){
    var skip = false;
    var line = data[ii][2] + " " + data[ii][0]
    for(jj = 0; jj<outputs.length; jj++){
      if (outputs[jj] == line || data[ii][0] == "" || data[ii][0] == "BUSINESS PARTNERSHIPS"){
        skip = true;
        break;
      }
    }
    if (skip == false){
      outputs.push([line]);
    }
  }

  var gui = SpreadsheetApp.openById('1dqGPiFz4jNzQCKopn64r6C2Hak0dcvB2IHVKLCR8xtI').getSheets()[0];
  var lastRow = gui.getDataRange().getLastRow();
  gui.getRange(2, 3, lastRow, 1).clearContent();
  gui.getRange(2, 3, outputs.length, 1).setValues(outputs);
}
