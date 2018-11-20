// this is to handle billing date output
function bill_date_handling() {
    var tracker = SpreadsheetApp.openById('1isEdFurIx497X4XgrO5PDwA45wpc3Jo_psnS8MZmsi8').getSheets()[0];
    var last_row = tracker.getLastRow();
    var test = tracker.getRange(3, 14, last_row - 3, 1).getValues();
    Logger.log(test[0] == 'undefined');
}