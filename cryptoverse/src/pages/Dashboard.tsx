import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexCharts from 'apexcharts';
import { User, Coin, Investment } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [marketData, setMarketData] = useState<Coin[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeChart, setActiveChart] = useState<ApexCharts | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
      alert('You must be logged in to view this page.');
      navigate('/');
    } else {
      setLoggedInUser(JSON.parse(user));
    }
  }, [navigate]);

  const updateAllUserData = (updatedUser: User) => {
    sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    let allUsers: User[] = JSON.parse(localStorage.getItem('cryptoUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('cryptoUsers', JSON.stringify(allUsers));
    }
    setLoggedInUser(updatedUser);
  };

  const renderInvestments = () => {
      // This function is now handled by React's rendering.
      // The interval logic is kept in a useEffect.
  };

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchData = async () => {
        try {
            const marketsApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
            const marketsResponse = await fetch(marketsApiUrl);
            if (!marketsResponse.ok) throw new Error('API Error');
            const data = await marketsResponse.json();
            setMarketData(data);
        } catch (error) {
            console.error('Could not load market data.', error);
        }
    };

    fetchData();
    const interval = setInterval(renderInvestments, 60000);
    return () => clearInterval(interval);
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser || !chartRef.current) return;

    if (activeChart) {
        activeChart.destroy();
    }

    const investments = loggedInUser.investments || [];
    const activeInvestments = investments.filter(inv => inv.status === 'active');

    if (activeInvestments.length === 0) {
        if(chartRef.current) chartRef.current.innerHTML = `<p class="no-investments">No active investments to display.</p>`;
        return;
    }

    const portfolio = activeInvestments.reduce((acc, investment) => {
        if (!acc[investment.coinName]) {
            acc[investment.coinName] = 0;
        }
        acc[investment.coinName] += investment.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.values(portfolio);
    const chartLabels = Object.keys(portfolio);

    const options: ApexCharts.ApexOptions = {
        chart: { type: 'pie', height: 350, background: 'transparent', toolbar: { show: true, tools: { download: true } } },
        series: chartData,
        labels: chartLabels,
        colors: ['#00FFAB', '#00E396', '#00D482', '#00C56E', '#00B65A'],
        legend: { position: 'bottom', labels: { colors: '#a0a0a0' } },
        responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
    };

    const chart = new ApexCharts(chartRef.current, options);
    setActiveChart(chart);
    chart.render();

    return () => {
        chart.destroy();
    };

  }, [loggedInUser]);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/');
  };

  const handleInvestment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser || !selectedCoin) return;

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const duration = parseInt(formData.get('duration') as string, 10);

    if (isNaN(amount) || amount <= 0) {
        return alert('Please enter a valid amount.');
    }
    if (amount > loggedInUser.total_account_balance) {
        return alert('Insufficient funds.');
    }

    const purchaseDate = new Date();
    const maturityDate = new Date(purchaseDate);
    maturityDate.setDate(purchaseDate.getDate() + duration);

    const newInvestment: Investment = {
        id: Date.now(),
        coinName: selectedCoin.name,
        amount: amount,
        purchaseDate: purchaseDate.toISOString(),
        duration: duration,
        maturityDate: maturityDate.toISOString(),
        status: 'active'
    };

    const updatedUser: User = {
        ...loggedInUser,
        total_account_balance: loggedInUser.total_account_balance - amount,
        investment_balance: (loggedInUser.investment_balance || 0) + amount,
        investments: [...(loggedInUser.investments || []), newInvestment]
    };

    updateAllUserData(updatedUser);
    alert(`Successfully invested $${amount} in ${selectedCoin.name} for ${duration} days!`);
    setIsInvestModalOpen(false);
  };

  const handleTopUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser) return;

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);

    if (isNaN(amount) || amount <= 0) { return alert('Please enter a valid amount.'); }

    const updatedUser: User = { ...loggedInUser, total_account_balance: loggedInUser.total_account_balance + amount };
    updateAllUserData(updatedUser);
    alert(`Successfully topped up $${amount}!`);
    setIsTopUpModalOpen(false);
  };

  const handleSpecificWithdrawal = (investmentId: number) => {
    if (!loggedInUser || !loggedInUser.investments) return;

    const investmentIndex = loggedInUser.investments.findIndex(inv => inv.id === investmentId);

    if (investmentIndex === -1) {
        return alert('Error: Investment not found.');
    }

    const investment = loggedInUser.investments[investmentIndex];

    const updatedUser: User = {
        ...loggedInUser,
        total_account_balance: loggedInUser.total_account_balance + investment.amount,
        investment_balance: loggedInUser.investment_balance - investment.amount,
        investments: loggedInUser.investments.map(inv => inv.id === investmentId ? {...inv, status: 'withdrawn'} : inv)
    };

    updateAllUserData(updatedUser);
    alert(`Successfully withdrew $${investment.amount} from your ${investment.coinName} investment.`);
  };

  const formatTimeRemaining = (maturityDate: string) => {
    const now = new Date();
    const maturity = new Date(maturityDate);
    const diff = maturity.getTime() - now.getTime();

    if (diff <= 0) {
        return <span className="status-matured">Matured</span>;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return <span className="status-active">{days}d {hours}h {minutes}m remaining</span>;
  };

  const generateCoinSvg = (symbol: string) => {
    const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs><radialGradient id="grad-${cleanSymbol}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:#e94560;stop-opacity:0.5" /><stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" /></radialGradient></defs>
            <circle cx="50" cy="50" r="50" fill="url(#grad-${cleanSymbol})" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f0f0f0" font-size="30" font-family="Roboto, sans-serif" font-weight="bold">${cleanSymbol}</text>
        </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  if (!loggedInUser) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <header>
        <nav>
            <div className="logo">
                <a href="/dashboard">CryptoVerse</a>
            </div>
            <div className="user-nav">
                <button className="user-balance" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    Balance: ${(loggedInUser.total_account_balance || 0).toLocaleString()} <span className="arrow">&#9662;</span>
                </button>
                {isDropdownOpen && (
                    <div className="user-dropdown" style={{ display: 'block' }}>
                        <p className="dropdown-header">{loggedInUser.fullName}</p>
                        <p className="dropdown-email">{loggedInUser.email}</p>
                        <hr />
                        <button className="top-up-button" onClick={() => setIsTopUpModalOpen(true)}>Top Up</button>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    </header>

    <main>
        <section className="dashboard-chart">
            <div className="chart-header">
                <h2>Portfolio Overview</h2>
            </div>
            <div id="chart-title-container">
                <h3 id="chart-title">
                    {loggedInUser.investments?.some(inv => inv.status === 'active') ? 'Your Portfolio Allocation' : 'Your Portfolio'}
                </h3>
                <p id="chart-subtitle">
                    {loggedInUser.investments?.some(inv => inv.status === 'active') ? 'Distribution of your total invested capital.' : 'Make an investment to see your portfolio breakdown.'}
                </p>
            </div>
            <div id="chart-container" ref={chartRef}>
            </div>
            <div className="investment-info">
                <p>Investment Balance: <span id="investment-balance">${(loggedInUser.investment_balance || 0).toLocaleString()}</span></p>
            </div>
        </section>

        <section id="investments" className="user-investments">
            <h2>Your Investments</h2>
            <div id="investments-list-container">
                {loggedInUser.investments?.filter(inv => inv.status === 'active').length > 0 ? (
                    loggedInUser.investments.filter(inv => inv.status === 'active').map(investment => (
                        <div className="investment-card" key={investment.id}>
                            <div className="investment-card-header">
                                <h3>{investment.coinName}</h3>
                                <p>${investment.amount.toLocaleString()}</p>
                            </div>
                            <div className="investment-card-body">
                                <p>Matures on: {new Date(investment.maturityDate).toLocaleDateString()}</p>
                                <div className="investment-status">
                                    {formatTimeRemaining(investment.maturityDate)}
                                </div>
                            </div>
                            <div className="investment-card-footer">
                                <button className="btn-withdraw-investment" onClick={() => handleSpecificWithdrawal(investment.id)} disabled={new Date() < new Date(investment.maturityDate)}>
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-investments">You have no active investments.</p>
                )}
            </div>
        </section>

        <section id="market" className="crypto-market">
            <h2>Live Market</h2>
            <div className="market-container">
                {marketData.length > 0 ? (
                    marketData.map((coin, index) => (
                        <div className="crypto-card" key={coin.symbol} style={{ '--card-index': index } as React.CSSProperties}>
                            <div className="card-header">
                                <img src={generateCoinSvg(coin.symbol)} alt={`${coin.name} logo`} />
                                <div className="name-symbol">
                                    <h3>{coin.name}</h3>
                                    <p>{coin.symbol.toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="price">${coin.current_price.toLocaleString()}</p>
                            </div>
                            <button className="btn-invest" onClick={() => { setSelectedCoin(coin); setIsInvestModalOpen(true); }}>Invest</button>
                        </div>
                    ))
                ) : (
                    <p>Could not load market data.</p>
                )}
            </div>
        </section>
    </main>

    {isInvestModalOpen && selectedCoin && (
        <div id="invest-modal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close-button" onClick={() => setIsInvestModalOpen(false)}>&times;</span>
                <h2>Invest in {selectedCoin.name}</h2>
                <form id="investment-form" onSubmit={handleInvestment}>
                    <label htmlFor="amount">Amount (USD):</label>
                    <input type="number" id="amount" name="amount" required min="1" max={loggedInUser.total_account_balance} placeholder="e.g., 500" />

                    <label>Investment Duration:</label>
                    <div className="duration-options">
                        <input type="radio" id="7-days" name="duration" value="7" defaultChecked />
                        <label htmlFor="7-days">7 Days</label>
                        <input type="radio" id="30-days" name="duration" value="30" />
                        <label htmlFor="30-days">30 Days</label>
                        <input type="radio" id="90-days" name="duration" value="90" />
                        <label htmlFor="90-days">90 Days</label>
                    </div>

                    <p className="modal-text">Invest big invest now and see what the future market holds for u</p>
                    <button type="submit">Finalize Investment</button>
                </form>
            </div>
        </div>
    )}

    {isTopUpModalOpen && (
        <div id="top-up-modal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close-button" onClick={() => setIsTopUpModalOpen(false)}>&times;</span>
                <h2>Top Up Balance</h2>
                <form id="top-up-form" onSubmit={handleTopUp}>
                    <label htmlFor="top-up-amount">Amount (USD):</label>
                    <input type="number" id="top-up-amount" name="amount" required min="1" placeholder="e.g., 1000" />
                    <label htmlFor="payment-method">Payment Method:</label>
                    <select id="payment-method" name="paymentMethod" required>
                        <option value="bitcoin">Bitcoin</option>
                        <option value="tron">Tron</option>
                        <option value="solana">Solana</option>
                        <option value="litecoin">Litecoin</option>
                        <option value="stripe">Stripe</option>
                    </select>
                    <p className="modal-text">Add to account balance and start making investments now.</p>
                    <button type="submit">Top Up Now</button>
                </form>
            </div>
        </div>
    )}
    </>
  );
};

export default Dashboard;
