import {Component, OnInit} from '@angular/core';
import {HttpService} from "../shared/http.service";
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-cricket-match',
    templateUrl: './cricket-match.component.html',
    styleUrls: ['./cricket-match.component.css'],
    providers: [HttpService]
})
export class CricketMatchComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    wcOriginalData: Array<any> = [];
    weatherData: Array<any> = [];
    wcData: Array<any> = [];
    dtTrigger: Subject<any> = new Subject();
    rainProbability: number = 0;
    model = {team1: '', team2: ''};

    countries: Array<any> = ['India', 'Pakistan', 'England', 'New Zealand', 'Australia', 'Sri Lanka', 'West Indies', 'Bangladesh', 'South Africa', 'Afghanistan'];

    constructor(private _httpService: HttpService, private _toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10, searching: false,
            autoWidth: true,
            // order: [[3, 'asc']]
        };
        this.getRecentSiteList();
    }


    getRecentSiteList() {
        this._httpService.get(`/api/wc-matches`)
            .subscribe(
                (result: { data: Array<any>, msg: any, status: number }) => {
                    if (result.status === 1) {
                        this.wcOriginalData = result.data;
                        this.wcData = this.wcOriginalData;
                        this.dtTrigger.next();
                    } else {
                        console.log(result.msg);
                    }
                },
                (error) => {
                }
            );
    }

    onChange(val1, val2) {
    }

    onFilter() {
        const mteam1 = this.model['team1'].toLowerCase();
        const mteam2 = this.model['team2'].toLowerCase();
        this.wcData = this.wcOriginalData.filter((val, x) => {
            let team1 = val.teams.team1.name,
                team2 = val.teams.team2.name;
            team1 = team1.toLowerCase();
            team2 = team2.toLowerCase();
            return ((team1 === mteam1) && (team2 === mteam2)) || ((team1 === mteam2) && (team2 === mteam1));
        });
    }

    verifyWeather(args) {
        const body = {
            date: args.date,
            lat: args.venue.lat,
            long: args.venue.long,
            location: args.venue.location,
            name: args.venue.name
        };
        let team1 = this.model.team1, team2 = this.model.team2;
        if (team1.length < 1 || team2.length < 1) {
            team1 = args.teams.team1.name;
            team2 = args.teams.team2.name;
        }
        this._httpService.post(`/api/eng-weather`, body)
            .subscribe(
                (result: { data: Array<any>, msg: any, status: number }) => {
                    if (result.status === 1) {
                        this.weatherData = result.data;
                        if (typeof this.weatherData['currently'] !== 'undefined') {
                            const currently = this.weatherData['currently'];
                            if (typeof currently.precipProbability === 'undefined') {
                                this.rainProbability = 0;
                            } else {
                                this.rainProbability = currently.precipProbability;
                            }

                            if (this.rainProbability < 0.2) {
                                this._toastr.info(`Summary : ${currently.summary}`, `${team1} VS ${team2}`);
                                this._toastr.success('Weather conditions are good, you can buy tickets', `${team1} VS ${team2}`);
                            } else {
                                this._toastr.info(`Summary : ${currently.summary}`, `${team1} VS ${team2}`);
                                this._toastr.error(`Weather conditions are not good, Don't buy tickets`, `${team1} VS ${team2}`);
                            }
                            const beliver = {
                                precipType: currently.precipType,
                                precipIntensity: currently.precipIntensity,
                                precipProbability: currently.precipProbability,
                                summary: currently.summary,
                            };
                            console.log(beliver);
                        }
                    } else {
                        console.log(result.msg);
                    }
                },
                (error) => {
                    console.log(error)
                }
            );
    }
}
