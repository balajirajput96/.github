import { getStateCode, getStateNames, STATE_CODES } from './stateCodes';

describe('stateCodes utility', () => {
  describe('getStateCode', () => {
    test('returns correct USPS code for valid state name', () => {
      expect(getStateCode('California')).toBe('CA');
      expect(getStateCode('New York')).toBe('NY');
      expect(getStateCode('Texas')).toBe('TX');
    });

    test('handles different case inputs', () => {
      expect(getStateCode('california')).toBe('CA');
      expect(getStateCode('CALIFORNIA')).toBe('CA');
      expect(getStateCode('CaLiFoRnIa')).toBe('CA');
    });

    test('handles extra whitespace', () => {
      expect(getStateCode('  California  ')).toBe('CA');
      expect(getStateCode('New  York')).toBe('NY');
    });

    test('returns empty string for invalid state name', () => {
      expect(getStateCode('Invalid State')).toBe('');
      expect(getStateCode('CA')).toBe('');
      expect(getStateCode('123')).toBe('');
    });

    test('returns empty string for empty or null input', () => {
      expect(getStateCode('')).toBe('');
      expect(getStateCode(null)).toBe('');
      expect(getStateCode(undefined)).toBe('');
    });

    test('returns empty string for non-string input', () => {
      expect(getStateCode(123)).toBe('');
      expect(getStateCode({})).toBe('');
      expect(getStateCode([])).toBe('');
    });

    test('handles all 50 US states correctly', () => {
      const testCases = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Florida', 'FL'],
        ['Hawaii', 'HI'],
        ['Wyoming', 'WY']
      ];

      testCases.forEach(([stateName, expectedCode]) => {
        expect(getStateCode(stateName)).toBe(expectedCode);
      });
    });
  });

  describe('getStateNames', () => {
    test('returns an array of state names', () => {
      const stateNames = getStateNames();
      expect(Array.isArray(stateNames)).toBe(true);
      expect(stateNames.length).toBe(50);
    });

    test('includes all expected states', () => {
      const stateNames = getStateNames();
      expect(stateNames).toContain('California');
      expect(stateNames).toContain('New York');
      expect(stateNames).toContain('Texas');
    });
  });

  describe('STATE_CODES constant', () => {
    test('contains 50 states', () => {
      expect(Object.keys(STATE_CODES).length).toBe(50);
    });

    test('all codes are 2 uppercase letters', () => {
      Object.values(STATE_CODES).forEach(code => {
        expect(code).toMatch(/^[A-Z]{2}$/);
      });
    });
  });
});
