import React, { useState, useEffect } from 'react';
import './Login.css'

import Login1 from '../assets/images/Login1.svg'
import Login2 from '../assets/images/Login2.svg'

const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const handleSignUpClick = (e) => {
        e.preventDefault();
        setIsSignUpMode(true);
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        setIsSignUpMode(false);
    };

    useEffect(() => {
        const container = document.querySelector(".container");
        if (container) {
            if (isSignUpMode) {
                container.classList.add("sign-up-mode");
            } else {
                container.classList.remove("sign-up-mode");
            }
        }
    }, [isSignUpMode]);

    return (
        <>
            <div className={`login-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
            {/* <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}> */}
                <div className="forms-container">
                    <div className="signin-signup">
                        <form method="POST" action="{{ route('auth.verification') }}" className="form sign-in-form">
                            <h2 className="title-log">Se connecter</h2>
                            <div className="input-field-login">
                                <i className="fas fa-user"></i>
                                <input className='input' type="text" name="email" placeholder="E-mail" />
                            </div>
                            <div className="input-field-login">
                                <i className="fas fa-lock"></i>
                                <input className='input' type="password" name="password" placeholder="Mot de passe" />
                            </div>

                            <button type="submit" className="btn solid">CONNEXION</button>

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

                        <form action="" className="form sign-up-form">
                            <h2 className="title-log">S'inscrire</h2>
                            <input style={{ display: 'none' }} className="input" type="text" placeholder="Nom" />
                            <input style={{ display: 'none' }} className='input' type="text" placeholder="Prenom" />
                            <input style={{ display: 'none' }} className='input' type="text" placeholder="Role" />
                            <input style={{ display: 'none' }} className='input' type="file" placeholder="Image" />
                            <div className="input-field-login">
                                <i className="fas fa-user"></i>
                                <input className='input' type="text" placeholder="Teléphone" />
                            </div>
                            <div className="input-field-login">
                                <i className="fas fa-envelope"></i>
                                <input className='input' type="text" placeholder="E-mail" />
                            </div>
                            <div className="input-field-login">
                                <i className="fas fa-lock"></i>
                                <input className='input' type="password" placeholder="Mot de passe" />
                            </div>
                            <input type="submit" value="S'inscrire" className="btn solid" />

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
                            <button className="btn transparent" onClick={handleSignUpClick} id="sign-up-btn">S'inscrire</button>

                            <img src={Login1} className="image" alt="" />
                        </div>
                    </div>

                    <div className="panel right-panel">
                        <div className="content">
                            <h1>L'un d'entre nous ?</h1>
                            <p>Déjà membre ? Connectez-vous pour accéder à votre compte et profiter de tous nos services !</p>
                            <button className="btn transparent" onClick={handleSignInClick} id="sign-in-btn">Se connecter</button>

                            <img src={Login2} className="image" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login