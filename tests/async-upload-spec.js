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
    describe('loading a file', function(){
      describe('with successful response', function() {
        beforeEach(function() {
          // All functions must return the callback object to be able to method chaning
          // success().progress().methodX()..
          var callback = {
            success: function(callbackSuccess) {
              callbackSuccess({ upload: { identifier: 'OjynOLMx2h', id: '84' } });
              return callback;
            },
            progress: function(callbackProgress){
              callbackProgress({ loaded: 1, total: 1 });
              return callback;
            },
            error: function() { return callback; }
          };

          deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
          deps.parentScope.setUploadData = jasmine.createSpy('setUploadData');
          deps.parentScope.setProgress = jasmine.createSpy('setProgress');
          deps.parentScope.onStart = jasmine.createSpy('onStart');
          deps.element.isolateScope().upload([{ name: 'my-file.txt' }]);
        });

        it('updates DOM using binding', function () {
          var buttonWrapper = angular.element(deps.element[0].querySelectorAll('.upload-btn')[0]);
          expect(buttonWrapper.attr('ngf-select') !== undefined).toBe(true);
          expect(buttonWrapper.attr('ng-model') !== undefined).toBe(true);
          expect(buttonWrapper.attr('ngf-change') !== undefined).toBe(true);
        });

        it('change custom button label', function() {
          var element = deps.element.find('button');
          expect(element.text()).toBe('Upload please');
        });

        it('uploads a file with ngUploadFile service', function() {
          var params = { url: 'uploads', file: { name: 'my-file.txt' } };
          expect(deps.Upload.upload).toHaveBeenCalledWith(params);
          expect(deps.Upload.upload.calls.count()).toEqual(1);
        });

        it('calls defined start callback on parent scope', function() {
          expect(deps.parentScope.onStart).toHaveBeenCalled();
          expect(deps.parentScope.onStart.calls.count()).toEqual(1);
        });

        it('calls defined upload callback on parent scope with upload data', function() {
          var response = { identifier: 'OjynOLMx2h', id: '84', localFileName: 'my-file.txt' };
          expect(deps.parentScope.setUploadData).toHaveBeenCalledWith(response);
          expect(deps.parentScope.setUploadData.calls.count()).toEqual(1);
        });

        it('calls defined progress callback on parent scope', function() {
          var response = { loaded: 1, total: 1, localFileName: 'my-file.txt' }
          expect(deps.parentScope.setProgress).toHaveBeenCalledWith(response);
        });

        it('sets upload identifier from response', function() {
          var scope = deps.element.scope();
          expect(scope.user.uploadIdentifier).toEqual('OjynOLMx2h');
        });

        it('shows remove button', function() {
          var element = deps.element.find('img');
          expect(element.hasClass('ng-hide')).toBe(false);
        });

        describe('clicking on remove button', function() {
          beforeEach(function() {
            deps.element.isolateScope().onRemoveUpload();
          });

          it('cleans identifier', function() {
            var scope = deps.element.scope();
            expect(scope.user.uploadIdentifier).toEqual(null);
          });

          it('hides remove button', function() {
            var element = deps.element.find('img');
            expect(element.hasClass('ng-hide')).toBe(true);
          });
        });
      });

      describe('with error response', function() {
        beforeEach(function() {
          var callback = {
            success: function() { return callback; },
            progress: function() { return callback; },
            error: function(callbackError){
              callbackError('some error', 500);
              return callback;
            }
          };

          var scope = deps.element.scope();
          scope.user = { uploadIdentifier: 'old identifier' };

          deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
          deps.parentScope.setError = jasmine.createSpy('setError');
          deps.element.isolateScope().upload([{ name: 'my-file.txt' }]);
        });

        it('calls defined error callback on parent scope with error data', function() {
          var response = { error: 'some error', status: 500, localFileName: 'my-file.txt' };
          expect(deps.parentScope.setError).toHaveBeenCalledWith(response);
          expect(deps.parentScope.setError.calls.count()).toEqual(1);
        });

        it('hides remove button', function() {
          var element = deps.element.find('img');
          expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('calls defined error callback on parent scope with error data', function() {
          var scope = deps.element.scope();
          expect(scope.user.uploadIdentifier).toBeNull();
        });
      });
    });
  }
});

ngDescribe({
  name: 'Async upload directive with multiple attribute present',
  modules: 'platanus.upload',
  inject: ['Upload'],
  element:
    '<async-upload ' +
      'multiple="true" ' +
      'init-callback="onInit()" ' +
      'start-callback="onStart()" ' +
      'success-callback="setUploadData(uploadData)" ' +
      'error-callback="setError(errorData)" ' +
      'done-callback="onDone()" ' +
      'upload-url="uploads" ' +
      'ng-model="user.uploadIdentifiers">' +
    '</async-upload>',

  tests: function (deps) {
    describe('loading multiple files', function(){
      describe('with successful response', function() {
        beforeEach(function() {
          var uploadsCount = 0;

          var callback = {
            success: function(callbackSuccess) {
              uploadsCount++;

              if(uploadsCount < 3) {
                var successfullUploadReponse = {
                  upload: {
                    identifier: 'identifier' + uploadsCount,
                    id: uploadsCount
                  }
                };

                callbackSuccess(successfullUploadReponse);
              }

              return callback;
            },
            progress: function() { return callback; },
            error: function(callbackError){
              if(uploadsCount >= 3) { // want to fire error callback uploading the third file
                callbackError('some error', 500);
              }

              return callback;
            }
          };

          deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
          deps.parentScope.onInit = jasmine.createSpy('onInit');
          deps.parentScope.setUploadData = jasmine.createSpy('setUploadData');
          deps.parentScope.onStart = jasmine.createSpy('onStart');
          deps.parentScope.setError = jasmine.createSpy('setError');
          deps.parentScope.onDone = jasmine.createSpy('onDone');
          deps.element.isolateScope().upload([{ name: 'file1.txt' }, { name: 'file2.txt' }, { name: 'fileError.txt' }]);
        });

        it('uploads multiple fules with ngUploadFile service', function() {
          expect(deps.Upload.upload).toHaveBeenCalledWith({ url: 'uploads', file: { name: 'file1.txt' } });
          expect(deps.Upload.upload).toHaveBeenCalledWith({ url: 'uploads', file: { name: 'file2.txt' } });
          expect(deps.Upload.upload).toHaveBeenCalledWith({ url: 'uploads', file: { name: 'fileError.txt' } });
          expect(deps.Upload.upload.calls.count()).toEqual(3);
        });

        it('calls defined init callback on parent scope', function() {
          expect(deps.parentScope.onInit.calls.count()).toEqual(1);
        });

        it('calls defined done callback on parent scope', function() {
          expect(deps.parentScope.onDone.calls.count()).toEqual(1);
        });

        it('calls defined start callback on parent scope', function() {
          expect(deps.parentScope.onStart.calls.count()).toEqual(3);
        });

        it('calls defined upload callback on parent scope with upload data', function() {
          var response1 = {
            identifier: 'identifier1',
            id: 1,
            localFileName: 'file1.txt'
          };

          var response2 = {
            identifier: 'identifier2',
            id: 2,
            localFileName: 'file2.txt'
          };

          expect(deps.parentScope.setUploadData).toHaveBeenCalledWith(response1);
          expect(deps.parentScope.setUploadData).toHaveBeenCalledWith(response2);
          expect(deps.parentScope.setUploadData.calls.count()).toEqual(2);
        });

        it('sets upload identifiers from response', function() {
          var scope = deps.element.scope();
          expect(scope.user.uploadIdentifiers).toEqual(['identifier1', 'identifier2']);
        });

        it('calls defined error callback on parent scope with error data', function() {
          var response = { error: 'some error', status: 500, localFileName: 'fileError.txt' };
          expect(deps.parentScope.setError).toHaveBeenCalledWith(response);
          expect(deps.parentScope.setError.calls.count()).toEqual(1);
        });
      });
    });
  }
});
