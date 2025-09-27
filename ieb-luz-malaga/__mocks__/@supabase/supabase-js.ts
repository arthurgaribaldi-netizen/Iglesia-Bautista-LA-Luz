// Mock centralizado para @supabase/supabase-js
export const createClient = jest.fn(() => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: null,
          error: null,
        })),
        data: [],
        error: null,
      })),
      order: jest.fn(() => ({
        data: [],
        error: null,
      })),
      limit: jest.fn(() => ({
        data: [],
        error: null,
      })),
      range: jest.fn(() => ({
        data: [],
        error: null,
      })),
      data: [],
      error: null,
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1 }],
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1 },
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1 },
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    upsert: jest.fn(() => ({
      data: { id: 1 },
      error: null,
    })),
  })),
  auth: {
    getUser: jest.fn(() => ({
      data: { user: null },
      error: null,
    })),
    signInWithPassword: jest.fn(() => ({
      data: { user: null, session: null },
      error: null,
    })),
    signUp: jest.fn(() => ({
      data: { user: null, session: null },
      error: null,
    })),
    signOut: jest.fn(() => ({
      error: null,
    })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
    getSession: jest.fn(() => ({
      data: { session: null },
      error: null,
    })),
    refreshSession: jest.fn(() => ({
      data: { session: null },
      error: null,
    })),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({
        data: { path: 'test-path' },
        error: null,
      })),
      download: jest.fn(() => ({
        data: new Blob(),
        error: null,
      })),
      remove: jest.fn(() => ({
        data: [{ name: 'test-file' }],
        error: null,
      })),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://example.com/test-file' },
      })),
      list: jest.fn(() => ({
        data: { files: [] },
        error: null,
      })),
      update: jest.fn(() => ({
        data: { path: 'test-path' },
        error: null,
      })),
    })),
  },
  realtime: {
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
      })),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    })),
  },
  rpc: jest.fn(() => ({
    data: null,
    error: null,
  })),
}));

// Mock para o cliente admin
export const createAdminClient = jest.fn(() => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: null,
          error: null,
        })),
        data: [],
        error: null,
      })),
      order: jest.fn(() => ({
        data: [],
        error: null,
      })),
      limit: jest.fn(() => ({
        data: [],
        error: null,
      })),
      range: jest.fn(() => ({
        data: [],
        error: null,
      })),
      data: [],
      error: null,
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1 }],
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1 },
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1 },
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
    upsert: jest.fn(() => ({
      data: { id: 1 },
      error: null,
    })),
  })),
  auth: {
    admin: {
      listUsers: jest.fn(() => ({
        data: { users: [] },
        error: null,
      })),
      getUserById: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      createUser: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      updateUserById: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      deleteUser: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      generateLink: jest.fn(() => ({
        data: { properties: { action_link: 'test-link' } },
        error: null,
      })),
      inviteUserByEmail: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
    },
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({
        data: { path: 'test-path' },
        error: null,
      })),
      download: jest.fn(() => ({
        data: new Blob(),
        error: null,
      })),
      remove: jest.fn(() => ({
        data: [{ name: 'test-file' }],
        error: null,
      })),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://example.com/test-file' },
      })),
      list: jest.fn(() => ({
        data: { files: [] },
        error: null,
      })),
      update: jest.fn(() => ({
        data: { path: 'test-path' },
        error: null,
      })),
    })),
  },
  rpc: jest.fn(() => ({
    data: null,
    error: null,
  })),
}));

// Mock para funções utilitárias
export const mockSupabaseResponse = (data: any, error: any = null) => ({
  data,
  error,
});

export const mockSupabaseError = (message: string, code?: string) => ({
  data: null,
  error: {
    message,
    code,
    details: null,
    hint: null,
  },
});

// Mock para dados de teste comuns
export const mockData = {
  sermons: [
    {
      id: 1,
      title: 'Test Sermon 1',
      date: '2025-01-01',
      description: 'Test Description 1',
      video_url: 'https://youtube.com/watch?v=test1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Sermon 2',
      date: '2025-01-02',
      description: 'Test Description 2',
      video_url: 'https://youtube.com/watch?v=test2',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
  ],
  events: [
    {
      id: 1,
      title: 'Test Event 1',
      date: '2025-01-01',
      description: 'Test Description 1',
      location: 'Test Location 1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Event 2',
      date: '2025-01-02',
      description: 'Test Description 2',
      location: 'Test Location 2',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
  ],
  churchInfo: {
    id: 1,
    name: 'Igreja Bautista La Luz',
    address: 'Test Address',
    phone: '123-456-7890',
    email: 'test@example.com',
    description: 'Test Description',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  devotionals: [
    {
      id: 1,
      title: 'Test Devotional 1',
      content: 'Test Content 1',
      date: '2025-01-01',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  resources: [
    {
      id: 1,
      title: 'Test Resource 1',
      description: 'Test Description 1',
      url: 'https://example.com/resource1',
      type: 'document',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  links: [
    {
      id: 1,
      title: 'Test Link 1',
      url: 'https://example.com/link1',
      description: 'Test Description 1',
      category: 'social',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  organizationalLinks: [
    {
      id: 1,
      title: 'Test Org Link 1',
      url: 'https://example.com/org1',
      description: 'Test Description 1',
      category: 'denomination',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  youtubeVideos: [
    {
      id: 1,
      title: 'Test Video 1',
      video_id: 'test1',
      description: 'Test Description 1',
      published_at: '2025-01-01T00:00:00Z',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  newsletter: {
    id: 1,
    title: 'Test Newsletter',
    content: 'Test Content',
    published: true,
    published_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
};
