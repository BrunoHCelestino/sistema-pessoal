import { useEffect, useRef, useState } from 'react';
import { FaSignOutAlt, FaSyncAlt } from 'react-icons/fa';
import { useMessages } from '../../hooks/useMessages.js';
import { useAuthStore } from '../../store/authStore.js';
import profilePhoto from '../../assets/profile.jpg';
import './PageHeader.css';

export default function PageHeader() {
  const { refetch, isLoading } = useMessages();
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header__greet">
        <h1 className="header__title">
          Olá, <span className="accent">Bruno</span>
        </h1>
        <p className="header__sub">Acompanhe as mensagens do seu portfólio.</p>
      </div>

      <div className="header__actions">
        <button
          type="button"
          className="header__iconbtn"
          onClick={() => refetch()}
          disabled={isLoading}
          aria-label="Atualizar dados"
        >
          <FaSyncAlt className={isLoading ? 'header__spin' : ''} aria-hidden="true" />
        </button>

        <div className="header__profile" ref={menuRef}>
          <button
            type="button"
            className="header__avatarbtn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Opções do perfil"
          >
            <img
              className="header__avatar header__avatar--img"
              src={profilePhoto}
              alt="Foto de perfil"
            />
          </button>

          {menuOpen && (
            <div className="header__menu glass-float" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={logout}
              >
                <FaSignOutAlt aria-hidden="true" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}