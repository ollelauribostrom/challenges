let lib;

describe('Tests for Challenge: 001', () => {
  beforeAll(() => {
    lib = require(`../${process.env.TESTPATH}/index.js`); // eslint-disable-line
  });
  it('returns the string "Hello World!"', () => {
    expect(lib.helloWorld()).toEqual('Hello World!');
  });
});
