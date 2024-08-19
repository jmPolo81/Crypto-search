const cryptoSelect = document.querySelector('#criptomonedas')
const currencySelect = document.querySelector('#moneda')
const form = document.querySelector('#formulario')
const result = document.querySelector('#resultado')

const objSearch = {
    currency: '',
    cryptoCurrency: ''
}

//Crear un promise para traernos las monedas de la api
const getCrypto = cryptos => new Promise(resolve => {
    resolve(cryptos)
})

document.addEventListener('DOMContentLoaded', () => {
    checkCrypto()

    form.addEventListener('submit', submitForm)

    cryptoSelect.addEventListener('change', readValue)
    currencySelect.addEventListener('change', readValue)

})

function checkCrypto() {
    fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
        .then(res => res.json())
        .then(data => getCrypto(data.Data))
        .then(cryptos => selectCryptos(cryptos))
        .catch(error => console.log(error))
}

function selectCryptos(cryptos) {
    cryptos.forEach(crypto => {
        const { FullName, Name } = crypto.CoinInfo
        const option = document.createElement('OPTION')
        option.value = Name
        option.textContent = FullName
        cryptoSelect.appendChild(option)
    })
}

function readValue(e) {
    objSearch[e.target.name] = e.target.value
}

function submitForm(e) {
    e.preventDefault()

    // Validar Formulario
    const { currency, cryptoCurrency } = objSearch
    if (currency === '' || cryptoCurrency === '') {
        showAlert("Ambos campos son obligatorios")
        return
    }

    // Consulta a la API con los resultados
    APIQuery()
}

function showAlert(message) {
    const errorExist = document.querySelector('.error')

    if (!errorExist) {
        const divAlert = document.createElement('DIV')
        divAlert.classList.add('error')
        divAlert.textContent = message

        form.appendChild(divAlert)

        setTimeout(() => {
            divAlert.remove()
        }, 3000)
    }
}

function APIQuery() {
    const { currency, cryptoCurrency } = objSearch
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoCurrency}&tsyms=${currency}`

    showSpinner()

    fetch(url)
        .then(res => res.json())
        .then(data => printQuotation(data.DISPLAY[cryptoCurrency][currency]))
        .catch(error => console.log(error))
}

function printQuotation(quotation) {
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quotation

    clearHTML()

    const printPrice = document.createElement('P')
    printPrice.classList.add('precio')
    printPrice.innerHTML = `El precio es: <span>${PRICE}</span>`

    const highPrintPrice = document.createElement('P')
    highPrintPrice.innerHTML = `El precio más alto ha sido:  <span>${HIGHDAY}</span>`

    const lowPrintPrice = document.createElement('P')
    lowPrintPrice.innerHTML = `El precio más bajo ha sido:  <span>${LOWDAY}</span>`

    const changePrint = document.createElement('P')
    changePrint.innerHTML = `Variación ultimas 24h.  <span>${CHANGEPCT24HOUR} %</span>`

    const lastUpdatePrint = document.createElement('P')
    lastUpdatePrint.innerHTML = `Última actualización:  <span>${LASTUPDATE}</span>`

    result.appendChild(printPrice)
    result.appendChild(highPrintPrice)
    result.appendChild(changePrint)
    result.appendChild(lastUpdatePrint)

}

function clearHTML() {
    while (result.firstChild) {
        result.removeChild(result.firstChild)
    }
}

function showSpinner() {
    clearHTML()

    const spinner = document.createElement('DIV')
    spinner.classList.add('spinner')

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `
    result.appendChild(spinner)
}
