import { User, RegisterData, ForgotPasswordData } from '../types';

// 模拟用户数据库
const getUsers = (): User[] => {
  const users = localStorage.getItem('medicalPlatformUsers');
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem('medicalPlatformUsers', JSON.stringify(users));
};

// 修复初始化逻辑 - 确保每次都能正确初始化
export const initializeDefaultUsers = () => {
  let users = getUsers();
  
  // 检查默认用户是否存在，如果不存在则创建
  const defaultUsernames = ['doctor', 'patient'];
  const existingDefaultUsers = users.filter(user => 
    defaultUsernames.includes(user.username)
  );
  
  if (existingDefaultUsers.length < defaultUsernames.length) {
    // 添加缺失的默认用户
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'doctor',
        email: 'doctor@example.com',
        password: '123456',
        joinTime: new Date().toLocaleDateString(),
        medicalCases: 3,
        consultations: 2,
        role: 'admin',
        isActive: true
      },
      {
        id: '2',
        username: 'patient',
        email: 'patient@example.com',
        password: '123456',
        joinTime: new Date().toLocaleDateString(),
        medicalCases: 1,
        consultations: 0,
        role: 'user',
        isActive: true
      }
    ];
    
    // 只添加不存在的用户
    defaultUsers.forEach(defaultUser => {
      if (!users.find(u => u.username === defaultUser.username)) {
        users.push(defaultUser);
      }
    });
    
    saveUsers(users);
    console.log('默认用户初始化完成', users);
  }
};

// 修复用户验证 - 添加调试信息
export const validateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  console.log('所有用户:', users); // 调试信息
  console.log('尝试登录:', username, password); // 调试信息
  
  const user = users.find(u => 
    u.username === username && 
    u.password === password && 
    u.isActive
  );
  
  console.log('找到用户:', user); // 调试信息
  return user || null;
};

// 修复用户注册 - 添加调试
export const registerUser = (registerData: RegisterData): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  console.log('注册时所有用户:', users); // 调试信息
  
  // 检查用户名是否已存在
  if (users.find(u => u.username === registerData.username)) {
    return { success: false, message: '用户名已存在' };
  }
  
  // 检查邮箱是否已存在
  if (users.find(u => u.email === registerData.email)) {
    return { success: false, message: '邮箱已被注册' };
  }
  
  // 检查密码确认
  if (registerData.password !== registerData.confirmPassword) {
    return { success: false, message: '密码确认不一致' };
  }
  
  // 创建新用户
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: registerData.username,
    email: registerData.email,
    password: registerData.password,
    joinTime: new Date().toLocaleDateString(),
    medicalCases: 0,
    consultations: 0,
    role: 'user',
    isActive: true
  };
  
  users.push(newUser);
  saveUsers(users);
  console.log('注册后所有用户:', users); // 调试信息
  
  return { success: true, message: '注册成功', user: newUser };
};

// 修复忘记密码
export const resetPassword = (forgotData: ForgotPasswordData): { success: boolean; message: string } => {
  const users = getUsers();
  console.log('重置密码时所有用户:', users); // 调试信息
  
  const userIndex = users.findIndex(u => u.email === forgotData.email);
  
  if (userIndex === -1) {
    return { success: false, message: '邮箱未注册' };
  }
  
  if (forgotData.newPassword !== forgotData.confirmPassword) {
    return { success: false, message: '密码确认不一致' };
  }
  
  users[userIndex].password = forgotData.newPassword;
  saveUsers(users);
  console.log('重置密码后用户:', users[userIndex]); // 调试信息
  
  return { success: true, message: '密码重置成功' };
};

// 获取用户信息（不包含密码）
export const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// 获取所有用户（管理员功能）
export const getAllUsers = (): Omit<User, 'password'>[] => {
  const users = getUsers();
  return users.map(user => getUserWithoutPassword(user));
};

// 删除用户（注销账号）
export const deleteUser = (userId: string, currentUserId: string): { success: boolean; message: string } => {
  if (userId === currentUserId) {
    return { success: false, message: '不能删除当前登录账号' };
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }
  
  users.splice(userIndex, 1);
  saveUsers(users);
  
  return { success: true, message: '用户删除成功' };
};

// 停用/启用用户
export const toggleUserStatus = (userId: string): { success: boolean; message: string } => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }
  
  users[userIndex].isActive = !users[userIndex].isActive;
  saveUsers(users);
  
  return { 
    success: true, 
    message: `用户已${users[userIndex].isActive ? '启用' : '停用'}` 
  };
};