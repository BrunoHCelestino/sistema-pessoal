import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api/auth.js';
import { useAuthStore } from '../../store/authStore.js';
import { MotionDiv, MotionForm } from '../../utils/motion.jsx';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!formData.login.trim() || !formData.password) {
      setError('Informe login e senha para continuar.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const data = await loginApi({
        login: formData.login.trim(),
        password: formData.password,
      });
      if (!data?.token) throw new Error('Resposta inesperada do servidor.');
      login(data.token, remember);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.message || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const shake = Boolean(error);

  return (
    <section className="login">
      <div className="login__bg" aria-hidden="true">
        <div className="login__bg-orb login__bg-orb--1" />
        <div className="login__bg-orb login__bg-orb--2" />
      </div>

      <div className="login__wrapper">
        <MotionDiv
          className="login__header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="login__tag">// acesso</span>
          <h1 className="login__title">
            Área <span className="accent">Restrita</span>
          </h1>
          <div className="login__divider" aria-hidden="true" />
        </MotionDiv>

        <MotionForm
          className={`login__form glass ${shake ? 'login__form--error' : ''}`}
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        >
          <div className="login__field">
            <label htmlFor="loginUser" className="login__label">Login</label>
            <input
              type="text"
              id="loginUser"
              name="login"
              className="login__input"
              placeholder="seu.usuario"
              value={formData.login}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="login__field">
            <label htmlFor="loginPass" className="login__label">Senha</label>
            <input
              type="password"
              id="loginPass"
              name="password"
              className="login__input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <label className="login__remember">
            <input
              type="checkbox"
              className="login__checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="login__checkmark" aria-hidden="true" />
            <span className="login__remember-text">Lembrar de mim</span>
          </label>

          {error && (
            <p className="login__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`btn btn--primary btn--full login__btn ${sending ? 'is-loading' : ''}`}
            disabled={sending}
          >
            <span>{sending ? 'Entrando…' : 'Entrar'}</span>
            <span className="btn__icon" aria-hidden="true">→</span>
          </button>
        </MotionForm>
      </div>
    </section>
  );
}