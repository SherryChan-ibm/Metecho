import fetchMock from 'fetch-mock';

import { addError } from '@/store/errors/actions';
import apiFetch, {
  addUrlParams,
  getUrlParam,
  removeUrlParam,
} from '@/utils/api';

jest.mock('@/store/errors/actions');

addError.mockReturnValue({ type: 'TEST' });
const dispatch = jest.fn();

afterEach(() => {
  dispatch.mockClear();
  addError.mockClear();
});

describe('apiFetch', () => {
  test('200: returns response', () => {
    const expected = { foo: 'bar' };
    fetchMock.getOnce('/test/url/', expected);

    return expect(apiFetch({ url: '/test/url/', dispatch })).resolves.toEqual(
      expected,
    );
  });

  test('string response: returns response', () => {
    const expected = 'foobar';
    fetchMock.getOnce('/test/url/', expected);

    return expect(apiFetch({ url: '/test/url/', dispatch })).resolves.toEqual(
      expected,
    );
  });

  test('404: returns null', () => {
    fetchMock.getOnce('/test/url/', 404);

    return expect(
      apiFetch({ url: '/test/url/', dispatch }),
    ).resolves.toBeNull();
  });

  describe('error', () => {
    test('throws Error on no response', async () => {
      fetchMock.getOnce('/test/url/', { status: 500, body: {} });

      expect.assertions(2);
      try {
        await apiFetch({ url: '/test/url/', dispatch });
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error: {}');
        expect(addError).toHaveBeenCalledWith('Internal Server Error: {}');
      }
    });

    test('throws Error with string response', async () => {
      fetchMock.getOnce('/test/url/', { status: 500, body: 'not cool' });

      expect.assertions(2);
      try {
        await apiFetch({ url: '/test/url/', dispatch });
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error: not cool');
        expect(addError).toHaveBeenCalledWith(
          'Internal Server Error: not cool',
        );
      }
    });

    test('throws Error with `detail` response', async () => {
      fetchMock.getOnce('/test/url/', {
        status: 500,
        body: { detail: 'not cool' },
      });

      expect.assertions(2);
      try {
        await apiFetch({ url: '/test/url/', dispatch });
      } catch (err) {
        expect(err.message).toEqual('not cool');
        expect(addError).toHaveBeenCalledWith('not cool');
      }
    });

    test('throws Error with `non_field_errors` response', async () => {
      fetchMock.getOnce('/test/url/', {
        status: 500,
        body: { non_field_errors: 'not cool' },
      });

      expect.assertions(2);
      try {
        await apiFetch({ url: '/test/url/', dispatch });
      } catch (err) {
        expect(err.message).toEqual('not cool');
        expect(addError).toHaveBeenCalledWith('not cool');
      }
    });

    test('does not add error message on POST with 422 response', async () => {
      const response = { name: ['this is a form error'] };
      fetchMock.postOnce('/test/url/', {
        status: 422,
        body: response,
      });

      expect.assertions(2);
      try {
        await apiFetch({
          url: '/test/url/',
          dispatch,
          opts: { method: 'POST' },
          hasForm: true,
        });
      } catch (err) {
        expect(err.message).toEqual(`Bad Request: ${JSON.stringify(response)}`);
        expect(addError).not.toHaveBeenCalled();
      }
    });

    test('throws network error', async () => {
      fetchMock.getOnce('/test/url/', { throws: new Error('not cool') });

      expect.assertions(2);
      try {
        await apiFetch({ url: '/test/url/', dispatch });
      } catch (err) {
        expect(err.message).toEqual('not cool');
        expect(addError).not.toHaveBeenCalled();
      }
    });
  });
});

describe('addUrlParams', () => {
  test('adds params to url string', () => {
    const baseUrl = '/foobar?this=that';
    const expected = `${baseUrl}&this=other`;
    const actual = addUrlParams(baseUrl, { this: 'other' });

    return expect(actual).toBe(expected);
  });

  test('handles empty params', () => {
    const expected = '/foobar';
    const actual = addUrlParams('/foobar');

    return expect(actual).toBe(expected);
  });

  test('does not duplicate existing param', () => {
    const expected = '/foobar?this=that';
    const actual = addUrlParams(expected, { this: 'that' });

    return expect(actual).toBe(expected);
  });
});

describe('getUrlParam', () => {
  test('gets param from search string', () => {
    const input = '?foo=bar';
    const expected = 'bar';
    const actual = getUrlParam('foo', input);

    return expect(actual).toBe(expected);
  });

  test('handles missing param', () => {
    const actual = getUrlParam('foo');

    return expect(actual).toBeNull();
  });
});

describe('removeUrlParam', () => {
  test('removes param from search string', () => {
    const input = 'foo=bar&foo=buz&this=that';
    const expected = 'this=that';
    const actual = removeUrlParam('foo', input);

    return expect(actual).toBe(expected);
  });

  test('handles missing param', () => {
    const actual = removeUrlParam('foo');
    const expected = window.location.search;

    return expect(actual).toBe(expected);
  });
});
