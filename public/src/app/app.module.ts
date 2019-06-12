import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {CricketMatchComponent} from "./cricket-match/cricket-match.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HttpService} from "./shared/http.service";
import {FilterPipe} from './shared/filter.pipe';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/cricket-match',
        pathMatch: 'full'
    }, {
        path: 'cricket-match',
        loadChildren: './cricket-match/cricket-match.module#CricketMatchModule'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        // FilterPipe
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        RouterModule.forRoot(routes),
    ],
    providers: [HttpService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
