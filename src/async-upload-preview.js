(function(){

angular
  .module('platanus.upload')
  .directive('asyncUploadPreview', asyncUploadPreview);

function asyncUploadPreview() {
  var directive = {
    link: link,
    require: 'ngModel',
    replace: true,
    scope: {
      ngModel: '=',
      documentName: '=',
      uploadUrl: '@',
      multiple: '@',
      renderImageAs: '@',
      noDocumentText: '@',
      documentExtension: '@',
      progressType: '@'
    },
    template:
      '<div>' +
        '<async-upload ' +
          'upload-url="{{uploadUrl}}" ' +
          'multiple="{{multiple}}" ' +
          'start-callback="onUploadStart()" ' +
          'progress-callback="onUploadProgress(event)" ' +
          'success-callback="onUploadSuccess(uploadData)" ' +
          'error-callback="onUploadError(errorData)" ' +
          'remove-callback="onUploadStart()" ' +
          'ng-model="ngModel">' +
        '</async-upload>' +
        '<div class="single-wrapper" ng-if="!multiple">' +
          '<upload-progress ' +
            'type="{{progressType}}" ' +
            'hide-on-complete="true" ' +
            'hide-on-zero="true" ' +
            'progress-data="sMode.progressData">' +
          '</upload-progress>' +
          '<doc-preview ' +
            'no-document-text="{{noDocumentText}}" ' +
            'render-image-as="{{renderImageAs}}" ' +
            'document-name="sMode.uploadData.documentName" ' +
            'document-extension="{{sMode.uploadData.fileExtension}}" ' +
            'document-url="sMode.uploadData.downloadUrl">' +
          '</doc-preview>' +
        '</div>' +
        '<div class="multiple-wrapper" ng-if="!!multiple">' +
          '<div class="files-table" ng-repeat="file in mMode.files">' +
            '<doc-preview ' +
              'render-image-as="link" ' +
              'document-name="file.documentName" ' +
              'document-extension="{{file.fileExtension}}" ' +
              'document-url="file.downloadUrl">' +
            '</doc-preview>' +
          '</div>' +
        '</div>' +
      '<div>'
  };

  return directive;

  function link(_scope) {
    _scope.onUploadSuccess = onUploadSuccess;
    _scope.onUploadProgress = onUploadProgress;
    _scope.onUploadError = onUploadError;
    _scope.onUploadStart = onUploadStart;

    _scope.mMode = {
      files: [],

      setProgress: function(event) {
      },

      setError: function(errorData) {
      },

      setInitialState: function() {
        _scope.mMode.files.length = 0;
      },

      setUploadData: function(uploadData) {
        var newFile = {};
        _scope.mMode.files.push(newFile);
        setUploadData(newFile, uploadData);
      }
    };

    _scope.sMode = {
      setProgress: function(event) {
        if(event) {
          _scope.sMode.progressData = event;
        }
      },

      setError: function(errorData) {
        _scope.sMode.uploadData = {};
        _scope.sMode.progressData.error = true;
      },

      setInitialState: function() {
        _scope.sMode.uploadData = {};
        _scope.sMode.progressData = { loaded: 0, total: 1, error: false };
      },

      setUploadData: function(uploadData) {
        setUploadData(_scope.sMode.uploadData, uploadData);
      }
    };

    var mode = !!_scope.multiple ? _scope.mMode : _scope.sMode;

    function setUploadData(holder, uploadData) {
      var data = (uploadData.upload || uploadData);

      holder.identifier = data.identifier;
      holder.documentName =(data.file_name || data.fileName);
      holder.fileExtension = (data.file_extension || data.fileExtension);
      holder.downloadUrl = (data.download_url || data.downloadUrl);

      if(!holder.identifier || !holder.documentName ||
        !holder.fileExtension || !holder.downloadUrl) {
        throw 'Invalid response. Must be a json with identifier, file_name, file_extension and download_url';
      }
    }

    function onUploadProgress(event) { mode.setProgress(event); }
    function onUploadError(errorData) { mode.setError(errorData); }
    function onUploadStart() { mode.setInitialState(); }
    function onUploadSuccess(uploadData) { mode.setUploadData(uploadData); }
  }
}

})();
