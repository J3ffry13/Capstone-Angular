import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
    selector: 'app-dashboard-report',
    templateUrl: './dashboard-report.component.html',
    styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent {

    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {
      series: [{
        data: [1, 2, 3],
        type: 'line'
      }]
    }
}
