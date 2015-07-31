(function(){

angular
  .module('platanus.upload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload) {
  var directive = {
    link: link,
    require: 'ngModel',
    scope: {
      link: '@'
    },
    template:
      '<div class="async-upload" ngf-change="upload($files)" ngf-select ng-model="files">' +
        '<img ng-if="preview" ng-show="files.length" ngf-src="files[0]" ngf-default-src="\'/thumb.jpg\'" ngf-accept="\'image/*\'"/>'+
        '<button>Upload</button>' +
      '</div>'
  };

  return directive;

  function link(scope, element, attrs, controller) {
    scope.upload = upload;

    scope.preview = !!attrs.preview;

    function upload(files) {
      if (!files || !files.length) return;

      var params = {
        url: scope.link,
        file: files[0]
      };

      Upload
        .upload(params)
        .success(function(data) {
          controller.$setViewValue(data.upload.identifier);
        });
    }
  }
}

asyncUpload.$inject = ['Upload'];

})();
