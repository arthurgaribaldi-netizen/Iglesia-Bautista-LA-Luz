// Mock do winston-daily-rotate-file
const mockDailyRotateFile = jest.fn(() => ({
  name: 'daily-rotate-file',
  level: 'info',
  filename: 'test.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
}));

export default mockDailyRotateFile;
