var bitcoin = bitcoin || mockBitcoin()

function mockBitcoin() {
  var _BTC_IN_SATOSHI = 100000000;
  var _MBTC_IN_SATOSHI = 100000;
  var _UBTC_IN_SATOSHI = 100;
  var userAddress = 'poqjer23rfc234laq';
  var transactions = [];
  var exchangeRateListeners = [];
  var bitcoinFormatToSatoshi = {
    BTC: _BTC_IN_SATOSHI,
    mBTC: _MBTC_IN_SATOSHI,
    µBTC: _UBTC_IN_SATOSHI
  }
  var preferredBitcoinFormat = 'mBTC';
  var locale = navigator.language;

  return {
    BTC_IN_SATOSHI: _BTC_IN_SATOSHI,
    MBTC_IN_SATOSHI: _MBTC_IN_SATOSHI,
    UBTC_IN_SATOSHI: _UBTC_IN_SATOSHI,

    TX_TYPE_INCOMING: "incoming",
    TX_TYPE_OUTGOING: "outgoing",

    sendMoney: function(address, amount, callback){
      if (!address) { throw "address argument is undefined" }

      var result = prompt("Send bitcoins to " + address + ": ", amount);

      if (callback) {
        if (result) {
          var txid = transactions.length + "";

          transactions.push({
            id: txid,
            amount: amount,
            type: bitcoin.TX_TYPE_OUTGOING,
            timestamp: new Date().toISOString(),
            inputAddresses: [userAddress],
            outputAddresses: [address]
          });

          callback(true, txid);
        } else {
          callback(false);
        }
      }
    },

    getTransaction: function(id, callback){
      if (!id || !callback){ throw "id and callback are required" }

      var tx = transactions.filter(function(t){ return t.id == id })[0]
      callback(tx);
    },

    getSystemInfo: function(callback){
      if (!callback){
        throw "callback is undefined";
      }
      callback({
        version: "0.9",
        buildNumber: "2013120901",
        decimalSeparator: (0.1).toLocaleString().substring(1, 2),
        locale: locale,
        preferredCurrency: "USD",
        preferredBitcoinFormat: preferredBitcoinFormat
      });
    },

    addExchangeRateListener: function(callback) {
      if (!callback){ throw "callback is required" }

      exchangeRateListeners.push(callback)
    },

    updateExchangeRate: function(currency) {
      exchangeRateListeners.forEach(function(fn){
        fn(currency, Number((Math.random() * 1000).toFixed(2)))
      })
    },

    getUserInfo: function(callback){
      if (!callback){
        throw "callback is required";
      }
      callback({
        firstName: 'Homer',
        lastName:  'Simpson',
        email:     'homer@fake.com',
        address:   userAddress
      });
    },

    makeRequest: function(endpoint, args){
      args['url'] = endpoint.replace(/http[s]?:\/\//gi, "http://www.corsproxy.com/");
        $.ajax(args);
    },

    userStringForSatoshi: function(satoshiAmount) {
      var amount = satoshiAmount / bitcoinFormatToSatoshi[preferredBitcoinFormat]
      return amount.toLocaleString()
    },

    satoshiFromUserString: function(formattedAmount) {
      var thousandsSeparator = (1000).toLocaleString().substring(1, 2)
      var floatValue = parseFloat(formattedAmount.replace(thousandsSeparator, ''))
      return floatValue * bitcoinFormatToSatoshi[preferredBitcoinFormat]
    },

    userStringForCurrencyValue: function(amount) {
      var formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      });
      return formatter.format(amount).substring(1)
    },
  };
}

var btc_string_to_satoshi = function(amount, separator){
  if (typeof(amount)=='string'){
    var tab = [];
    if (amount.indexOf(separator) > 0 ){
      tab = amount.split(separator);
    }else{
      tab = [amount,'0'];
    }
    var count = tab[1].length;
    tab = [parseInt(tab[0]), parseInt(tab[1])];
    return tab[0]*bitcoin.BTC_IN_SATOSHI + tab[1]*(bitcoin.BTC_IN_SATOSHI/(Math.pow(10,count)));
  }else{
    return Math.round(amount*bitcoin.BTC_IN_SATOSHI);
  }
};

