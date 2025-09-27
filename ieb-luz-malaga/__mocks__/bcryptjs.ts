// Mock para bcryptjs - Isolamento de operações de hash de senha
export const hash = jest.fn((password: string, saltRounds: number = 10) => {
  // Simula hash determinístico para testes
  const mockHash = `$2b$${saltRounds}$${Buffer.from(password).toString('base64').slice(0, 22)}`;
  return Promise.resolve(mockHash);
});

export const compare = jest.fn((password: string, hash: string) => {
  // Simula comparação de senha - aceita senhas específicas para testes
  const testPasswords = ['admin123', 'password', 'test123'];
  return Promise.resolve(testPasswords.includes(password));
});

export const genSalt = jest.fn((rounds: number = 10) => {
  return Promise.resolve(`$2b$${rounds}$${Math.random().toString(36).substring(2, 15)}`);
});

export const hashSync = jest.fn((password: string, saltRounds: number = 10) => {
  const mockHash = `$2b$${saltRounds}$${Buffer.from(password).toString('base64').slice(0, 22)}`;
  return mockHash;
});

export const compareSync = jest.fn((password: string, hash: string) => {
  const testPasswords = ['admin123', 'password', 'test123'];
  return testPasswords.includes(password);
});

export const genSaltSync = jest.fn((rounds: number = 10) => {
  return `$2b$${rounds}$${Math.random().toString(36).substring(2, 15)}`;
});

// Utilitários para testes
export const mockBcryptSuccess = (password: string, hash: string) => {
  hash.mockResolvedValue(hash);
  compare.mockResolvedValue(true);
  hashSync.mockReturnValue(hash);
  compareSync.mockReturnValue(true);
};

export const mockBcryptError = (error: Error) => {
  hash.mockRejectedValue(error);
  compare.mockRejectedValue(error);
  hashSync.mockImplementation(() => { throw error; });
  compareSync.mockImplementation(() => { throw error; });
};

export const mockBcryptCompareFailure = (password: string) => {
  compare.mockImplementation((pwd: string) => Promise.resolve(pwd !== password));
  compareSync.mockImplementation((pwd: string) => pwd !== password);
};

export const resetBcryptMocks = () => {
  jest.clearAllMocks();
  // Reset para comportamento padrão
  hash.mockImplementation((password: string, saltRounds: number = 10) => {
    const mockHash = `$2b$${saltRounds}$${Buffer.from(password).toString('base64').slice(0, 22)}`;
    return Promise.resolve(mockHash);
  });
  
  compare.mockImplementation((password: string, hash: string) => {
    const testPasswords = ['admin123', 'password', 'test123'];
    return Promise.resolve(testPasswords.includes(password));
  });
};

export default {
  hash,
  compare,
  genSalt,
  hashSync,
  compareSync,
  genSaltSync,
  mockBcryptSuccess,
  mockBcryptError,
  mockBcryptCompareFailure,
  resetBcryptMocks,
};
