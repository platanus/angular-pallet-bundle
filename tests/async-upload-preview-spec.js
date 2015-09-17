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
      expect(element.textContent).toMatch('0%');
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
  inject: ['Upload', '$compile', 'encodedIcons'],

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
        loaded: 43452,
        total: 43452
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
      expect(element.textContent).toMatch('100%');
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
