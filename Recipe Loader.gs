var recipesForCurrentLevel;
var currentLevel;

function loadFormQuestions(currentForm){
  var classID = currentForm.getId();
  currentLevel = getCurrentLevel(classID);
  recipesForCurrentLevel = getRecipesForLevel(currentLevel);
  
  setFormTitleAndFileName(currentForm);
  
  setFormDescription(currentForm);
  
  showRecipeNamesAsCheckboxes(currentForm);
  
  addCompletionStateToRecipeList(recipesForCurrentLevel, currentForm);
  
  showNextUpOptions(currentForm);
  
  insertExercisesList(currentForm);
  
  insertConfirmationMessage(currentForm);  
}

function setFormTitleAndFileName(currentForm){
  var classID = currentForm.getId();
  var firstStudentIndex = 7;
  var students = "";
  var classData = getClassData(classID);
  for (var i = firstStudentIndex; i < classData.length; i++) {
    var studentName = classData[i];
    if(studentName != "") 
      students += studentName + ", ";
  }
  students = students.slice(0, -2);
  currentForm.setTitle(students);
  
  //Set the name of the file in Google Drive
  DriveApp.getFileById(classID).setName(students);
}

function setFormDescription(currentForm){
  var classID = currentForm.getId();
  var classData = getClassData(classID);
  currentForm.setDescription("Level " + classData[2] + " - " + classData[3] + " & " + classData[5]);
}

function showRecipeNamesAsCheckboxes(currentForm){
  var completedQuestion = currentForm.getItems()[0].asCheckboxItem();
  completedQuestion.setTitle('Which exercises did you work on?');
  
  var choices = new Array();
  for (var i = 0; i < recipesForCurrentLevel.length; i++) {
    choices.push(recipesForCurrentLevel[i].name);
  }
  
  completedQuestion.setChoiceValues(choices);  
}

function showNextUpOptions(currentForm){
  
  var plannedQuestion = currentForm.getItems()[1].asCheckboxItem();
  plannedQuestion.setTitle('Which exercises are you planning for next week?');
  
  var choices = new Array();
  for (var i = 0; i < recipesForCurrentLevel.length; i++) {
    var recipe = recipesForCurrentLevel[i];
    var checkboxText = "";
    if(recipe.hasBeenCompleted) checkboxText += "// ";
    checkboxText += recipe.name;
    checkboxText += addTimeToCompleteIfExists(recipe);
    if(recipe.isOptional) checkboxText += " ~";
    choices.push(checkboxText);
  }
  
  plannedQuestion.setChoiceValues(choices); 
}

function addTimeToCompleteIfExists(recipe){
  if(recipe.duration) 
    return " - " + recipe.duration;
  else
    return "";
}

function insertExercisesList(currentForm){
  removeExercisesListItemIfExists(currentForm);
  
  var section = currentForm.addSectionHeaderItem();
  section.setTitle("Click here for the full list of exercises for level " + currentLevel + ":");
  section.setHelpText(getRecipeListURL(currentLevel));
}

function removeExercisesListItemIfExists(currentForm) {
  var formItems = currentForm.getItems();
  for(var i = 0; i < formItems.length; i++){
    var currentItem = formItems[i];
    if(currentItem.getType() == "SECTION_HEADER")
        currentForm.deleteItem(currentItem);
  }
}

function insertConfirmationMessage(currentForm){
  form.setConfirmationMessage("Thanks! The full class log is here: https://docs.google.com/spreadsheets/d/" +  currentForm.getDestinationId());
}
