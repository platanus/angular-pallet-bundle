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
      uploadCallback: '&'
    },
    link: link,
  };

  return directive;

  function link(_scope, _element, _attrs, _controller) {
    _scope.upload = upload;
    _scope.getButtonLabel = getButtonLabel;

    var callback = _scope.uploadCallback;

    function upload(files) {
      if (!files || !files.length) return;

      var params = {
        url: _scope.uploadUrl,
        file: files[0]
      };

      Upload
        .upload(params)
        .success(function(data) {
          _controller.$setViewValue(data.upload.identifier);
          (callback || angular.noop)({ uploadData: data });
        });
    }

    function getButtonLabel() {
      return (_scope.buttonLabel || 'Select file...');
    }
  }
}

asyncUpload.$inject = ['Upload'];

})();
