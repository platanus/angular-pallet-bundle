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
  }
});
