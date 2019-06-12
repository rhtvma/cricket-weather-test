import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HttpService} from "../shared/http.service";
import {CricketMatchComponent} from './cricket-match.component';
import {FilterPipe} from '../shared/filter.pipe';

const routes: Routes = [
    {
        path: '',
        component: CricketMatchComponent,
        children: []
    }, {
        path: 'cricket-match',
        component: CricketMatchComponent,
        children: []
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        DataTablesModule,
        RouterModule.forChild(routes),
    ],
    providers: [HttpService],
    declarations: [CricketMatchComponent, FilterPipe]
})
export class CricketMatchModule {
}
