import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowLeft, Eye, EyeOff, User, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type ViewMode = 'login' | 'register' | 'forgot' | 'reset' | 'success';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [debugCode, setDebugCode] = useState('');

  const t = {
    ru: {
      login: 'Вход',
      register: 'Регистрация',
      phone: 'Номер телефона',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      name: 'Ваше имя',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      registerBtn: 'Зарегистрироваться',
      loginBtn: 'Войти',
      back: 'Назад',
      backToHome: 'На главную',
      resetPassword: 'Восстановление пароля',
      sendCode: 'Отправить код',
      enterCode: 'Введите код',
      codeSent: 'Код отправлен на ваш номер',
      newPassword: 'Новый пароль',
      changePassword: 'Сменить пароль',
      passwordChanged: 'Пароль успешно изменён!',
      goToLogin: 'Войти',
      passwordsNotMatch: 'Пароли не совпадают',
      minPassword: 'Минимум 4 символа',
      codeHint: 'Код был отправлен в Telegram администратору',
    },
    uz: {
      login: 'Kirish',
      register: 'Ro\'yxatdan o\'tish',
      phone: 'Telefon raqami',
      password: 'Parol',
      confirmPassword: 'Parolni tasdiqlang',
      name: 'Ismingiz',
      forgotPassword: 'Parolni unutdingizmi?',
      noAccount: 'Hisobingiz yo\'qmi?',
      hasAccount: 'Hisobingiz bormi?',
      registerBtn: 'Ro\'yxatdan o\'tish',
      loginBtn: 'Kirish',
      back: 'Orqaga',
      backToHome: 'Bosh sahifa',
      resetPassword: 'Parolni tiklash',
      sendCode: 'Kod yuborish',
      enterCode: 'Kodni kiriting',
      codeSent: 'Kod raqamingizga yuborildi',
      newPassword: 'Yangi parol',
      changePassword: 'Parolni o\'zgartirish',
      passwordChanged: 'Parol muvaffaqiyatli o\'zgartirildi!',
      goToLogin: 'Kirish',
      passwordsNotMatch: 'Parollar mos kelmadi',
      minPassword: 'Kamida 4 ta belgi',
      codeHint: 'Kod Telegram administratoriga yuborildi',
    }
  };

  const text = t[language] || t.uz;

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      setError(language === 'ru' ? 'Заполните все поля' : 'Barcha maydonlarni to\'ldiring');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(phone, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Xatolik');
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!phone.trim() || !password.trim()) {
      setError(language === 'ru' ? 'Заполните все поля' : 'Barcha maydonlarni to\'ldiring');
      return;
    }
    
    if (password !== confirmPassword) {
      setError(text.passwordsNotMatch);
      return;
    }
    
    if (password.length < 4) {
      setError(text.minPassword);
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await register(phone, password, name);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Xatolik');
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!phone.trim()) {
      setError(language === 'ru' ? 'Введите номер телефона' : 'Telefon raqamini kiriting');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await forgotPassword(phone);
    
    if (result.success) {
      setDebugCode(result.code || '');
      setViewMode('reset');
      setSuccessMessage(text.codeSent);
    } else {
      setError(result.error || 'Xatolik');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim()) {
      setError(language === 'ru' ? 'Заполните все поля' : 'Barcha maydonlarni to\'ldiring');
      return;
    }
    
    if (newPassword.length < 4) {
      setError(text.minPassword);
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await resetPassword(phone, resetCode, newPassword);
    
    if (result.success) {
      setViewMode('success');
    } else {
      setError(result.error || 'Xatolik');
    }
    
    setLoading(false);
  };

  const inputClass = `w-full px-4 py-3 pl-12 rounded-xl border transition-all outline-none ${
    isDark 
      ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-blue-400 focus:bg-white/15' 
      : 'bg-white border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:bg-blue-50'
  }`;

  const buttonClass = `w-full py-3.5 rounded-xl font-bold transition-all duration-200 ${
    loading 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'
  } text-white`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900' 
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
    }`}>
      <div className={`w-full max-w-md backdrop-blur-xl border rounded-2xl p-6 sm:p-8 shadow-2xl ${
        isDark 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white border-blue-200'
      }`}>
        
        {/* Success View */}
        {viewMode === 'success' && (
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-10 h-10 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-blue-900'}`}>
              {text.passwordChanged}
            </h2>
            <button
              onClick={() => { setViewMode('login'); setPassword(''); }}
              className={buttonClass}
            >
              {text.goToLogin}
            </button>
          </div>
        )}

        {/* Login View */}
        {viewMode === 'login' && (
          <>
            <div className="text-center mb-6">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
                {text.login}
              </h1>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={text.password}
                  className={inputClass}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/50 hover:text-white' : 'text-blue-400 hover:text-blue-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? '...' : text.loginBtn}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => { setViewMode('forgot'); setError(''); }}
                  className={`${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {text.forgotPassword}
                </button>
                <button
                  onClick={() => { setViewMode('register'); setError(''); }}
                  className={`${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {text.noAccount}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Register View */}
        {viewMode === 'register' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setViewMode('login'); setError(''); }}
                className={`p-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-100 hover:bg-blue-200'}`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-blue-800'}`} />
              </button>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
                {text.register}
              </h1>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={text.name}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={text.password}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/50 hover:text-white' : 'text-blue-400 hover:text-blue-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={text.confirmPassword}
                  className={inputClass}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? '...' : text.registerBtn}
              </button>

              <p className={`text-center text-sm ${isDark ? 'text-blue-200/60' : 'text-blue-600'}`}>
                {text.hasAccount}{' '}
                <button
                  onClick={() => { setViewMode('login'); setError(''); }}
                  className={`font-medium ${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'}`}
                >
                  {text.loginBtn}
                </button>
              </p>
            </div>
          </>
        )}

        {/* Forgot Password View */}
        {viewMode === 'forgot' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setViewMode('login'); setError(''); }}
                className={`p-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-100 hover:bg-blue-200'}`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-blue-800'}`} />
              </button>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
                {text.resetPassword}
              </h1>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? '...' : text.sendCode}
              </button>
            </div>
          </>
        )}

        {/* Reset Password View */}
        {viewMode === 'reset' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setViewMode('forgot'); setError(''); setSuccessMessage(''); }}
                className={`p-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-100 hover:bg-blue-200'}`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-blue-800'}`} />
              </button>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
                {text.changePassword}
              </h1>
            </div>

            <div className="space-y-4">
              {successMessage && (
                <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
                  {successMessage}
                </div>
              )}

              {debugCode && (
                <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}`}>
                  <p className="font-medium mb-1">{text.codeHint}</p>
                  <p className="text-lg font-mono font-bold">{debugCode}</p>
                </div>
              )}

              <div className="relative">
                <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder={text.enterCode}
                  className={inputClass}
                  maxLength={6}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={text.newPassword}
                  className={inputClass}
                  onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/50 hover:text-white' : 'text-blue-400 hover:text-blue-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? '...' : text.changePassword}
              </button>
            </div>
          </>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm ${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {text.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
