// Mock para googleapis
export const google = {
  youtube: jest.fn(() => ({
    v3: {
      search: {
        list: jest.fn(() => Promise.resolve({
          data: {
            items: [
              {
                id: { videoId: 'test-video-id' },
                snippet: {
                  title: 'Test Video',
                  description: 'Test Description',
                  publishedAt: '2025-01-01T00:00:00Z',
                  thumbnails: {
                    default: { url: 'https://example.com/thumb.jpg' },
                    medium: { url: 'https://example.com/thumb-medium.jpg' },
                    high: { url: 'https://example.com/thumb-high.jpg' },
                  },
                },
              },
            ],
            pageInfo: {
              totalResults: 1,
              resultsPerPage: 10,
            },
          },
        })),
      },
      videos: {
        list: jest.fn(() => Promise.resolve({
          data: {
            items: [
              {
                id: 'test-video-id',
                snippet: {
                  title: 'Test Video',
                  description: 'Test Description',
                  publishedAt: '2025-01-01T00:00:00Z',
                  thumbnails: {
                    default: { url: 'https://example.com/thumb.jpg' },
                    medium: { url: 'https://example.com/thumb-medium.jpg' },
                    high: { url: 'https://example.com/thumb-high.jpg' },
                  },
                },
                statistics: {
                  viewCount: '1000',
                  likeCount: '100',
                  commentCount: '50',
                },
              },
            ],
          },
        })),
      },
      channels: {
        list: jest.fn(() => Promise.resolve({
          data: {
            items: [
              {
                id: 'test-channel-id',
                snippet: {
                  title: 'Test Channel',
                  description: 'Test Channel Description',
                  thumbnails: {
                    default: { url: 'https://example.com/channel-thumb.jpg' },
                    medium: { url: 'https://example.com/channel-thumb-medium.jpg' },
                    high: { url: 'https://example.com/channel-thumb-high.jpg' },
                  },
                },
                statistics: {
                  subscriberCount: '10000',
                  videoCount: '100',
                  viewCount: '1000000',
                },
              },
            ],
          },
        })),
      },
    },
  })),
  auth: {
    OAuth2: jest.fn(() => ({
      setCredentials: jest.fn(),
      getAccessToken: jest.fn(() => Promise.resolve({ token: 'test-token' })),
      refreshAccessToken: jest.fn(() => Promise.resolve({ credentials: { access_token: 'test-token' } })),
    })),
    GoogleAuth: jest.fn(() => ({
      getClient: jest.fn(() => Promise.resolve({
        getAccessToken: jest.fn(() => Promise.resolve({ token: 'test-token' })),
        setCredentials: jest.fn(),
      })),
      getApplicationDefault: jest.fn(() => Promise.resolve({
        getAccessToken: jest.fn(() => Promise.resolve({ token: 'test-token' })),
        setCredentials: jest.fn(),
      })),
    })),
  },
  storage: jest.fn(() => ({
    v1: {
      buckets: {
        list: jest.fn(() => Promise.resolve({ data: { items: [] } })),
        create: jest.fn(() => Promise.resolve({ data: { name: 'test-bucket' } })),
        delete: jest.fn(() => Promise.resolve()),
      },
      objects: {
        list: jest.fn(() => Promise.resolve({ data: { items: [] } })),
        insert: jest.fn(() => Promise.resolve({ data: { name: 'test-object' } })),
        delete: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve({ data: Buffer.from('test') })),
      },
    },
  })),
  drive: jest.fn(() => ({
    v3: {
      files: {
        list: jest.fn(() => Promise.resolve({ data: { files: [] } })),
        get: jest.fn(() => Promise.resolve({ data: { name: 'test-file' } })),
        create: jest.fn(() => Promise.resolve({ data: { id: 'test-file-id' } })),
        update: jest.fn(() => Promise.resolve({ data: { id: 'test-file-id' } })),
        delete: jest.fn(() => Promise.resolve()),
      },
    },
  })),
};

export default google;
