ngDescribe({
  name: 'Async upload directive',
  modules: 'platanus.upload',
  inject: ['Upload'],
  element:
    '<async-upload ' +
      'button-label="Upload please" ' +
      'start-callback="onStart()" ' +
      'success-callback="setUploadData(uploadData)" ' +
      'progress-callback="setProgress(event)" ' +
      'error-callback="setError(errorData)" ' +
      'upload-url="uploads" ' +
      'ng-model="user.uploadIdentifier">' +
    '</async-upload>',

  tests: function (deps) {
    var successfullUploadReponse = {
      upload: {
        identifier: 'OjynOLMx2h',
        id: '84'
      }
    };

    var successfullProgressReponse = {
      loaded: 1,
      total: 1
    };

    var errorResponse = {
      error: 'some error',
      status: 500,
    };

    describe('loading a file', function(){
      describe('with successful response', function() {
        beforeEach(function() {
          // All functions must return the callback object to be able to method chaning
          // success().progress().methodX()..
          var callback = {
            success: function(callbackSuccess) {
              callbackSuccess(successfullUploadReponse);
              return callback;
            },
            progress: function(callbackProgress){
              callbackProgress(successfullProgressReponse);
              return callback;
            },
            error: function() { return callback; }
          };

          deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
          deps.parentScope.setUploadData = jasmine.createSpy('setUploadData');
          deps.parentScope.setProgress = jasmine.createSpy('setProgress');
          deps.parentScope.onStart = jasmine.createSpy('onStart');
          deps.element.isolateScope().upload(['my-file.txt']);
        });

        it('updates DOM using binding', function () {
          var element = deps.element.find('div');

          expect(element.attr('ngf-select') !== undefined).toBe(true);
          expect(element.attr('ng-model') !== undefined).toBe(true);
          expect(element.attr('ngf-change') !== undefined).toBe(true);
        });

        it('change custom button label', function() {
          var element = deps.element.find('button');
          expect(element.text()).toBe('Upload please');
        });

        it('uploads a file with ngUploadFile service', function() {
          var params = { url: 'uploads', file: 'my-file.txt' };
          expect(deps.Upload.upload).toHaveBeenCalledWith(params);
        });

        it('calls defined start callback on parent scope', function() {
          expect(deps.parentScope.setUploadData).toHaveBeenCalled();
        });

        it('calls defined upload callback on parent scope with upload data', function() {
          expect(deps.parentScope.setUploadData).toHaveBeenCalledWith(successfullUploadReponse);
        });

        it('calls defined progress callback on parent scope', function() {
          expect(deps.parentScope.setProgress).toHaveBeenCalledWith(successfullProgressReponse);
        });

        it('sets upload identifier from response', function() {
          var scope = deps.element.scope();
          expect(scope.user.uploadIdentifier).toEqual('OjynOLMx2h');
        });
      });

      describe('with error response', function() {
        beforeEach(function() {
          var callback = {
            success: function() { return callback; },
            progress: function() { return callback; },
            error: function(callbackError){
              callbackError(errorResponse.error, errorResponse.status);
              return callback;
            }
          };

          var scope = deps.element.scope();
          scope.user = { uploadIdentifier: 'old identifier' };

          deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
          deps.parentScope.setError = jasmine.createSpy('setError');
          deps.element.isolateScope().upload(['my-file.txt']);
        });

        it('calls defined error callback on parent scope with error data', function() {
          expect(deps.parentScope.setError).toHaveBeenCalledWith(errorResponse);
        });

        it('calls defined error callback on parent scope with error data', function() {
          var scope = deps.element.scope();
          expect(scope.user.uploadIdentifier).toBeNull();
        });
      });
    });
  }
});
