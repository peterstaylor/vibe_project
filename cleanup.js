function cleanup() {
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  last_row = tracker.getLastRow(); 
  last_column = tracker.getLastColumn(); 
  tracker.getRange(3, 1, last_row-2, last_column).setValue(""); 
}