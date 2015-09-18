(function(){

angular
  .module('platanus.upload')
  .directive('uploadProgress', uploadProgress);

function uploadProgress() {
  var directive = {
    template:
      '<div ng-hide="getRawProgress() === 0 && hideOnZero" ' +
        'ng-class="{ \'in-progress\': inProgress(), \'completed\': isCompleted(), \'error\': hasErrors() }" ' +
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
    if(!_scope.progressData) _scope.progressData = { loaded: 0, total: 1, error: false };

    _scope.getPercentage = getPercentage;
    _scope.getRawProgress = getRawProgress;
    _scope.inProgress = inProgress;
    _scope.isCompleted = isCompleted;
    _scope.hasErrors = hasErrors;

    function getRawProgress() {
      return parseInt(100 * (_scope.progressData.loaded / _scope.progressData.total));
    }

    function inProgress() {
      var progress = getRawProgress();
      return (!_scope.progressData.error && (progress > 0 && progress < 100));
    }

    function isCompleted() {
      return (!_scope.progressData.error && getRawProgress() === 100);
    }

    function hasErrors() {
      return !!_scope.progressData.error;
    }

    function getPercentage() {
      return getRawProgress() + '%';
    }
  }
}

})();
