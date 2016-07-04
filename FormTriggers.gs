function onOpen(openEvent) {
   var thisForm = openEvent.source;
  
   Logger.log("Triggered onOpen for form: " + thisForm.getTitle());
   
   FormApp.getUi()
       .createAddonMenu()
       .addItem('Install', 'activateTriggers').addItem('Reload', 'loadFormQuestions')
       .addToUi();
  
}

function activateTriggers(){
  var form = FormApp.getActiveForm();
  
  ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
}

function onFormSubmit(submitEvent){
  var thisForm = submitEvent.source;
  Logger.log("Triggered onFormSubmit for: " + thisForm.getTitle());
  
  Logger.log("Notifying teachers...");
  notifyTeachers(submitEvent);
  
  Logger.log("Loading checkboxes...");
  loadFormQuestions(thisForm);
}
