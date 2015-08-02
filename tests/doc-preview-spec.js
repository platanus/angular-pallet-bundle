ngDescribe({
  name: 'Async upload directive with undefined document url',
  modules: 'platanus.upload',
  exposeApi: true,
  element: '<doc-preview></doc-preview>',

  tests: function (deps, describeApi) {
    it('renders nothing', function () {
      var message = deps.element[0].querySelectorAll('.no-document-text')[0];
      var thumbnail = deps.element[0].querySelectorAll('.image-preview')[0];
      var link = deps.element[0].querySelectorAll('.doc-link')[0];

      expect(message).toBe(undefined);
      expect(thumbnail).toBe(undefined);
      expect(link).toBe(undefined);
    });

    describe('and custom no document text', function(){
      beforeEach(function(){
        describeApi.setupElement('<doc-preview no-document-text="no file present"></doc-preview>');
      });

      it('renders no text label message', function () {
        var element = deps.element.find('p');
        expect(element.text()).toMatch('no file present');
      });
    });
  }
});

ngDescribe({
  name: 'Async upload directive with image url',
  modules: 'platanus.upload',
  parentScope: { documentUrl: 'http://some-url.com/file.png' },
  element: '<doc-preview document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('renders image thumbnail', function () {
      var img = deps.element.find('img');
      expect(img.prop('src')).toMatch('http://some-url.com/file.png');
    });

    it('renders image link', function () {
      var link = deps.element.find('a');
      expect(link.text()).toMatch('http://some-url.com/file.png');
    });

    it('removes icon class from image', function() {
      var img = deps.element[0].querySelectorAll('.icon')[0];
      expect(img).toBe(undefined);
    });
  }
});

ngDescribe({
  name: 'Async upload directive with image url and hide preview attribute enabled',
  modules: 'platanus.upload',
  parentScope: { documentUrl: 'http://some-url.com/file.png' },
  element: '<doc-preview hide-preview="true" document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('renders image icon', function() {
      var img = deps.element.find('img');
      expect(img.prop('src')).toMatch('/assets/file-extensions/file_extension_png.png');
    });

    it('shows link with valid url', function() {
      var link = deps.element.find('a');
      expect(link.text()).toMatch('http://some-url.com/file.png');
    });

    it('adds icon class to image', function() {
      var img = deps.element[0].querySelectorAll('.icon')[0];
      expect(img).not.toBe(undefined);
    });
  }
});

ngDescribe({
  name: 'Async upload directive with explicit extension',
  modules: 'platanus.upload',
  parentScope: { documentUrl: 'http://some-url.com/file.png' },
  element: '<doc-preview document-extension="doc" document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('shows a link with icon matching document-extension attribute',function(){
      var element = deps.element.find('img');
      expect(element.prop('src')).toMatch('file_extension_doc.png');
    });
  }
});

ngDescribe({
  name: 'Async upload directive with no image url',
  modules: 'platanus.upload',
  parentScope: { documentUrl: 'http://some-url.com/file.xls' },
  element: '<doc-preview document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('shows icon for document file',function(){
      var element = deps.element.find('img');
      expect(element.prop('src')).toMatch('file_extension_xls.png');
    });

    it('shows file url as default link label',function(){
      var link = deps.element.find('a');
      expect(link.text()).toMatch('http://some-url.com/file.xls');
    });
  }
});

ngDescribe({
  name: 'Async upload directive with custom link label',
  modules: 'platanus.upload',
  parentScope: {
    documentUrl: 'http://some-url.com/file.xls',
    documentName: 'my-file-link'
  },
  element: '<doc-preview document-name="documentName" document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('shows link with custom label',function(){
      var link = deps.element.find('a');
      expect(link.text()).toMatch('my-file-link');
    });
  }
});

ngDescribe({
  name: 'Async upload directive with unknown url extension',
  modules: 'platanus.upload',
  parentScope: {
    documentUrl: 'http://uplaods/22/download',
    documentName: 'my-file-link'
  },
  element: '<doc-preview document-url="documentUrl"></doc-preview>',

  tests: function (deps) {
    it('shows icon for unknown file',function(){
      var element = deps.element.find('img');
      expect(element.prop('src')).toMatch('file_extension_unknown.png');
    });
  }
});
