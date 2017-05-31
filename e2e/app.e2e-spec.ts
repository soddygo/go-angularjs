import { GojsAngularjsPage } from './app.po';

describe('gojs-angularjs App', () => {
  let page: GojsAngularjsPage;

  beforeEach(() => {
    page = new GojsAngularjsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
