document.addEventListener('DOMContentLoaded', async function () {
  const apiKey = '593f9adf6748e7e712bc6b58'; // Substitua pela sua chave de API
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  const fromCurrency = document.getElementById('from-currency');
  const toCurrency = document.getElementById('to-currency');
  const amountInput = document.getElementById('amount');
  const convertBtn = document.getElementById('convert-btn');
  const convertedValueElement = document.getElementById('converted-value');

  let exchangeRates = {};

  try {
    // Carrega as taxas de câmbio da API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar as taxas de câmbio.');
    }
    const data = await response.json();
    if (data.result !== 'success') {
      throw new Error('Erro na resposta da API.');
    }

    exchangeRates = data.conversion_rates;

    // Preenche os dropdowns com as moedas disponíveis
    populateCurrencies(Object.keys(exchangeRates));
  } catch (error) {
    console.error(error);
    convertedValueElement.textContent = 'Erro ao carregar as moedas.';
    convertedValueElement.style.color = '#e74c3c';
  }

  // Função para preencher os dropdowns de moedas
  function populateCurrencies(currencies) {
    currencies.forEach(currency => {
      const optionFrom = document.createElement('option');
      optionFrom.value = currency;
      optionFrom.textContent = currency;
      fromCurrency.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = currency;
      optionTo.textContent = currency;
      toCurrency.appendChild(optionTo);
    });
  }

  // Função para converter moedas
  convertBtn.addEventListener('click', function () {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
      convertedValueElement.textContent = 'Por favor, insira um valor válido.';
      convertedValueElement.style.color = '#e74c3c';
      return;
    }

    if (from === to) {
      convertedValueElement.textContent = 'As moedas de origem e destino são iguais.';
      convertedValueElement.style.color = '#f1c40f';
      return;
    }

    const rateFrom = exchangeRates[from];
    const rateTo = exchangeRates[to];

    if (!rateFrom || !rateTo) {
      convertedValueElement.textContent = 'Erro ao calcular a conversão.';
      convertedValueElement.style.color = '#e74c3c';
      return;
    }

    const convertedAmount = ((amount / rateFrom) * rateTo).toFixed(2);
    convertedValueElement.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    convertedValueElement.style.color = '#27ae60';
  });
});