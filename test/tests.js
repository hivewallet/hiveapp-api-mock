describe('constants', function(){
  it('BTC_IN_SATOSHI', function(){ expect(bitcoin.BTC_IN_SATOSHI).to.eql(100000000) })
  it('MBTC_IN_SATOSHI', function(){ expect(bitcoin.MBTC_IN_SATOSHI).to.eql(100000) })
  it('UBTC_IN_SATOSHI', function(){ expect(bitcoin.UBTC_IN_SATOSHI).to.eql(100) })
})

describe('getUserInfo', function(){
  it('passes user info hash to callback provided', function(){
    bitcoin.getUserInfo(function(info){
      expect(info).to.only.have.keys('firstName', 'lastName', 'email', 'address')
    })
  })
})

describe('getSystemInfo', function(){
  it('passes system info hash to callback provided', function(){
    bitcoin.getSystemInfo(function(info){
      expect(info).to.only.have.keys('version', 'buildNumber',
                                     'decimalSeparator', 'locale',
                                     'preferredCurrency', 'preferredBitcoinFormat')
    })
  })
})

describe('addExchangeRateListener', function(){
  it('passes currency and exchange rate to callback when updateExchangeRate is invoked', function(){
    var currency = "SGD"
    bitcoin.addExchangeRateListener(function(currency, rate){
      expect(currency).to.eql(currency)
      expect(rate).to.be.a("number")
    })
    bitcoin.updateExchangeRate(currency)
  })
})
