function onOpen(e) {
   Logger.log("Called onOpen for form: " + FormApp.getActiveForm().getTitle());
   
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

function onFormSubmit(e){
  loadFormQuestions();
  notifyTeachers(e);
}
