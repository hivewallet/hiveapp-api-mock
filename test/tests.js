describe('constants', function(){
  it('BTC_IN_SATOSHI', function(){ expect(bitcoin.BTC_IN_SATOSHI).to.eql(100000000) })
  it('MBTC_IN_SATOSHI', function(){ expect(bitcoin.MBTC_IN_SATOSHI).to.eql(100000) })
  it('UBTC_IN_SATOSHI', function(){ expect(bitcoin.UBTC_IN_SATOSHI).to.eql(100) })
})

describe('getUserInfo', function(){
  it('passes user info hash to callback provided', function(done){
    bitcoin.getUserInfo(function(info){
      expect(info).to.only.have.keys('firstName', 'lastName', 'email', 'address')
      done()
    })
  })
})

describe('getSystemInfo', function(){
  it('passes system info hash to callback provided', function(done){
    bitcoin.getSystemInfo(function(info){
      expect(info).to.only.have.keys('version', 'buildNumber',
                                     'decimalSeparator', 'locale',
                                     'preferredCurrency', 'preferredBitcoinFormat')
      done()
    })
  })
})

describe('addExchangeRateListener', function(){
  it('passes currency and exchange rate to callback when updateExchangeRate is invoked', function(done){
    var currency = "SGD"
    bitcoin.addExchangeRateListener(function(currency, rate){
      expect(currency).to.eql(currency)
      expect(rate).to.be.a("number")
      done()
    })
    bitcoin.updateExchangeRate(currency)
  })
})

describe('sendMoney', function(){
  var originalPrompt;
  var address = "142m1MpXHhymF4aASiWwYohe1Y55v5BQwc"
  var amount = 5 * bitcoin.MBTC_IN_SATOSHI

  beforeEach(function(){ originalPrompt = window.prompt })

  describe('success', function(){
    beforeEach(function(){
      window.prompt = function(){ return true }
    })

    it('true and transaction ID are passed to callback', function(done){
      bitcoin.sendMoney(address, amount, function(success, transactionId){
        expect(success).to.be(true)
        expect(transactionId).to.be.a('string')
        done()
      })
    })

    describe('transaction can be looked up by the returned transaction ID', function(){
      var success, transactionId, info;

      beforeEach(function(done){
        bitcoin.sendMoney(address, amount, function(_success, _transactionId){
          bitcoin.getTransaction(_transactionId, function(_info){
            success = _success;
            transactionId = _transactionId;
            info = _info;
            done()
          })
        })
      })

      describe('getTransaction', function(){
        it('id matches', function(){ expect(info.id).to.eql(transactionId) })
        it('amount matches', function(){ expect(info.amount).to.eql(amount) })

        it('input address matches', function(done){
          bitcoin.getUserInfo(function(userInfo){
            expect(info.inputAddresses).to.eql([userInfo.address])
            done()
          })
        })
        it('output address matches', function(){
          expect(info.outputAddresses).to.eql([address])
        })
        it('timestamp is parseable', function(){
          expect(isNaN(Date.parse(info.timestamp))).to.be(false)
        })
        it('type is outgoing', function(){
          expect(info.type).to.eql(bitcoin.TX_TYPE_OUTGOING)
        })
      })
    })
  })

  describe('failure', function(){
    beforeEach(function(){
      window.prompt = function(){ return false }
    })

    it('false is passed to the callback', function(done){
      bitcoin.sendMoney(address, amount, function(success, transactionId){
        expect(success).to.be(false)
        done()
      })
    })
  })

  afterEach(function(){ window.prompt = originalPrompt })
})

describe('makeRequest', function(){
  var originalJQuery, args;

  beforeEach(function(){
    originalJQuery = window.$;
    window.$ = window.$ || {}
    $.ajax = function(_args){ args = _args }
  })

  it('proxies the request through corsproxy.com', function(){
    var requestParams = {
      type: 'GET',
      data: {},
      success: function(data, textStatus, jqXHR){
        console.log("success ", arguments)
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log("error ", arguments)
      },
      timeout: 30000,
      dataType: 'json'
    }

    bitcoin.makeRequest('https://www.bitstamp.net/api/ticker/', requestParams)

    requestParams.url = 'http://www.corsproxy.com/www.bitstamp.net/api/ticker/'
    expect(args).to.eql(requestParams)
  })

  afterEach(function(){
    window.$ = originalJQuery;
  })
})

describe('userStringForSatoshi', function(){
  it('returns the value string formatted in user preferred denomination (default to mBTC)', function(){
    expect(bitcoin.userStringForSatoshi(bitcoin.BTC_IN_SATOSHI)).to.eql("1,000")
    expect(bitcoin.userStringForSatoshi(bitcoin.MBTC_IN_SATOSHI)).to.eql("1")
    expect(bitcoin.userStringForSatoshi(bitcoin.UBTC_IN_SATOSHI)).to.eql("0.001")
  })
})

describe('satoshiFromUserString', function(){
  it('given a formatted string in user preferred denomination (default to mBTC) return the satoshi value', function(){
    expect(bitcoin.satoshiFromUserString("1,000")).to.eql(bitcoin.BTC_IN_SATOSHI)
    expect(bitcoin.satoshiFromUserString("1")).to.eql(bitcoin.MBTC_IN_SATOSHI)
    expect(bitcoin.satoshiFromUserString("0.001")).to.eql(bitcoin.UBTC_IN_SATOSHI)
  })
})

