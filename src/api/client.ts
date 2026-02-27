import type { 
  Profile,
  ProfileInput,
  ProfileUpdate,

  Platform,
  PlatformInput,
  PlatformUpdate,

  User,
  UserInput,
  UserUpdate,

  Identity,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getProfiles(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Profile>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Profile>>(`/profile${query ? `?${query}` : ''}`)
  },

  async getProfile(profileId: string): Promise<Profile> {
    return request<Profile>(`/profile/${profileId}`)
  },

  async createProfile(data: ProfileInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateProfile(profileId: string, data: ProfileUpdate): Promise<Profile> {
    return request<Profile>(`/profile/${profileId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getPlatforms(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Platform>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Platform>>(`/platform${query ? `?${query}` : ''}`)
  },

  async getPlatform(platformId: string): Promise<Platform> {
    return request<Platform>(`/platform/${platformId}`)
  },

  async createPlatform(data: PlatformInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/platform', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updatePlatform(platformId: string, data: PlatformUpdate): Promise<Platform> {
    return request<Platform>(`/platform/${platformId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getUsers(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<User>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<User>>(`/user${query ? `?${query}` : ''}`)
  },

  async getUser(userId: string): Promise<User> {
    return request<User>(`/user/${userId}`)
  },

  async createUser(data: UserInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateUser(userId: string, data: UserUpdate): Promise<User> {
    return request<User>(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints


  // Consume endpoints

  async getIdentitys(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Identity>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Identity>>(`/identity${query ? `?${query}` : ''}`)
  },

  async getIdentity(identityId: string): Promise<Identity> {
    return request<Identity>(`/identity/${identityId}`)
  },


}

export { ApiError }
