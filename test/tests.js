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

