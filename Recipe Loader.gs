var recipesForCurrentLevel;
var currentLevel;

function loadFormQuestions(){
  var classID = FormApp.getActiveForm().getId();
  currentLevel = getCurrentLevel();
  recipesForCurrentLevel = getRecipesForLevel(currentLevel);
  
  setFormTitle();
  
  setFormDescription();
  
  showRecipeNamesAsCheckboxes();
  
  addCompletionStateToRecipeList(recipesForCurrentLevel);
  
  showNextUpOptions();
  
  insertExercisesList();
  
  insertConfirmationMessage();  
}

function setFormTitle(){
  var classID = FormApp.getActiveForm().getId();
  var firstStudentIndex = 7;
  var students = "";
  var classData = getClassData(classID);
  for (var i = firstStudentIndex; i < classData.length; i++) {
    var studentName = classData[i];
    if(studentName != "") 
      students += studentName + ", ";
  }
  students = students.slice(0, -2);
  FormApp.getActiveForm().setTitle(students);
}

function setFormDescription(){
  var classID = FormApp.getActiveForm().getId();
  var classData = getClassData(classID);
  FormApp.getActiveForm().setDescription("Level " + classData[2] + " - " + classData[3] + " & " + classData[5]);
}

function showRecipeNamesAsCheckboxes(){
  var completedQuestion = FormApp.getActiveForm().getItems()[0].asCheckboxItem();
  completedQuestion.setTitle('Which exercises did you work on?');
  
  var choices = new Array();
  for (var i = 0; i < recipesForCurrentLevel.length; i++) {
    choices.push(recipesForCurrentLevel[i].name);
  }
  
  completedQuestion.setChoiceValues(choices);  
}

function showNextUpOptions(){
  
  var plannedQuestion = FormApp.getActiveForm().getItems()[1].asCheckboxItem();
  plannedQuestion.setTitle('Which exercises are you planning for next week?');
  
  var choices = new Array();
  for (var i = 0; i < recipesForCurrentLevel.length; i++) {
    var recipe = recipesForCurrentLevel[i];
    var checkboxText = "";
    if(recipe.hasBeenCompleted) checkboxText += "// ";
    checkboxText += recipe.name;
    checkboxText += addTimeToCompleteIfExists(recipe);
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

function insertExercisesList(){
  removeExercisesListItemIfExists();
  
  var section = FormApp.getActiveForm().addSectionHeaderItem();
  section.setTitle("Click here for the full list of exercises for level " + currentLevel + ":");
  section.setHelpText(getRecipeListURL(currentLevel));
}

function removeExercisesListItemIfExists() {
  var formItems = FormApp.getActiveForm().getItems();
  for(var i = 0; i < formItems.length; i++){
    var currentItem = formItems[i];
    if(currentItem.getType() == "SECTION_HEADER")
        FormApp.getActiveForm().deleteItem(currentItem);
  }
}

function insertConfirmationMessage(){
  var form = FormApp.getActiveForm();
  form.setConfirmationMessage("Thanks! The full class log is here: https://docs.google.com/spreadsheets/d/" +  form.getDestinationId());
}


