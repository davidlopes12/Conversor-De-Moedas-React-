import { useState, useEffect } from 'react'
import './CurrencyConverter.css'


function CurrencyConverter() {
  const [rates, setRates] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const[amount, setAmount] = useState(1);
  const[convertedAmount, setConvertedAmount] = useState(null);
  
  useEffect(() => {
    const currency = async () => {
      try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/4cfcc3091a820322bb02d96f/latest/USD');
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        setRates(data.conversion_rates);
      } catch (error) {
        console.error('Erro durante a requisição:', error);
      }
    };
    currency();
  }, []);
  
  useEffect(() => {
    if (rates) {
      const rateFrom = rates[fromCurrency] || 0;
      const rateTo = rates[toCurrency] || 0;
      setConvertedAmount(((amount / rateFrom) * rateTo).toFixed(2));
    }
  }, [amount, rates, fromCurrency, toCurrency]);

  if (!rates) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='converter'>
        <h2>Conversor de moedas</h2>
        <input
          type="number"
          placeholder='Digite o valor...'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span>Selecione as moedas</span>
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {Object.keys(rates).map((currency) => (
              <option value={currency} key={currency}>{currency}</option>
            ))}
        </select>
        <span>Para</span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {Object.keys(rates).map((currency) => (
              <option value={currency} key={currency}>{currency}</option>
            ))}
        </select>
        <h3>{convertedAmount} {toCurrency}</h3>
        <p>{amount} {fromCurrency} valem {convertedAmount} {toCurrency}</p>
    </div>
  )
}

export default CurrencyConverter