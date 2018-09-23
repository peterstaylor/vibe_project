function final_sort() {
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  var last_row = tracker.getLastRow(); 
  var last_column = tracker.getLastColumn(); 
  
  var point = 3;     // we start looking at row three
  
  
 while (point <= last_row){
	var names = tracker.getRange(3, 1, last_row, 3).getValues(); 
	
	for(var spread = 0; 
  }
  
  Logger.log(names[3][0]); 
}
