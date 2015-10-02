(function(){

angular
  .module('platanus.upload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload, trashIcon) {
  var directive = {
    template:
      '<div class="async-upload">' +
        '<div class="upload-btn" ' +
          'ngf-change="upload($files)" ' +
          'ngf-select ' +
          'ngf-multiple="multiple" ' +
          'ng-model="files"> ' +
          '<button>{{ getButtonLabel() }}</button> ' +
        '</div>' +
        '<img class="remove-btn" ' +
          'ng-src="{{ trashIcon }}" ' +
          'ng-click="onRemoveUpload()" ' +
          'ng-hide="emptyIdentifier()" />' +
      '</div>',
    require: 'ngModel',
    scope: {
      uploadUrl: '@',
      buttonLabel: '@',
      multiple: '@',
      startCallback: '&',
      successCallback: '&',
      progressCallback: '&',
      errorCallback: '&',
      removeCallback: '&'
    },
    link: link,
  };

  return directive;

  function link(_scope, _element, _attrs, _controller) {
    _scope.multiple = false;
    _scope.upload = upload;
    _scope.getButtonLabel = getButtonLabel;
    _scope.trashIcon = trashIcon;
    _scope.onRemoveUpload = onRemoveUpload;
    _scope.emptyIdentifier = emptyIdentifier;

    function uploadFile(_remainginFiles) {
      var file = _remainginFiles.shift();

      if(!file) {
        // TODO: call DONE callback
        return;
      }

      var params = {
        url: _scope.uploadUrl,
        file: file
      };

      (_scope.startCallback || angular.noop)();

      Upload.upload(params).success(function(data) {
        setIdentifier(data.upload.identifier);
        (_scope.progressCallback || angular.noop)({ event: { loaded: 1, total: 1 } });
        (_scope.successCallback || angular.noop)({ uploadData: data });

      }).progress(function(event){
        var progressData = {
          loaded: (event.loaded * 0.95),
          total: event.total
        };

        (_scope.progressCallback || angular.noop)({ event: progressData });

      }).error(function(data, status) {
        var errorData = { error: data, status: status };
        (_scope.progressCallback || angular.noop)({ event: { loaded: 1, total: 1 } });
        (_scope.errorCallback || angular.noop)({ errorData: errorData });
        console.error(errorData);
      });

      uploadFile(_remainginFiles);
    }

    function setIdentifier(_identifier) {
      if(!_identifier) {
        _controller.$setViewValue(null);
        return;
      }

      if(!!_scope.multiple) {
        var identifiers = _controller.$viewValue || [];
        identifiers.push(_identifier);
        _controller.$setViewValue(identifiers);
        return;
      }

      _controller.$setViewValue(_identifier);
    }

    function upload(files) {
      if (!files || !files.length) return;

      if(!_scope.multiple) {
        files = [files[0]];
      }

      setIdentifier(null);
      // TODO: call INIT callback

      uploadFile(files);
    }

    function getButtonLabel() {
      return (_scope.buttonLabel || 'Select file...');
    }

    function onRemoveUpload() {
      (_scope.removeCallback || angular.noop)();
      setIdentifier(null);
    }

    function emptyIdentifier() {
      return !_controller.$viewValue;
    }
  }
}

asyncUpload.$inject = ['Upload', 'trashIcon'];

})();
