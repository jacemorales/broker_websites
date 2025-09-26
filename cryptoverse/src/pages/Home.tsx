import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <a href="/">CryptoVerse</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Invest in the Future of Finance</h1>
            <p>Buy, sell, and hold cryptocurrencies with confidence.</p>
            <button id="start-investing-btn" className="cta-button" onClick={openModal}>Start Investing</button>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 CryptoVerse. All rights reserved.</p>
      </footer>

      {isModalOpen && <AuthModal closeModal={closeModal} />}
    </>
  );
};

export default Home;
