(function(){

angular
  .module('platanus.upload')
  .directive('uploadProgress', uploadProgress);

function uploadProgress() {
  var directive = {
    template:
      '<div ng-hide="getRawProgress() === 0 && hideOnFinished" class="upload-progress">{{getPercentage()}}</div>',
    restrict: 'E',
    replace: true,
    scope: {
      progressData:'=',
      hideOnFinished:'@'
    },
    link: link
  };

  return directive;

  function link(_scope){

    _scope.getPercentage = getPercentage;
    _scope.getRawProgress = getRawProgress;

    function getRawProgress(){
      return parseInt(100 * (_scope.progressData.loaded / _scope.progressData.total));
    }

    function getPercentage(){
      return getRawProgress() + '%';
    }
  }
}

uploadProgress.$inject = [];

})();
