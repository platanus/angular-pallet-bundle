(function(){

angular
  .module('platanus.upload')
  .directive('uploadProgress', uploadProgress);

function uploadProgress() {
  var directive = {
    template:
      '<div ng-hide="getRawProgress() === 0 && hideOnZero" ' +
        'ng-class="{ \'in-progress\': inProgress(), \'completed\': isCompleted() }" ' +
        'class="upload-progress indicator">' +
        '{{getPercentage()}}' +
      '</div>',
    restrict: 'E',
    replace: true,
    scope: {
      progressData:'=',
      hideOnZero:'@'
    },
    link: link
  };

  return directive;

  function link(_scope) {
    if(!_scope.progressData) _scope.progressData = { loaded: 0, total: 1 };

    _scope.getPercentage = getPercentage;
    _scope.getRawProgress = getRawProgress;
    _scope.inProgress = inProgress;
    _scope.isCompleted = isCompleted;

    function getRawProgress() {
      return parseInt(100 * (_scope.progressData.loaded / _scope.progressData.total));
    }

    function inProgress() {
      var progress = getRawProgress();
      return (progress > 0 && progress < 100);
    }

    function isCompleted() {
      return getRawProgress() === 100;
    }

    function getPercentage() {
      return getRawProgress() + '%';
    }
  }
}

})();
