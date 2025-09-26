import React from 'react';

const Learn = () => {
  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <a href="/">CryptoVerse</a>
          </div>
        </nav>
      </header>

      <main className="learn-main">
        <section className="learn-hero">
          <h1>Learn the Basics of Cryptocurrency</h1>
          <p>Your journey to understanding digital assets starts here.</p>
        </section>

        <section className="learn-content">
          <article>
            <h2>What is Cryptocurrency?</h2>
            <p>A cryptocurrency is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit or double-spend. Many cryptocurrencies are decentralized networks based on blockchain technology—a distributed ledger enforced by a disparate network of computers.</p>
          </article>
          <article>
            <h2>What is a Blockchain?</h2>
            <p>A blockchain is a continuously growing list of records, called blocks, that are linked together using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. This makes it resistant to modification of its data.</p>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 CryptoVerse. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Learn;
