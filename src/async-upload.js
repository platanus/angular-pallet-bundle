(function(){

angular
  .module('platanus.upload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload, trashIcon) {
  var directive = {
    template:
      '<div class="async-upload">' +
        '<div class="upload-btn" ngf-change="upload($files)" ngf-select ng-model="files">' +
          '<button>{{ getButtonLabel() }}</button>' +
        '</div>' +
        '<img class="remove-btn" ng-src="{{ trashIcon }}" ng-click="onRemoveUpload()" ng-hide="emptyIdentifier()" />' +
      '</div>',
    require: 'ngModel',
    scope: {
      uploadUrl: '@',
      buttonLabel: '@',
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
    _scope.upload = upload;
    _scope.getButtonLabel = getButtonLabel;
    _scope.trashIcon = trashIcon;
    _scope.onRemoveUpload = onRemoveUpload;
    _scope.emptyIdentifier = emptyIdentifier;

    function upload(files) {
      if (!files || !files.length) return;

      var params = {
        url: _scope.uploadUrl,
        file: files[0]
      };

      (_scope.startCallback || angular.noop)();

      Upload.upload(params).success(function(data) {
          _controller.$setViewValue(data.upload.identifier);
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
          _controller.$setViewValue(null);
          (_scope.progressCallback || angular.noop)({ event: { loaded: 1, total: 1 } });
          (_scope.errorCallback || angular.noop)({ errorData: errorData });
          console.error(errorData);
        });
    }

    function getButtonLabel() {
      return (_scope.buttonLabel || 'Select file...');
    }

    function onRemoveUpload() {
      (_scope.removeCallback || angular.noop)();
      _controller.$setViewValue(null);
    }

    function emptyIdentifier() {
      return !_controller.$modelValue;
    }

  }
}

asyncUpload.$inject = ['Upload', 'trashIcon'];

})();
