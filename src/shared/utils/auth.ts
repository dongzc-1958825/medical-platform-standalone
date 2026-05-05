// 在现有文件中添加，或者创建新文件
// src/shared/utils/auth.ts
export const checkLoginStatus = () => {
  try {
    const userStr = localStorage.getItem('medical_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.isLoggedIn === true ? user : null;
    }
    return null;
  } catch (error) {
    console.error('检查登录状态失败:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('medical_user');
};