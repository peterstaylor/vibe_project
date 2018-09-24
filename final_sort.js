function final_sort() {
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  var last_row = tracker.getLastRow(); 
  var last_column = tracker.getLastColumn(); 
  
  // first step is to just sort everything by the client last name
  tracker.getRange(3, 1, last_row, last_column).sort({ column: 3, ascending: true }); 
  tracker.getRange(3, 1, last_row, last_column).sort({ column: 1, ascending: true }); 


}