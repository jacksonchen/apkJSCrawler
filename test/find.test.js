var expect = require('chai').expect
var find = require('../lib/find')

describe('find', function () {

    it('find a list of URLs for the keyword note', function () {
        var result = find('note')
        expect(result).to.have.length(2)
    })

})
