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
      documentExtension: '@'
    },
    template:
      '<div>' +
        '<async-upload ' +
          'upload-url="{{uploadUrl}}" ' +
          'progress-callback="setProgress(event)" ' +
          'success-callback="setUploadData(uploadData)" ' +
          'error-callback="setError(errorData)" ' +
          'ng-model="ngModel"></async-upload>' +
        '<upload-progress hide-on-zero="true" progress-data="progressData"></upload-progress>' +
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

    function setInitialState() {
      _scope.uploadData = null;
      _scope.progressData = { loaded: 0, total: 1 };
    }

    function setProgress(event) {
      if(event) {
        _scope.progressData = event;
      }
    }

    function setError(errorData) {
      setInitialState();
    }

    function setUploadData(uploadData) {
      _scope.uploadData = uploadData.upload;
      var data = (uploadData.upload || uploadData);

      _scope.uploadData.identifier = data.identifier;
      _scope.uploadData.documentName = (data.file_name || data.fileName);
      _scope.uploadData.fileExtension = (data.file_extension || data.fileExtension);
      _scope.uploadData.downloadUrl = (data.download_url || data.downloadUrl);

      if(!_scope.uploadData.identifier || !_scope.uploadData.documentName ||
        !_scope.uploadData.fileExtension || !_scope.uploadData.downloadUrl) {
        throw 'Invalid response. Must be a json with identifier, file_name, file_extension and download_url';
      }
    }
  }
}

})();
