// Mock para @google-cloud/storage
export const Storage = jest.fn(() => ({
  bucket: jest.fn(() => ({
    file: jest.fn(() => ({
      save: jest.fn(() => Promise.resolve()),
      download: jest.fn(() => Promise.resolve([Buffer.from('test')])),
      delete: jest.fn(() => Promise.resolve()),
      exists: jest.fn(() => Promise.resolve([true])),
      getMetadata: jest.fn(() => Promise.resolve([{ name: 'test-file' }])),
      setMetadata: jest.fn(() => Promise.resolve()),
      makePublic: jest.fn(() => Promise.resolve()),
      makePrivate: jest.fn(() => Promise.resolve()),
      getSignedUrl: jest.fn(() => Promise.resolve(['https://example.com/signed-url'])),
    })),
    upload: jest.fn(() => Promise.resolve([{ name: 'test-file' }])),
    getFiles: jest.fn(() => Promise.resolve([[]])),
    exists: jest.fn(() => Promise.resolve([true])),
    delete: jest.fn(() => Promise.resolve()),
    getMetadata: jest.fn(() => Promise.resolve([{ name: 'test-bucket' }])),
    setMetadata: jest.fn(() => Promise.resolve()),
  })),
  getBuckets: jest.fn(() => Promise.resolve([[]])),
  createBucket: jest.fn(() => Promise.resolve([{ name: 'test-bucket' }])),
}));

export const Bucket = jest.fn(() => ({
  file: jest.fn(() => ({
    save: jest.fn(() => Promise.resolve()),
    download: jest.fn(() => Promise.resolve([Buffer.from('test')])),
    delete: jest.fn(() => Promise.resolve()),
    exists: jest.fn(() => Promise.resolve([true])),
    getMetadata: jest.fn(() => Promise.resolve([{ name: 'test-file' }])),
    setMetadata: jest.fn(() => Promise.resolve()),
    makePublic: jest.fn(() => Promise.resolve()),
    makePrivate: jest.fn(() => Promise.resolve()),
    getSignedUrl: jest.fn(() => Promise.resolve(['https://example.com/signed-url'])),
  })),
  upload: jest.fn(() => Promise.resolve([{ name: 'test-file' }])),
  getFiles: jest.fn(() => Promise.resolve([[]])),
  exists: jest.fn(() => Promise.resolve([true])),
  delete: jest.fn(() => Promise.resolve()),
  getMetadata: jest.fn(() => Promise.resolve([{ name: 'test-bucket' }])),
  setMetadata: jest.fn(() => Promise.resolve()),
}));

export const File = jest.fn(() => ({
  save: jest.fn(() => Promise.resolve()),
  download: jest.fn(() => Promise.resolve([Buffer.from('test')])),
  delete: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve([true])),
  getMetadata: jest.fn(() => Promise.resolve([{ name: 'test-file' }])),
  setMetadata: jest.fn(() => Promise.resolve()),
  makePublic: jest.fn(() => Promise.resolve()),
  makePrivate: jest.fn(() => Promise.resolve()),
  getSignedUrl: jest.fn(() => Promise.resolve(['https://example.com/signed-url'])),
}));

export default {
  Storage,
  Bucket,
  File,
};
