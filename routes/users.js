var express = require('express');
var router = express.Router();
var cricket = require("../services/cricket");
var weather = require("../services/weather");

/* GET ALL WC matches listing. */
router.post('/eng-weather', function (req, res, next) {
    const {date, lat, long, location, name} = req.body;
    weather.getMatchWeatherDetails(lat, long, date, (err, result) => {
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
