function onOpen(e) {
   Logger.log("Called onOpen for form: " + FormApp.getActiveForm().getTitle());
   
   FormApp.getUi()
       .createAddonMenu()
       .addItem('Install', 'activateTriggers').addItem('Reload', 'loadFormQuestions')
       .addToUi();
  
}

function activateTriggers(){
  var form = FormApp.getActiveForm();
  
  //for Recipe Loader
  ScriptApp.newTrigger('loadFormQuestions')
      .forForm(form)
      .onFormSubmit()
      .create();
   
  
  //for Teacher Notifier
  ScriptApp.newTrigger('notifyTeachers')
      .forForm(form)
      .onFormSubmit()
      .create();
}



