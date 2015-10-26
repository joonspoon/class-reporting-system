var recipesForCurrentLevel;
var currentLevel;

function loadFormQuestions(){
  Logger.log("loadFormQuestions was called :)");
  
  var classID = FormApp.getActiveForm().getId();
  currentLevel = getCurrentLevel();
  recipesForCurrentLevel = getRecipesForLevel(currentLevel);
  
  setFormTitle();
  
  setFormDescription();
  
  showRecipeNamesAsCheckboxes();
  
  addCompletionStateToRecipeList(recipesForCurrentLevel);
  
  showNextUpOptions();
  
  insertExercisesList();
}

function activateTriggers(){
  var form = FormApp.getActiveForm();
  
  //for Recipe Loader
  ScriptApp.newTrigger('loadFormQuestions')
      .forForm(form)
      .onFormSubmit()
      .create();
  
  //for Teacher Notifier
  ScriptApp.newTrigger('respondToFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
}

function onOpen(e) {
   Logger.log("Called onOpen for form: " + FormApp.getActiveForm().getTitle());
   
   FormApp.getUi()
       .createAddonMenu()
       .addItem('Install', 'activateTriggers').addItem('Refresh', 'loadFormQuestions')
       .addToUi();
   
}

function showAlert() {
  var ui = FormApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
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

