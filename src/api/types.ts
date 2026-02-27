// Type definitions based on OpenAPI spec

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}


// Profile Domain
export interface Profile {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface ProfileInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface ProfileUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// Platform Domain
export interface Platform {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface PlatformInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface PlatformUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// User Domain
export interface User {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface UserInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface UserUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}



// Identity Domain
export interface Identity {
  _id: string
  name: string
  description?: string
  status?: string
}


// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
}

// Configuration
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown>
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
