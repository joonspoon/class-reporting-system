function notifyTeachers(e) {
  var form = FormApp.getActiveForm();
    
  var subject = "your class plan for next week";
  var message = 'Prepared for: ' + form.getTitle();
  var teacherEmail = "joonspoon@gmail.com," + getTeacherEmail(form.getId());
    
  var itemResponses = e.response.getItemResponses();
    message += "<br><br>Exercises planned for next week...";
    message += "<br>" + getNextWeek(itemResponses);
  
    message += "<br><br>Please fill out the <a href='"
    message += form.getPublishedUrl()
    message += "'>class report form</a> after class :)"; 
    
    MailApp.sendEmail({
     to: teacherEmail,
     subject: subject,
     htmlBody:  message
   });

}

function getNextWeek(formResponses) {
  for (var i = 0; i < formResponses.length; i++) {
    var itemTitle = formResponses[i].getItem().getTitle();
    if(itemTitle == "Which exercises are you planning for next week?") {
      return getClassPlan(formResponses[i].getResponse()); 
    }
  } 
}

function getClassPlan(arrayOfRecipes){
  var classPlan = "";
  for (var i = 0; i < arrayOfRecipes.length; i++) {
    classPlan += getRecipeInfo(cleanUpNotes(arrayOfRecipes[i])) + "<br>";
  }
  return classPlan;
}

function getRecipeInfo(recipeName) {
  var recipeInfo = "";
  var recipeSpreadsheetURL = getRecipeListURL(getCurrentLevel());
  var recipeDatabase = SpreadsheetApp.openByUrl(recipeSpreadsheetURL);
  var recipeSheets = recipeDatabase.getSheets();
  for (var i = 0; i < recipeSheets.length; i++) {
    var recipeSheet = recipeSheets[i];
    var recipeData = recipeSheet.getSheetValues(1, 1, recipeSheet.getLastRow(), recipeSheet.getLastColumn());
    for (j = 0; j < recipeData.length; j++) {
      var recipeRow = recipeData[j];
      if(recipeRow[0] == recipeName) {
        recipeInfo += "<br><a href='" + recipeRow[1] + "'>" +  recipeRow[0] + "</a>";                        //recipe link
        if(recipeRow[7])  recipeInfo += "<br><a href='" + recipeRow[7] + "'>Solution</a>";                   //solution link
        if(recipeRow[6])  recipeInfo += "<br>Teaching Notes: " + recipeRow[6];                               //teaching notes, if any
        if(recipeRow[2])  recipeInfo += "<br>This recipe usually takes " + recipeRow[2] + " hours.";         //duration, if any
        if(recipeRow[5])  recipeInfo += "<br><span style='background-color: #FFA500'>" + recipeRow[5] + "</span>";         //warning  if any
      }
    }
  }
  if(recipeInfo) 
    return recipeInfo;
  else 
    return recipeName + " (not found in database)";
}

function getTeacherEmail(formID){

  var classSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1REN8XXjnovALoQdJ2eSueFbi7T_DxnS1sGn8qF3jUNE/edit#gid=0';
  var classDataSpreadsheet = SpreadsheetApp.openByUrl(classSpreadsheetURL);
  
  var teacherEmailColumn = 4;
  var helperEmailColumn = 6;
  var classIDColumn = 0;
  
  var classData = classDataSpreadsheet.getSheetValues(1, 1, classDataSpreadsheet.getLastRow(), classDataSpreadsheet.getLastColumn());
  for (i = 0; i < classData.length; i++) {
    if(classData[i][classIDColumn] == formID) {
      var teacherEmail = classData[i][teacherEmailColumn];
      var helperEmail = classData[i][helperEmailColumn];
      return teacherEmail + "," + helperEmail;
    }
  }
}

function cleanUpNotes(testString){
  var containsDash = testString.indexOf(" - ") > -1;
  var containsComment = testString.indexOf("// ") > -1;
  var endsInANumber = isNumeric(testString.substring(testString.indexOf(" - ") + 3));
  if(containsComment) testString = testString.substring(3, testString.length);
  if(containsDash & endsInANumber) testString = testString.substring(0, testString.indexOf(" - "));
  return testString;
}




