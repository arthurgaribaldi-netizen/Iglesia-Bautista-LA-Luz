import { cn, formatDate, formatTime } from '@/lib/utils';

describe('Utils Functions', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('', undefined, null, false)).toBe('');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });
  });

  describe('formatDate function', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/enero|janeiro|January/);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('15');
    });

    it('should format date string correctly', () => {
      const formatted = formatDate('2024-01-15T10:30:00Z');
      expect(formatted).toMatch(/enero|janeiro|January/);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('15');
    });

    it('should handle invalid date strings gracefully', () => {
      expect(() => formatDate('invalid-date')).not.toThrow();
    });
  });

  describe('formatTime function', () => {
    it('should format time from Date object correctly', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should format time from date string correctly', () => {
      const formatted = formatTime('2024-01-15T14:30:00Z');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should handle invalid time strings gracefully', () => {
      expect(() => formatTime('invalid-time')).not.toThrow();
    });

    it('should show correct time format', () => {
      const date = new Date('2024-01-15T09:05:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
