const rp = require('request-promise');
const cheerio = require('cheerio');
var Promise = require('bluebird');
const _ = require('lodash');
const DarkSky = require('dark-sky')
const darksky = new DarkSky('837ebf10d4887b46f40f50da30e2d1dd');

const getMatchWeatherDetails = (lat, long, date, cb) => {
    darksky
        .latitude(lat)
        .longitude(long)
        .time(date)
        .units('ca')
        .language('en')
        .exclude('minutely,daily')
        .extendHourly(true)
        .get()
        .then((data) => {
            cb(null, data)
        })
        .catch((err) => {
            cb(err, null)
        })
}

module.exports = {
    getMatchWeatherDetails: getMatchWeatherDetails
}