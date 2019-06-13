const express = require('express'),
    moment = require('moment-timezone'),
    router = express.Router();
let cricket = require("../services/cricket"),
    weather = require("../services/weather");

function toTimeZone(time, zone) {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment(time, format).tz(zone).format(format);
}


/* GET ALL WC matches listing. */
router.post('/eng-weather', function (req, res, next) {
    const {date, lat, long, location, name} = req.body;

    const convertedDate = toTimeZone(date, "Europe/London")

    weather.getMatchWeatherDetails(lat, long, convertedDate, (err, result) => {
        return res.status(200)
            .json({
                status: 1,
                msg: "Success",
                data: result || err
            });
    })
});


router.get('/wc-matches', function (req, res, next) {
    cricket.getWCMatches().then((matches) => {
        return res.status(200).json({
            status: 1,
            msg: "Success",
            data: matches
        });
    }).catch(function (err) {
        res.status(200).json({
            data: [],
            msg: err.message || "Code error",
            status: 3
        });
    })
});

module.exports = router;
