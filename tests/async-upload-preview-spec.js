ngDescribe({
  name: 'Async upload preview directive with initial state',
  modules: 'platanus.upload',
  element:
    '<async-upload-preview ' +
      'no-document-text="no file present"' +
      'upload-url="uploads"' +
      'ng-model="user.uploadIdentifier">' +
    '</async-upload>',

  tests: function(deps) {
    it('shows async upload directive', function() {
      var element = deps.element.find('div');
      expect(element.attr('class')).toMatch('async-upload');
    });

    it('shows progress directive', function() {
      var element = deps.element[0].querySelector('.upload-progress');
      expect(element.textContent).toEqual('0%');
    });

    it('shows doc preview directive', function() {
      var element = deps.element.find('p');
      expect(element.text()).toMatch('no file present');
    });
  }
});

ngDescribe({
  name: 'Async upload preview directive loading a file',
  modules: 'platanus.upload',
  exposeApi: true,
  mock: {
    'platanus.upload': {
      'encodedIcons': {
        'xls': 'encoded_xls_file'
      }
    }
  },
  inject: ['Upload', 'encodedIcons'],

  tests: function(deps, exposeApi) {
    beforeEach(function() {
      var successfullyReponse = {
        upload: {
          'id': '84',
          'identifier': 'OjynOLMx2h',
          'file_extension': 'xls',
          'file_name': 'Other name',
          'download_url': 'http://uploads/84/download'
        }
      };

      exposeApi.setupElement(
        '<async-upload-preview ' +
          'upload-url="uploads"' +
          'ng-model="user.uploadIdentifier">' +
        '</async-upload>');

      var successfullProgressReponse = {
        loaded: 5000,
        total: 5000
      };

      var callback = {
        success: function(callbackSuccess) {
          callbackSuccess(successfullyReponse);
          return callback;
        },
        progress: function(callbackProgress) {
          callbackProgress(successfullProgressReponse);
          return callback;
        },
        error: function() { return callback; }
      };

      deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      var asyncDirective = deps.element.find('div');
      asyncDirective.scope().upload(['my-file.txt']);
      deps.element.scope().$apply();
    });

    it('sets upload idenfitier to model', function() {
      expect(deps.element.scope().user.uploadIdentifier).toEqual('OjynOLMx2h');
    });

    it('shows progress directive done', function() {
      var element = deps.element[0].querySelector('.upload-progress');
      expect(element.textContent).toEqual('95%');
    });

    it('shows preview img icon based on file extension param', function() {
      var img = deps.element.find('img');
      expect(img.prop('src')).toMatch(deps.encodedIcons.xls);
    });

    it('shows link with valid file url', function() {
      var link = deps.element.find('a');
      expect(link.prop('href')).toMatch('http://uploads/84/download');
    });

    it('shows link with label based on file name param', function() {
      var link = deps.element.find('a');
      expect(link.text()).toMatch('Other name');
    });
  }
});

ngDescribe({
  name: 'Async upload preview directive failing upload',
  modules: 'platanus.upload',
  exposeApi: true,
  parentScope: {
    user: {
      uploadIdentifier: 'OjynOLMx2h' // Setting identifier to simulate a previuos successful upload.
    }
  },
  inject: ['Upload'],

  tests: function(deps, exposeApi) {
    beforeEach(function() {
      exposeApi.setupElement(
        '<async-upload-preview ' +
          'upload-url="uploads"' +
          'render-image-as="thumb"' +
          'ng-model="user.uploadIdentifier">' +
        '</async-upload>');

      // Setting uploadData on asyncUploadPreview directive scope
      // to simulate a previuos successful upload.
      deps.element.isolateScope().uploadData = {
        identifier: 'OjynOLMx2h',
        documentName: 'Doc name',
        fileExtension: 'png',
        downloadUrl: 'http://uploads/84/download'
      };

      var errorResponse = {
        error: 'some error',
        status: 500,
      };

      var progressResponse = {
        loaded: 5000,
        total: 5000
      };

      var callback = {
        success: function() { return callback; },
        progress: function(callbackProgress) {
          callbackProgress(progressResponse);
          return callback;
        },
        error: function(callbackError){
          callbackError(errorResponse.error, errorResponse.status);
          return callback;
        }
      };

      deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      var asyncDirective = deps.element.find('div');
      asyncDirective.scope().upload(['my-file.txt']);

      deps.element.scope().$apply();
    });

    it('cleans models upload idenfitier', function() {
      expect(deps.element.scope().user.uploadIdentifier).toEqual(null);
    });

    it('shows progress error class', function() {
      var element = deps.element[0].querySelector('.upload-progress');
      expect(element.classList).toMatch('error');
    });

    it('hides thumb', function() {
      var img = deps.element.find('img');
      expect(img.prop('src')).toBe(undefined);
    });
  }
});
