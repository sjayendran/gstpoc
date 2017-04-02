import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/invoices.js';

Meteor.startup(() => {
  // code to run on server at startup
});

var excel = new Excel('xlsx');

Meteor.methods({
  getExcelDetails(fObj) {
    //console.log("this is the file object:");
    //console.log(fObj);
    var fs = Npm.require('fs');
    var path = Npm.require('path');
    var basepath = path.resolve('.').split('.meteor')[0];
    //console.log("THIS IS THE BASE PATH: ");
    //console.log(basepath);
    //var fullFilePath = basepath + fObj._storagePath + '/' + fObj.name;
    var devPath = '.meteor/local/build/programs/server';
    var fullFilePath = basepath + devPath + '/' + fObj.path;
    //console.log('this be the full file path:');
    //console.log(fullFilePath);
    var workbook = excel.readFile(fullFilePath);
    var yourSheetsName = workbook.SheetNames;
    console.log(workbook.SheetNames);
    var GSTSheet = workbook.Sheets[yourSheetsName[4]]
    console.log(GSTSheet);
    var options = {}
    var GSTJSON = excel.utils.sheet_to_json( GSTSheet, options );
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%this is the JSON GST DATA:");
    console.log(GSTJSON);
    return '';
  }
});
