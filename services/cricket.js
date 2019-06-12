const rp = require('request-promise');
const cheerio = require('cheerio');
var Promise = require('bluebird');
const _ = require('lodash')

function getMatchDetails(id, date, numericDate) {
    try {
        return rp.get('http://mapps.cricbuzz.com/cbzios/match/' + id)
            .then(function (matchInfo) {
                matchInfo = JSON.parse(matchInfo);
                if (matchInfo.match_id) {
                    const output = {
                        match_id: matchInfo.match_id,
                        date: date,
                        numericDate: numericDate,
                        series_id: matchInfo.series_id,
                        series_name: matchInfo.series_name,
                        teams: {
                            team1: {name: matchInfo.team1.name, s_name: matchInfo.team1.s_name},
                            team2: {name: matchInfo.team2.name, s_name: matchInfo.team2.s_name}
                        },
                        match_info: {
                            start_time: matchInfo.header.start_time,
                            end_time: matchInfo.header.end_time,
                            status: matchInfo.header.status
                        },
                        venue: {
                            name: matchInfo.venue.name,
                            location: matchInfo.venue.location,
                            timezone: matchInfo.venue.timezone,
                            lat: matchInfo.venue.lat,
                            long: matchInfo.venue.long,
                        }
                    };
                    return output;
                }
                throw new Error('No match found');
            });
    } catch (e) {
        throw e;
    }
}


function getWCMatches() {
    return rp.get('https://www.cricbuzz.com/cricket-series/2697/icc-cricket-world-cup-2019/matches')
        .then(function (cricbuzzHome) {
            const home = cheerio.load(cricbuzzHome);
            return getWCMatchesId(home);
        })
        .then(function (liveMatchIds) {
            if (liveMatchIds.length) {
                const promises = []
                liveMatchIds.forEach((matchId) => {
                    promises.push(getMatchDetails(matchId.link, new Date(parseInt(matchId.date)), matchId.date));
                });
                return Promise.all(promises);
            }
            return [];
        });
}

function getWCMatchesId($) {
    const d1 = $('#series-matches').children();
    let data = d1.splice(5);
    // const data = daa.pop();
    const links = [];

    Object.keys(data).forEach(function (key) {
        let mmDate = 0;
        if (data[key].name === 'div') {
            if (typeof data[key].children[0].children !== 'undefined') {
                if (typeof data[key].children[0].children[0].attribs !== 'undefined') {
                    const mDate = data[key].children[0].children[0].attribs["ng-bind"];
                    mmDate = mDate.split('|');
                } else {
                    if (typeof data[key - 1].children[0].children[0].attribs !== 'undefined') {
                        const mDate = data[key - 1].children[0].children[0].attribs["ng-bind"];
                        mmDate = mDate.split('|');
                    }
                }
            }
            if (typeof data[key].children[2].children !== 'undefined') {
                if (typeof data[key].children[2].children[0].children !== 'undefined') {
                    const link = data[key].children[2].children[0].children[2].attribs.href;
                    const linkArray = link.split('/');
                    links.push({link: linkArray[2], date: mmDate[0]});
                }
            }
        }
    });
    return links;
}

module.exports = {
    getWCMatches: function () {
        return getWCMatches();
    }
}