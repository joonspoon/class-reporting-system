function getCurrentLevel(){
  var classID = FormApp.getActiveForm().getId();
  return getClassData(classID)[2];
}

function getClassIndex(){

  var classSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1REN8XXjnovALoQdJ2eSueFbi7T_DxnS1sGn8qF3jUNE/edit#gid=0';
  var classDataSpreadsheet = SpreadsheetApp.openByUrl(classSpreadsheetURL);
  var classIDColumn = 0;

  var classData = classDataSpreadsheet.getSheetValues(1, 1, classDataSpreadsheet.getLastRow(), classDataSpreadsheet.getLastColumn());
  for (i = 0; i < classData.length; i++) {
    if(classData[i][classIDColumn] == FormApp.getActiveForm().getId()) {
      return i;
    }
  }
}

function getClassData(classID){
  var classData = new Array();
  var spreadsheetURL = "https://docs.google.com/spreadsheets/d/1REN8XXjnovALoQdJ2eSueFbi7T_DxnS1sGn8qF3jUNE/edit#gid=0";
  var classDataSpreadsheet = SpreadsheetApp.openByUrl(spreadsheetURL);
  return classDataSpreadsheet.getSheetValues(getClassIndex(classID) + 1, 1, 1, 17)[0];
}
