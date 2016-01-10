function Recipe(name, duration) {
  this.name = name;
  this.duration = duration;
  this.hasBeenCompleted = false;
}

function getRecipesForLevel(level){
  var recipes = new Array();
  var recipeDatabase = SpreadsheetApp.openByUrl(getRecipeListURL(level));
  var recipeSheets = recipeDatabase.getSheets();
  for (var sheetIndex = 0; sheetIndex < recipeSheets.length; sheetIndex++) {
    var recipeSpreadsheet = recipeSheets[sheetIndex];
    recipes.push(new Recipe("------------ " + recipeSpreadsheet.getName().toUpperCase() + " ------------", ""));
    var recipeData = recipeSpreadsheet.getSheetValues(2, 1, recipeSpreadsheet.getLastRow(), recipeSpreadsheet.getLastColumn());
    for (var rowIndex = 0; rowIndex < recipeData.length; rowIndex++) {
      var recipeRow = recipeData[rowIndex];
      var recipeName = recipeRow[0];
      var recipeDuration = recipeRow[2];
      var newRecipe = new Recipe(recipeName, recipeDuration);
      recipes.push(newRecipe);
    }
  }
  return recipes;
}

function getCompletedExercises() {
 var completedExercises = new Array();
 var form = FormApp.getActiveForm();
 var formResponses = form.getResponses();
 for (var i = 0; i < formResponses.length; i++) {
   var formResponse = formResponses[i];
   var itemResponses = formResponse.getItemResponses();
   for (var j = 0; j < itemResponses.length; j++) {
     var itemResponse = itemResponses[j];
     if(itemResponse.getItem().getTitle() == "Which exercises did you work on?") {
       var responseToCompletedQuestion = itemResponse.getResponse(); 
       for (var k = 0; k < responseToCompletedQuestion.length; k++) {      //a response may include more than one recipe
         completedExercises.push(responseToCompletedQuestion[k]);                                                  
       }
     }
   }
 }
 return completedExercises;
}

function addCompletionStateToRecipeList(recipeList){
  for (var i = 0; i < recipeList.length; i++) {
    var currentRecipe = recipeList[i];
    if(hasBeenCompleted(currentRecipe.name))
       currentRecipe.hasBeenCompleted = true;
  }
}
       
function hasBeenCompleted(recipeName){
  return arrayContains(getCompletedExercises(), recipeName);
}
       
function arrayContains(array, lookingFor){
  for (var i = 0; i < array.length; i++) {
    if (array[i] == lookingFor) {
      return true;
    }
  }
  return false;
}

function getRecipeListURL(level){
  if(level == 0)
    return 'https://docs.google.com/spreadsheets/d/1Euiexf6KwYUAggVl5moXMV_4bBUFCkoaOb0dzphlRXw/edit#gid=1480952463';
  if(level == 1)
    return 'https://docs.google.com/spreadsheets/d/15dI13rkosH5vt11HjMIhRtinCdcR6keDOLrEHmbZdLY/edit#gid=0';
  else if (level == 3)
    return "https://docs.google.com/spreadsheets/d/1uO27iEOjO8AgzJDjhUAldzXkVHo-ROMbKd49Mk6aIeA/edit#gid=0";
  else if (level == 4)
    return "https://docs.google.com/spreadsheets/d/1u3jL0afHPIQvUlmcQDFrpaZ4AEcOlZ7t6_ac8FBHpjI/edit#gid=0"; 
  else if (level == 5)
    return "https://docs.google.com/spreadsheets/d/1uQtyPM3RJ1zbvdr26I3NmA7pCwan5cp73mqmOGI0U_w/edit#gid=0";
  else if (level == 7)
    return "https://docs.google.com/spreadsheets/d/1oDAYDekZBffPNCb_V3QcwgLgw_xj4YSBq8CRotCLmMY/edit#gid=0";
}

