var userAddress = 'poqjer23rfc234laq'
var bitcoin = bitcoin || {
  BTC_IN_SATOSHI: 100000000,
  MBTC_IN_SATOSHI: 100000,
  UBTC_IN_SATOSHI: 100,

  TX_TYPE_INCOMING: "incoming",
  TX_TYPE_OUTGOING: "outgoing",

  sendMoney: function(address, amount, callback){
    if (!address) { throw "address argument is undefined" }

    var result = prompt("Send bitcoins to " + address + ": ", amount);

    if (callback) {
      if (result) {
        bitcoin.transactions = bitcoin.transactions || []
        var txid = bitcoin.transactions.length + "";

        bitcoin.transactions.push({
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

    var tx = bitcoin.transactions.filter(function(t){ return t.id == id })[0]
    callback(tx);
  },

  getSystemInfo: function(callback){
    if (!callback){
      throw "callback is undefined";
    }
    callback({
      version: "0.9",
      buildNumber: "2013120901",
      decimalSeparator: ",",
      locale: "en",
      preferredCurrency: "USD",
      preferredBitcoinFormat: "µBTC"
    });
  },

  addExchangeRateListener: function(callback) {
    if (!callback){ throw "callback is required" }

    bitcoin.exchangeRateListeners = bitcoin.exchangeRateListeners || []
    bitcoin.exchangeRateListeners.push(callback)
  },

  updateExchangeRate: function(currency) {
    bitcoin.exchangeRateListeners.forEach(function(fn){
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
    args['url'] = endpoint;
    $.ajax(args);
  }
};

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

