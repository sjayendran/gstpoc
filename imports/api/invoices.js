import { FilesCollection } from 'meteor/ostrio:files';

export const Invoices = new FilesCollection({
  collectionName:  'Invoices',
  allowClientCode: false,
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /xls|xlsx|xlsm/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload an excel file, with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    const self = this;
    if (Meteor.isServer) {
      console.log('file has been successfully uploaded!!!!');
    }
  }
});
