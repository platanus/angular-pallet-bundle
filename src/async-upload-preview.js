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
          'init-callback="onInit()" ' +
          'done-callback="onDone()" ' +
          'start-callback="onUploadStart(file)" ' +
          'progress-callback="onUploadProgress(event)" ' +
          'success-callback="onUploadSuccess(uploadData)" ' +
          'error-callback="onUploadError(errorData)" ' +
          'remove-callback="onUploadsRemove()" ' +
          'ng-model="ngModel">' +
        '</async-upload>' +
        '<upload-progress ' +
          'ng-if="!multiple" ' +
          'type="{{progressType}}" ' +
          'hide-on-complete="true" ' +
          'hide-on-zero="true" ' +
          'progress-data="sMode.file.progressData">' +
        '</upload-progress>' +
        '<doc-preview ' +
          'ng-if="!multiple" ' +
          'no-document-text="{{noDocumentText}}" ' +
          'render-image-as="{{renderImageAs}}" ' +
          'document-name="sMode.file.documentName" ' +
          'document-extension="{{sMode.file.fileExtension}}" ' +
          'document-url="sMode.file.downloadUrl">' +
        '</doc-preview>' +
        '<div class="files-table" ng-if="!!multiple">' +
          '<div class="files-row" ng-repeat="file in mMode.files">' +
            '<div class="pre-preview" ng-hide="file.canPreview()"><span>{{file.documentName}}</span></div>' +
            '<doc-preview ' +
              'ng-show="file.canPreview()" ' +
              'render-image-as="link" ' +
              'document-name="file.documentName" ' +
              'document-extension="{{file.fileExtension}}" ' +
              'document-url="file.downloadUrl">' +
            '</doc-preview>' +
            '<div class="file-status">' +
              '<upload-progress ' +
                'type="indicator" ' +
                'progress-data="file.progressData">' +
              '</upload-progress>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '<div>'
  };

  return directive;

  function link(_scope) {
    _scope.onInit = onInit;
    _scope.onDone = onDone;
    _scope.onUploadSuccess = onUploadSuccess;
    _scope.onUploadProgress = onUploadProgress;
    _scope.onUploadError = onUploadError;
    _scope.onUploadStart = onUploadStart;
    _scope.onUploadsRemove = onUploadsRemove;

    function DocFile(fileName, fileExtension, downloadUrl, identifier) {
      this.documentName = fileName;
      this.localFileName = fileName;
      this.fileExtension = fileExtension || 'unknown';
      this.downloadUrl = downloadUrl;
      this.identifier = identifier;
      this.progressData = { loaded: 0, total: 1, error: false };
    }

    DocFile.prototype = {
      canPreview: function() {
        return !!this.downloadUrl;
      },

      setUploadData: function(uploadData) {
        var data = (uploadData.upload || uploadData);

        this.identifier = data.identifier;
        this.documentName =(data.file_name || data.fileName);
        this.fileExtension = (data.file_extension || data.fileExtension);
        this.downloadUrl = (data.download_url || data.downloadUrl);

        if(!this.identifier || !this.documentName ||
          !this.fileExtension || !this.downloadUrl) {
          throw 'Invalid response. Must be a json with identifier, file_name, file_extension and download_url';
        }
      }
    };

    _scope.mMode = {
      files: [],

      fileByLocalName: function(name) {
        var file;

        for(var i = 0, len = _scope.mMode.files.length; i < len; i++) {
          file = _scope.mMode.files[i];

          if(file.localFileName === name) {
            return file;
          }
        }

        return null;
      },

      setInitialState: function() {
        _scope.mMode.files.length = 0;
      },

      setFinalState: function() {
        // Do nothing
      },

      setProgress: function(event) {
        if(event) {
          var file = _scope.mMode.fileByLocalName(event.localFileName);
          if(file) file.progressData = event;
        }
      },

      setError: function(errorData) {
        var file = _scope.mMode.fileByLocalName(errorData.localFileName);
        if(file) file.progressData.error = true;
      },

      setFileInitialState: function(file) {
        var newFile = new DocFile(file.localFileName);
        _scope.mMode.files.push(newFile);
      },

      setUploadData: function(uploadData) {
        var file = _scope.mMode.fileByLocalName(uploadData.localFileName);
        if(file) file.setUploadData(uploadData);
      }
    };

    _scope.sMode = {
      setInitialState: function() {
        _scope.sMode.file = new DocFile();
      },

      setFinalState: function() {
        // Do nothing on single mode
      },

      setProgress: function(event) {
        if(event) _scope.sMode.file.progressData = event;
      },

      setError: function(errorData) {
        _scope.sMode.file.progressData.error = true;
      },

      setFileInitialState: function(file) {
        // Do nothing on single mode
      },

      setUploadData: function(uploadData) {
        _scope.sMode.file.setUploadData(uploadData);
      }
    };

    var mode = !!_scope.multiple ? _scope.mMode : _scope.sMode;

    function onInit() { mode.setInitialState(); }
    function onUploadStart(file) { mode.setFileInitialState(file); }
    function onUploadProgress(event) { mode.setProgress(event); }
    function onUploadSuccess(uploadData) { mode.setUploadData(uploadData); }
    function onUploadError(errorData) { mode.setError(errorData); }
    function onUploadsRemove() { mode.setInitialState(); }
    function onDone() { mode.setFinalState(); }
  }
}

})();
