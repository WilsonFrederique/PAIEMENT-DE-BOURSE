import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, setAuthToken } from '../services/login_api';
import './Login.css';

import Login1 from '../assets/images/Login1.svg';
import Login2 from '../assets/images/Login2.svg';

interface FormData {
  email: string;
  password: string;
  telephone?: string;
}

const Login = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUpMode(true);
    setError('');
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUpMode(false);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { email, password } = formData;
      const response = await loginUser(email, password);
      
      if (response.success && response.token && response.user) {
        setAuthToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Vérifiez que response.user.Roles existe et a la bonne valeur
        console.log('User role:', response.user.Roles);
        
        if (response.user.Roles === 'admin' || response.user.Roles === 'superadmin') {
          navigate('/dashbord');
        } else {
          navigate('/dashbordUser');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { email, password, telephone } = formData;
      const userData = {
        Email: email,
        Passwd: password,
        Telephone: telephone,
        Roles: 'user' // Par défaut, un nouvel utilisateur a le rôle 'user'
      };
      
      const response = await registerUser(userData);
      
      if (response.success) {
        // Après inscription réussie, on connecte automatiquement l'utilisateur
        const loginResponse = await loginUser(email, password);
        
        if (loginResponse.success && loginResponse.token) {
          setAuthToken(loginResponse.token);
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          navigate('/dashbord');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Formulaire de connexion */}
          <form onSubmit={handleLogin} className="form sign-in-form">
            <h2 className="title-log">Se connecter</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="input-field-login">
              <i className="fas fa-user"></i>
              <input
                className='input'
                type="text"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field-login">
              <i className="fas fa-lock"></i>
              <input
                className='input'
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn solid" disabled={loading}>
              {loading ? 'Chargement...' : 'CONNEXION'}
            </button>

            <p className="social-text">Ou connectez-vous avec des plateformes sociales</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>

          {/* Formulaire d'inscription */}
          <form onSubmit={handleRegister} className="form sign-up-form">
            <h2 className="title-log">S'inscrire</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="input-field-login">
              <i className="fas fa-phone"></i>
              <input
                className='input'
                type="text"
                name="telephone"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field-login">
              <i className="fas fa-envelope"></i>
              <input
                className='input'
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field-login">
              <i className="fas fa-lock"></i>
              <input
                className='input'
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn solid" disabled={loading}>
              {loading ? 'Chargement...' : "S'INSCRIRE"}
            </button>

            <p className="social-text">Ou inscrivez-vous avec des plateformes sociales</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h1>Nouveau ici ?</h1>
            <p>Rejoignez-nous dès aujourd'hui pour bénéficier de toutes nos fonctionnalités exclusives et faire partie de notre communauté grandissante !</p>
            <button className="btn transparent" onClick={handleSignUpClick} id="sign-up-btn">
              S'inscrire
            </button>
            <img src={Login1} className="image" alt="" />
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h1>L'un d'entre nous ?</h1>
            <p>Déjà membre ? Connectez-vous pour accéder à votre compte et profiter de tous nos services !</p>
            <button className="btn transparent" onClick={handleSignInClick} id="sign-in-btn">
              Se connecter
            </button>
            <img src={Login2} className="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;