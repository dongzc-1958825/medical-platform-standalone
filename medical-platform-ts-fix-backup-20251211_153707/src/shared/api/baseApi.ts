// src/shared/api/baseApi.ts
// API基础配置和服务

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : '/api'; // 生产环境使用相对路径

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 统一的请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 这里可以添加认证token
  // const token = localStorage.getItem('auth_token');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.code || 'UNKNOWN_ERROR',
        data.message || '请求失败',
        data.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    console.error('API请求错误:', error);
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      '网络请求失败，请检查网络连接',
      { originalError: error }
    );
  }
}

// 常用的HTTP方法封装
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest<T>(`${endpoint}${queryString}`);
  },

  post: <T>(endpoint: string, data: any) => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: <T>(endpoint: string, data: any) => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: <T>(endpoint: string) => {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },

  patch: <T>(endpoint: string, data: any) => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};