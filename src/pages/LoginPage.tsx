// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { isMobileDevice } from '@/shared/utils/device';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [idCard, setIdCard] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remark, setRemark] = useState('');
  const [idCardError, setIdCardError] = useState('');
  const [idCardCorrected, setIdCardCorrected] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    let formType = null;
    if (hash.includes('?')) {
      const [path, query] = hash.split('?');
      const params = new URLSearchParams(query);
      formType = params.get('form');
    }
    setIsRegister(formType === 'register');
  }, [location]);

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  }, [password]);

  const handleIdCardChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^0-9X]/g, '');
    setIdCard(cleaned);
    setIdCardError('');
    setIdCardCorrected('');
  };

  const validateIdCard = () => {
    if (!idCard || idCard.length !== 18) {
      setIdCardError('身份证号必须为18位');
      return false;
    }
    if (!/^\d{17}[\dX]$/.test(idCard)) {
      setIdCardError('身份证号格式不正确');
      return false;
    }
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * factor[i];
    }
    const mod = sum % 11;
    const expectedParity = parity[mod];
    if (idCard[17] !== expectedParity) {
      const corrected = idCard.substring(0, 17) + expectedParity;
      setIdCardCorrected(corrected);
      setIdCardError('校验码错误，已自动修正');
      return false;
    }
    return true;
  };

  const validatePhone = (phoneNum: string) => {
    return /^1[3-9]\d{9}$/.test(phoneNum);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('请输入姓名或邮箱');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    try {
      const result = await login(username, password);
      if (result.success) {
        setMessage(`欢迎回来，${result.user?.username || '用户'}！`);
        setTimeout(() => {
          const redirectPath = isMobileDevice() ? '/mobile/home' : '/desktop/home';
          navigate(redirectPath);
        }, 1000);
      } else {
        setError(result.message || '姓名/邮箱或密码错误');
      }
    } catch (err) {
      setError('登录失败，请重试');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('请输入真实姓名');
      return;
    }
    if (!idCard || idCard.length !== 18) {
      setError('请输入18位身份证号');
      return;
    }
    if (!validateIdCard()) return;
    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    if (!validatePhone(phone)) {
      setError('请输入正确的11位手机号码');
      return;
    }
    if (password.length < 8) {
      setError('密码长度至少8位');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('密码必须包含至少一个大写字母');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('密码必须包含至少一个数字');
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError('密码必须包含至少一个特殊字符 (!@#$%^&*)');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const finalIdCard = idCardCorrected || idCard;
      const result = await register({
        username,
        idCard: finalIdCard,
        email,
        phone,
        password,
        remark,
        role: 'patient'
      });
      if (result.success) {
        setMessage('🎉 注册成功！正在进入系统...');
        setTimeout(() => {
          const redirectPath = isMobileDevice() ? '/mobile/home' : '/desktop/home';
          navigate(redirectPath);
        }, 1500);
      } else {
        setError(result.message || '注册失败，请重试');
      }
    } catch (err) {
      setError('注册失败，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${isRegister ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isRegister ? (
                <UserPlus className="w-10 h-10 text-green-600" />
              ) : (
                <LogIn className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? '实名注册' : '欢迎回来'}
          </h1>
          <p className="text-gray-600">
            {isRegister ? '填写真实信息以完成注册' : '使用您的姓名或邮箱登录'}
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              !isRegister 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              isRegister 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isRegister ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">真实姓名 *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="输入真实姓名"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身份证号 *</label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => handleIdCardChange(e.target.value)}
                onBlur={validateIdCard}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  idCardError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="18位身份证号码"
                maxLength={18}
                required
              />
              {idCardError && <p className="text-red-500 text-xs mt-1">{idCardError}</p>}
              {idCardCorrected && <p className="text-green-500 text-xs mt-1">已自动修正为：{idCardCorrected}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号 *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="11位手机号码"
                maxLength={11}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码 *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="设置密码"
                required
              />
              <div className="mt-2 space-y-1 bg-gray-50 p-3 rounded-lg">
                <p className={`text-xs flex items-center ${passwordStrength.length ? 'text-green-500' : 'text-gray-400'}`}>
                  <span className="mr-2">{passwordStrength.length ? '✓' : '○'}</span>至少8位字符
                </p>
                <p className={`text-xs flex items-center ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                  <span className="mr-2">{passwordStrength.uppercase ? '✓' : '○'}</span>至少1个大写字母
                </p>
                <p className={`text-xs flex items-center ${passwordStrength.number ? 'text-green-500' : 'text-gray-400'}`}>
                  <span className="mr-2">{passwordStrength.number ? '✓' : '○'}</span>至少1个数字
                </p>
                <p className={`text-xs flex items-center ${passwordStrength.special ? 'text-green-500' : 'text-gray-400'}`}>
                  <span className="mr-2">{passwordStrength.special ? '✓' : '○'}</span>至少1个特殊字符 (!@#$%^&*)
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">确认密码 *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="再次输入密码"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="选填：职业、科室等补充信息"
                rows={2}
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:opacity-90">
              注册
            </button>
            <div className="text-center pt-4">
              <button type="button" onClick={() => setIsRegister(false)} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4 mr-1" />已有账户？返回登录
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名 / 邮箱</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的姓名或邮箱"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                required
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90">
              登录
            </button>
            <div className="text-center pt-4">
              <button type="button" onClick={() => setIsRegister(true)} className="text-sm text-blue-600 hover:text-blue-800">
                没有账户？立即注册
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;