ngDescribe({
  name: 'Async upload preview directive with initial state',
  modules: 'platanus.palletBundle',
  element:
    '<pallet-upload-handler ' +
      'no-document-text="no file present"' +
      'upload-url="uploads"' +
      'progress-type="bar"' +
      'ng-model="user.uploadIdentifier">' +
    '</pallet-upload-handler>',

  tests: function(deps) {
    it('shows async upload directive', function() {
      var element = deps.element.find('div');
      expect(element.attr('class')).toMatch('pallet-file-selector');
    });

    it('shows progress bar directive', function() {
      expect(deps.element.html()).toMatch('inner-bar');
    });

    it('shows doc preview directive', function() {
      var element = deps.element.find('p');
      expect(element.text()).toMatch('no file present');
    });

    it('hides remove button', function() {
      var img = angular.element(deps.element[0].querySelectorAll('.remove-btn')[0]);
      expect(img.hasClass('ng-hide')).toBe(true);
    });

    it('hides files table with single upload', function() {
      var table = angular.element(deps.element[0].querySelectorAll('.files-table'));
      expect(table.length).toBe(0);
    });
  }
});

ngDescribe({
  name: 'Async upload preview directive loading a file',
  modules: 'platanus.palletBundle',
  exposeApi: true,
  mock: {
    'platanus.palletBundle': {
      'encodedIcons': {
        'xls': 'encoded_xls_file'
      }
    }
  },
  inject: ['Upload', 'encodedIcons'],

  tests: function(deps, exposeApi) {
    beforeEach(function() {
      exposeApi.setupElement(
        '<pallet-upload-handler ' +
          'upload-url="uploads"' +
          'ng-model="user.uploadIdentifier">' +
        '</pallet-upload-handler>');

      var callback = {
        success: function(callbackSuccess) {
          var response = {
            upload: {
              'id': '84',
              'identifier': 'OjynOLMx2h',
              'file_extension': 'xls',
              'file_name': 'Other name',
              'download_url': 'http://uploads/84/download'
            }
          };

          callbackSuccess(response);
          return callback;
        },
        progress: function(callbackProgress) {
          callbackProgress({ loaded: 1, total: 1 });
          return callback;
        },
        error: function() { return callback; }
      };

      deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      var asyncDirective = deps.element.find('div');
      asyncDirective.scope().upload([{ name: 'my-file.txt' }]);
      deps.element.scope().$apply();
    });

    it('sets upload idenfitier to model', function() {
      expect(deps.element.scope().user.uploadIdentifier).toEqual('OjynOLMx2h');
    });

    it('shows progress directive done', function() {
      var element = deps.element[0].querySelector('.progress');
      expect(element.textContent).toEqual('95%');
    });

    it('shows preview img icon based on file extension param', function() {
      var img = angular.element(deps.element[0].querySelectorAll('.image-preview')[0]);
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

    it('shows remove button', function() {
      var img = angular.element(deps.element[0].querySelectorAll('.remove-btn')[0]);
      expect(img.hasClass('ng-hide')).toBe(false);
    });

    it('hides files table with single upload', function() {
      var table = angular.element(deps.element[0].querySelectorAll('.files-table'));
      expect(table.length).toBe(0);
    });
  }
});

ngDescribe({
  name: 'Async upload preview directive failing upload',
  modules: 'platanus.palletBundle',
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
        '<pallet-upload-handler ' +
          'upload-url="uploads"' +
          'render-image-as="thumb"' +
          'ng-model="user.uploadIdentifier">' +
        '</pallet-upload-handler>');

      // Setting uploadData on palletUploadHandler directive scope
      // to simulate a previuos successful upload.
      deps.element.isolateScope().uploadData = {
        identifier: 'OjynOLMx2h',
        documentName: 'Doc name',
        fileExtension: 'png',
        downloadUrl: 'http://uploads/84/download'
      };

      var callback = {
        success: function() { return callback; },
        progress: function(callbackProgress) {
          callbackProgress({ loaded: 1, total: 1 });
          return callback;
        },
        error: function(callbackError){
          callbackError('some error', 500);
          return callback;
        }
      };

      deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      var asyncDirective = deps.element.find('div');
      asyncDirective.scope().upload([{ name: 'my-file.txt' }]);

      deps.element.scope().$apply();
    });

    it('cleans models upload idenfitier', function() {
      expect(deps.element.scope().user.uploadIdentifier).toEqual(null);
    });

    it('shows progress error class', function() {
      var element = deps.element[0].querySelector('.progress');
      expect(element.classList).toMatch('error');
    });

    it('hides thumb', function() {
      var img = angular.element(deps.element[0].querySelectorAll('.image-preview')[0]);
      expect(img.prop('src')).toBe(undefined);
    });
  }
});

ngDescribe({
  name: 'Async upload preview working with multiple files',
  modules: 'platanus.palletBundle',
  exposeApi: true,
  inject: ['Upload', 'encodedIcons'],

  tests: function(deps, exposeApi) {
    var result;

    beforeEach(function() {
      exposeApi.setupElement(
        '<pallet-upload-handler ' +
          'upload-url="uploads"' +
          'multiple="true"' +
          'progress-type="bar"' +
          'render-image-as="thumb"' +
          'ng-model="user.uploadIdentifiers">' +
        '</pallet-upload-handler>');

      var uploadsCount = 0;
      var callback = {
        success: function(callbackSuccess) {
          uploadsCount++;

          if(uploadsCount < 3) {
            var successfullUploadReponse = {
              upload: {
                'identifier': 'identifier' + uploadsCount,
                'id': uploadsCount,
                'file_name': 'file' + uploadsCount + '.xls',
                'file_extension': 'xls',
                'download_url': 'http://uploads/' + uploadsCount + '/download'
              }
            };

            callbackSuccess(successfullUploadReponse);
          }

          return callback;
        },
        progress: function() { return callback; },
        error: function(callbackError){
          if(uploadsCount >= 3) { // want to fire error callback uploading the third file
            callbackError('Error loading file 3', 500);
          }

          return callback;
        }
      };

      deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
      var asyncDirective = deps.element.find('div');
      asyncDirective.scope().upload([{ name: 'file1.xls' }, { name: 'file2.xls' }, { name: 'file3.xls' }]);
      deps.element.scope().$apply();

      function getRowElement(_idx, _elementClass) {
        var rows = angular.element(deps.element[0].querySelectorAll('.files-row'));
        return angular.element(rows[_idx].querySelectorAll(_elementClass)[0]);
      }

      result = {};

      for(var i = 0; i < 3; i++) {
        result['file' + i] = {
          prePreview: getRowElement(i, '.pre-preview'),
          docPreview: getRowElement(i, '.doc-preview'),
          progressBar: getRowElement(i, '.progress')
        };
      }
    });

    it('sets upload idenfitier to model', function() {
      expect(deps.element.scope().user.uploadIdentifiers).toEqual(['identifier1', 'identifier2']);
    });

    it('shows files table', function() {
      var rows = angular.element(deps.element[0].querySelectorAll('.files-table'));
      expect(rows.children().length).toEqual(3);
    });

    it('shows pre preview for file with errors only', function() {
      expect(result.file0.prePreview.hasClass('ng-hide')).toBe(true);
      expect(result.file1.prePreview.hasClass('ng-hide')).toBe(true);
      expect(result.file2.prePreview.hasClass('ng-hide')).toBe(false);
    });

    it('shows doc preview for completed uploads only', function() {
      expect(result.file0.docPreview.hasClass('ng-hide')).toBe(false);
      expect(result.file1.docPreview.hasClass('ng-hide')).toBe(false);
      expect(result.file2.docPreview.hasClass('ng-hide')).toBe(true);
    });

    it('shows completed progress for successful uploads only', function() {
      expect(result.file0.progressBar.hasClass('completed')).toBe(true);
      expect(result.file1.progressBar.hasClass('completed')).toBe(true);
      expect(result.file2.progressBar.hasClass('error')).toBe(true);
    });

    it('shows progress bar always as indicator', function() {
      expect(result.file0.progressBar.hasClass('indicator')).toBe(true);
      expect(result.file1.progressBar.hasClass('indicator')).toBe(true);
      expect(result.file2.progressBar.hasClass('indicator')).toBe(true);
    });

    it('shows remove button', function() {
      var img = angular.element(deps.element[0].querySelectorAll('.remove-btn')[0]);
      expect(img.hasClass('ng-hide')).toBe(false);
    });
  }
});
