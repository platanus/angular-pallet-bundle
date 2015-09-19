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
      renderImageAs: '@',
      noDocumentText: '@',
      documentExtension: '@',
      progressType: '@'
    },
    template:
      '<div>' +
        '<async-upload ' +
          'upload-url="{{uploadUrl}}" ' +
          'start-callback="setInitialState()" ' +
          'progress-callback="setProgress(event)" ' +
          'success-callback="setUploadData(uploadData)" ' +
          'error-callback="setError(errorData)" ' +
          'ng-model="ngModel">' +
        '</async-upload>' +
        '<upload-progress type="{{progressType}}" ' +
          'hide-on-complete="true" ' +
          'hide-on-zero="true" ' +
          'progress-data="progressData">' +
        '</upload-progress>' +
        '<doc-preview ' +
          'no-document-text="{{noDocumentText}}" ' +
          'render-image-as="{{renderImageAs}}" ' +
          'document-name="uploadData.documentName" ' +
          'document-extension="{{uploadData.fileExtension}}" ' +
          'document-url="uploadData.downloadUrl">' +
        '</doc-preview>' +
      '<div>'
  };

  return directive;

  function link(_scope) {
    _scope.setUploadData = setUploadData;
    _scope.setProgress = setProgress;
    _scope.setError = setError;
    _scope.setInitialState = setInitialState;

    function setProgress(event) {
      if(event) {
        _scope.progressData = event;
      }
    }

    function setError(errorData) {
      _scope.uploadData = null;
      _scope.progressData.error = true;
    }

    function setInitialState() {
      _scope.uploadData = null;
      _scope.progressData = { loaded: 0, total: 1, error: false };
    }

    function setUploadData(uploadData) {
      var data = (uploadData.upload || uploadData);

      _scope.uploadData = {
        identifier: data.identifier,
        documentName: (data.file_name || data.fileName),
        fileExtension: (data.file_extension || data.fileExtension),
        downloadUrl: (data.download_url || data.downloadUrl)
      };

      if(!_scope.uploadData.identifier || !_scope.uploadData.documentName ||
        !_scope.uploadData.fileExtension || !_scope.uploadData.downloadUrl) {
        throw 'Invalid response. Must be a json with identifier, file_name, file_extension and download_url';
      }
    }
  }
}

})();
