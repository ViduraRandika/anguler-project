import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as L from 'leaflet';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-view-more-info',
  templateUrl: './view-more-info.component.html',
  styleUrls: ['./view-more-info.component.css'],
})
export class ViewMoreInfoComponent implements OnInit {
  key: any;
  report: any;
  location: any;

  private map: any;
  private myMarker: any;

  constructor(
    private route: ActivatedRoute,
    public service: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.key = params['key'];
    });

    this.service.getSelectedReportData(this.key).subscribe((res: any) => {
      this.report = res;

      this.service
        .getSelectedReportLocationData(this.report['data']['locationId'])
        .subscribe((res) => {
          this.location = res;

          console.log(this.report['data']);

          this.myMarker = L.marker(
            [this.location['data']['lat'], this.location['data']['lng']],
            {
              icon: L.icon({
                ...L.Icon.Default.prototype.options,
                iconUrl: 'marker-icon.png',
                shadowUrl: 'marker-shadow.png',
              }),
            }
          )
            .bindTooltip(`Location: ${this.location['data']['locationName']}`, {
              permanent: true,
              className: 'label',
            })
            .addTo(this.map);
          
          this.map.flyTo([
            this.location['data']['lat'],
            this.location['data']['lng'],
          ]);

          console.log(this.location);
        });
    });
  }

  getDateAndTime(unixTime: any) {
    let dateAndTime = new Date(unixTime * 1000);
    let dateTime =
      dateAndTime.toLocaleDateString() + ' ' + dateAndTime.toLocaleTimeString();
    return dateTime;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 5,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
