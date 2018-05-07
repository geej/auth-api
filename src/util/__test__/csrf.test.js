const csrf = require('../csrf');

describe('csrf', () => {
  it('should generate 16 bytes', () => {
    expect(Buffer.from(csrf.getCSRFToken(), 'base64').length).toEqual(16);
  });

  describe('token verification', () => {
    it('returns false if event has no headers', () => {
      expect(csrf.verifyCSRFToken({ body: 'csrfToken=1234' })).toEqual(false);
    });

    it('returns false if event has no body', () => {
      expect(csrf.verifyCSRFToken({
        headers: {
          Cookie: 'csrf-token=1234'
        }
      })).toEqual(false);
    });

    it('returns true if strings match', () => {
      expect(csrf.verifyCSRFToken({
        headers: {
          Cookie: 'csrf-token=1234'
        },
        body: 'csrfToken=1234'
      })).toEqual(true);
    });
  });
});