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
          'start-callback="setInitialState()" ' +
          'progress-callback="setProgress(event)" ' +
          'success-callback="setUploadData(uploadData)" ' +
          'error-callback="setError(errorData)" ' +
          'remove-callback="setInitialState()" ' +
          'ng-model="ngModel">' +
        '</async-upload>' +
        '<upload-progress ' +
          'ng-if="!multiple" ' +
          'type="{{progressType}}" ' +
          'hide-on-complete="true" ' +
          'hide-on-zero="true" ' +
          'progress-data="sMode.progressData">' +
        '</upload-progress>' +
        '<doc-preview ' +
          'ng-if="!multiple" ' +
          'no-document-text="{{noDocumentText}}" ' +
          'render-image-as="{{renderImageAs}}" ' +
          'document-name="sMode.uploadData.documentName" ' +
          'document-extension="{{sMode.uploadData.fileExtension}}" ' +
          'document-url="sMode.uploadData.downloadUrl">' +
        '</doc-preview>' +
      '<div>'
  };

  return directive;

  function link(_scope) {
    _scope.setUploadData = setUploadData;
    _scope.setProgress = setProgress;
    _scope.setError = setError;
    _scope.setInitialState = setInitialState;

    _scope.mMode = {
      setProgress: function(event) {
      },

      setError: function(errorData) {
      },

      setInitialState: function() {
      },

      setUploadData: function(uploadData) {
      }
    };

    _scope.sMode = {
      setProgress: function(event) {
        if(event) {
          _scope.sMode.progressData = event;
        }
      },

      setError: function(errorData) {
        _scope.sMode.uploadData = null;
        _scope.sMode.progressData.error = true;
      },

      setInitialState: function() {
        _scope.sMode.uploadData = null;
        _scope.sMode.progressData = { loaded: 0, total: 1, error: false };
      },

      setUploadData: function(uploadData) {
        var data = (uploadData.upload || uploadData);

        _scope.sMode.uploadData = {
          identifier: data.identifier,
          documentName: (data.file_name || data.fileName),
          fileExtension: (data.file_extension || data.fileExtension),
          downloadUrl: (data.download_url || data.downloadUrl)
        };

        if(!_scope.sMode.uploadData.identifier || !_scope.sMode.uploadData.documentName ||
          !_scope.sMode.uploadData.fileExtension || !_scope.sMode.uploadData.downloadUrl) {
          throw 'Invalid response. Must be a json with identifier, file_name, file_extension and download_url';
        }
      }
    };

    var mode = !!_scope.multiple ? _scope.mMode : _scope.sMode;

    function setProgress(event) { mode.setProgress(event); }
    function setError(errorData) { mode.setError(errorData); }
    function setInitialState() { mode.setInitialState(); }
    function setUploadData(uploadData) { mode.setUploadData(uploadData); }
  }
}

})();
