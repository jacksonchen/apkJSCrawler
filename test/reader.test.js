var expect = require('chai').expect;
var reader = require('../lib/reader');

describe('reads', function () {

    it('reads in a list of keywords from a CSV file', function () {
        var result = reader('../packages.csv');
        expect(result).to.have.length(3)
    })

})
