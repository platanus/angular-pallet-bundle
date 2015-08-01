(function(){

angular
  .module('platanus.upload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload, $parse) {
  var directive = {
    template:
      '<div class="async-upload" ngf-change="upload($files)" ngf-select ng-model="files">' +
        '<button>Upload</button>' +
      '</div>',
    require: 'ngModel',
    scope: {
      uploadUrl: '@'
    },
    link: link,
  };

  return directive;

  function link(_scope, _element, _attrs, _controller) {
    _scope.upload = upload;
    var callback = _attrs.uploadCallback;
    if(callback) callback = $parse(callback);

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
          if(callback) { callback(_scope.$parent, { $uploadData: data }); }
        });
    }
  }
}

asyncUpload.$inject = ['Upload', '$parse'];

})();
