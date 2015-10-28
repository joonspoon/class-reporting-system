function isNumeric(string){
    return !isNaN(string);
}

function arrayContains(array, lookingFor){
  for (var i = 0; i < array.length; i++) {
    if (array[i] == lookingFor) {
      return true;
    }
  }
  return false;
}


