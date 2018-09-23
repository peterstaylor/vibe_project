function final_sort() {
  var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0]; 
  var last_row = tracker.getLastRow(); 
  var last_column = tracker.getLastColumn(); 
  
  // first step is to just sort everything by the client last name
  tracker.getRange(3, 1, last_row, last_column).sort({ column: 1, ascending: true }); 

  // next we need to solve the problem of different clients with the same last name
  
  var names = tracker.getRange(3, 1, last_row, 3).getValues(); 
  
  var point = 0;     // we start looking at the first row of data 
  
 while (point < names.length){
	
	
	for(var spread = 1; names[point][0] == names[point+spread][0] ; spread++){
		
	}
	if (spread == 1){
		point = point + 1; 
	}
	else{
		tracker.getRange(point+3,1, point+3+spread-1, last_column).sort({ column: 3, ascending: true });
		point = point + spread; 
	}
  }
  
  Logger.log(names[3][0]); 
}
