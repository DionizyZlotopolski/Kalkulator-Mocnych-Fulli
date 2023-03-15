import { useState, useEffect } from 'react';
import './Calculator.css';

function App() {
  const [money, setMoney] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://api.nbp.pl/api/exchangerates/tables/A/');
        const data = await response.json();
        const rates = data[0].rates;
        const usdRate = rates.find(rate => rate.code === 'USD').mid;
        const gbpRate = rates.find(rate => rate.code === 'GBP').mid;
        const eurRate = rates.find(rate => rate.code === 'EUR').mid;
        const chfRate = rates.find(rate => rate.code === 'CHF').mid;
        const sekRate = rates.find(rate => rate.code === 'SEK').mid;
        setExchangeRates({ usd: usdRate, gbp: gbpRate, eur: eurRate, chf: chfRate, sek: sekRate });
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const calculateMocnyFull = () => {
    const mocnyFullValue = 2.5;
    if (currency === 'PLN') {
      return (money / mocnyFullValue).toFixed(2);
    } else if (currency === 'USD') {
      return (money * exchangeRates.usd / mocnyFullValue).toFixed(2);
    } else if (currency === 'GBP') {
      return (money * exchangeRates.gbp / mocnyFullValue).toFixed(2);
    } else if (currency === 'EUR') {
      return (money * exchangeRates.eur / mocnyFullValue).toFixed(2);
    } else if (currency === 'CHF') {
      return (money * exchangeRates.chf / mocnyFullValue).toFixed(2);
    } else if (currency === 'SEK') {
      return (money * exchangeRates.sek / mocnyFullValue).toFixed(2);
    }
  }

  const handleMoneyChange = (event) => {
    const input = event.target.value;
    if (/^\d*\.?\d*$/.test(input)) {
      setMoney(input);
    }
  }

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  }

  return (
    <div className="App">
      <div className="calculator">
        <h1>Kalkulator Mocnego Fulla</h1>
        <div>
          <label>Wprowadź kwotę: </label>
          <input type="text" pattern="\d*\.?\d*" value={money} onChange={handleMoneyChange} />
        </div>
        <div>
          <label>Wybierz walutę: </label>
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="CHF">CHF</option>
            <option value="SEK">SEK</option>
          </select>
        </div>
        <div>
          <p>Za <strong>{money} {currency}</strong> możesz kupić <strong>{calculateMocnyFull()} Mocnych Fulli</strong></p>
        </div>
      </div>
    </div>
  );
}

export default App;
