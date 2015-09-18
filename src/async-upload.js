(function(){

angular
  .module('platanus.upload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload) {
  var directive = {
    template:
      '<div class="async-upload" ngf-change="upload($files)" ngf-select ng-model="files">' +
        '<button>{{ getButtonLabel() }}</button>' +
      '</div>',
    require: 'ngModel',
    scope: {
      uploadUrl: '@',
      buttonLabel: '@',
      startCallback: '&',
      successCallback: '&',
      progressCallback: '&',
      errorCallback: '&'
    },
    link: link,
  };

  return directive;

  function link(_scope, _element, _attrs, _controller) {
    _scope.upload = upload;
    _scope.getButtonLabel = getButtonLabel;

    function upload(files) {
      if (!files || !files.length) return;

      var params = {
        url: _scope.uploadUrl,
        file: files[0]
      };

      (_scope.startCallback || angular.noop)();

      Upload.upload(params).success(function(data) {
          _controller.$setViewValue(data.upload.identifier);
          (_scope.successCallback || angular.noop)({ uploadData: data });

        }).progress(function(event){
          (_scope.progressCallback || angular.noop)({ event: event });

        }).error(function(data, status) {
          var errorData = { error: data, status: status };
          _controller.$setViewValue(null);
          console.error(errorData);
          (_scope.errorCallback || angular.noop)({ errorData: errorData });
        });
    }

    function getButtonLabel() {
      return (_scope.buttonLabel || 'Select file...');
    }
  }
}

asyncUpload.$inject = ['Upload'];

})();
