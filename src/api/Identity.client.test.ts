import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Identity Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all identitys', async () => {
    const mockIdentitys = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-identity',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockIdentitys,
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getIdentitys()

    expect(result).toEqual(mockResponse)
  })

  it('should get identitys with name query', async () => {
    const mockResponse = {
      items: [],
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getIdentitys({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/identity?name=test',
      expect.any(Object)
    )
  })

  it('should get a single identity', async () => {
    const mockIdentity = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-identity'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockIdentity
    })

    const result = await api.getIdentity('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockIdentity)
  })
})