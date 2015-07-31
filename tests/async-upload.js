ngDescribe({
  name: 'Async upload directive',
  exposeApi: true,
  modules: 'platanus.upload',
  inject: ['Upload','$compile'],
  element: '<async-upload link="uploads" ng-model="user.uploadIdentifier"></async-upload>',

  tests: function (deps, describeApi) {

    describe('With preview activated', function(){
      beforeEach(function() {
        var callback = {
          success: function(callbackSuccess) {
            callbackSuccess({
              upload: {
                identifier: 'OjynOLMx2h'
              }
            });

            return callback;
          },
          progress: function(callbackProgress) {
            callbackProgress();
            return callback;
          }
        };

        deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      });

      it('can update DOM using binding', function () {
        la(check.has(deps, 'element'), 'has compiled element');

        var element = deps.element.find('div');

        expect(element.attr('ngf-select') !== undefined).toBe(true);
        expect(element.attr('ng-model') !== undefined).toBe(true);
        expect(element.attr('ngf-change') !== undefined).toBe(true);
      });

      it('should upload a file with ngUploadFile service', function() {
        var files = ['my-file.txt'];
        var params = {
          url: 'uploads',
          file: files[0]
        };

        deps.element.isolateScope().upload(files);
        expect(deps.Upload.upload).toHaveBeenCalledWith(params);
      });

      it('should keep the user identifier from response', function() {
        var scope = deps.element.scope();
        deps.element.isolateScope().upload(['my-file.txt']);
        expect(scope.user.uploadIdentifier).toEqual('OjynOLMx2h');
      });

      it('should hide the preview',function(){
        expect(deps.element.find('img').length === 0).toBe(true);
      });
    });

    describe('With preview activated', function(){
      beforeEach(function(){
        describeApi.setupElement('<async-upload preview="true" link="uploads" ng-model="user.uploadIdentifier"></async-upload>');
      });

      it('should show a preview',function(){
        expect(deps.element.find('img').length > 0).toBe(true);
      });
    });
  }
});
