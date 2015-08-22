ngDescribe({
  name: 'Angular-progress display progress',
  modules: 'platanus.upload',
  exposeApi: true,
  parentScope: { progressData: { loaded: 3456, total: 9866 }},
  element: '<upload-progress progress-data="progressData"></upload-progress>',

  tests: function (deps) {
    it('renders element', function () {
      expect(deps.element.hasClass('upload-progress')).toBe(true);
    });

    it('render progress', function(){
      expect(deps.element.text()).toBe('35%');
    });
  }
});

ngDescribe({
  name: 'Angular-progress hide option',
  modules: 'platanus.upload',
  exposeApi: true,
  parentScope: { progressData: { loaded: 0, total: 9866 }},
  element: '<upload-progress hide-on-zero="true" progress-data="progressData"></upload-progress>',

  tests: function (deps, describeApi) {
    it('hides element hide option set', function () {
      expect(deps.element.hasClass('ng-hide')).toBe(true);
    });

    describe('when hide option not set', function(){
      beforeEach(function(){
        describeApi.setupElement('<upload-progress progress-data="progressData"></upload-progress>');
      });

      it('element should be visible', function () {
        expect(deps.element.hasClass('ng-hide')).toBe(false);
      });
    });
  }
});
