import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as L from 'leaflet';
var md5 = require('md5');

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private map: any;
  constructor(
    private router: Router,
    public service: ApiService,
    private fb: FormBuilder
  ) {}

  locations: [] = [];
  reports: Array<Data> = [];
  data: Array<Data> = [];
  myMarkers: any;
  counts: any;
  order: string = '';
  locationAsc: boolean = false;
  firstNameAsc: boolean = false;
  dateAndTimeAsc: boolean = false;
  statusAsc: boolean = false;
  modalKey: any;
  action: any;
  passwordFormData: any;

  submitPasswordForm = this.fb.group({
    password: [''],
  });

  ngOnInit(): void {
    this.submitPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });

    this.initFunction();
  }

  initFunction() {
    this.service.getLocations().subscribe((data: any) => {
      this.locations = data;
      let arr = new Array();

      this.service.getReports().subscribe((data: any) => {
        let tempArr: Array<Data> = [];

        data.forEach((element: any) => {
          const locationObj: any = this.locations.find(
            (o) => o['key'] === element.data['locationId']
          );

          const obj = {
            breed: element.data['breed'],
            dateAndTime: element.data['dateAndTime'],
            extraNotes: element.data['extraNotes'],
            firstName: element.data['firstName'],
            lastName: element.data['lastName'],
            locationId: element.data['locationId'],
            phoneNumber: element.data['phoneNumber'],
            pid: element.data['pid'],
            status: element.data['status'],
            key: element.key,
            locationName: locationObj.data['locationName'],
          };

          tempArr.push(obj);
        });

        this.reports = tempArr;

        const counts: { [x: string]: any } = { ['']: '' };
        console.log(this.reports);

        this.reports.forEach((element: any) => {
          counts[element.locationId] = (counts[element.locationId] || 0) + 1;
        });

        for (let key in counts) {
          const locationObj = this.locations.find((o) => o['key'] === key);
          if (locationObj) {
            console.log('location', locationObj['data']['lat']);
            L.marker([locationObj['data']['lat'], locationObj['data']['lng']])
              .bindPopup(
                `<div style="text-align:center;"><b> ${locationObj['data']['locationName']} </b><br/> ${counts[key]} pig(s) reported </div>`
              )
              .addTo(this.map);
          }
        }
      });

      this.myMarkers = arr;
    });
  }

  get password() {
    return this.submitPasswordForm.get('password');
  }

  displayStyle = 'none;';

  getDateAndTime(unixTime: any) {
    let dateAndTime = new Date(unixTime * 1000);
    let dateTime =
      dateAndTime.toLocaleDateString() + ' ' + dateAndTime.toLocaleTimeString();
    return dateTime;
  }

  viewMoreInfo(key: any) {
    this.router.navigate(['view-more-info'], { queryParams: { key: key } });
  }

  navigateToCreateReport() {
    this.router.navigate(['create-report']);
  }

  updateReport(key: any) {
    this.displayStyle = 'block';
    this.modalKey = key;
    this.action = 'update';
  }

  deleteReport(key: any) {
    this.displayStyle = 'block';
    this.modalKey = key;
    this.action = 'delete';
  }

  closeModal() {
    this.displayStyle = 'none';
  }

  submit(formData: any) {
    this.displayStyle = 'none';
    console.log(formData.password);
    console.log(this.modalKey);
    console.log(this.action);
    this.submitPasswordForm.reset();

    const hash = md5(formData.password);
    if (hash === '84892b91ef3bf9d216bbc6e88d74a77c') {
      if (this.action === 'delete') {
        this.service.deleteReport(this.modalKey).subscribe((res: any) => {
          this.initFunction();

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Report deleted successfullty',
          });
        });
      }

      if (this.action === 'update') {
        const obj: any = this.reports.find((o) => o['key'] === this.modalKey);

        let newObj = {
          key: this.modalKey,
          data: {
            breed: obj['breed'],
            dateAndTime: obj['dateAndTime'],
            extraNotes: obj['extraNotes'],
            firstName: obj['firstName'],
            lastName: obj['lastName'],
            locationId: obj['locationId'],
            locationName: obj['locationName'],
            phoneNumber: obj['phoneNumber'],
            pid: obj['pid'],
            status: 'RETRIEVED',
          },
        };
        this.service
          .updateReport(this.modalKey, newObj)
          .subscribe((res: any) => {
            this.initFunction();

            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: 'success',
              title: 'Status changed',
            });
          });
      }
    } else {
      Swal.fire({
        title: 'Error !',
        text: 'Incorrect password',
        icon: 'error',
      });
    }

    // if(formData.password)
  }
  sortTable(column: any) {
    if (column === 'locationName') {
      if (this.locationAsc) {
        this.reports.sort((a, b) => b[column].localeCompare(a[column]));
        this.locationAsc = false;
      } else {
        this.reports.sort((a, b) => a[column].localeCompare(b[column]));
        this.locationAsc = true;
      }
    }

    if (column === 'firstName') {
      if (this.firstNameAsc) {
        this.reports.sort((a, b) => b[column].localeCompare(a[column]));
        this.firstNameAsc = false;
      } else {
        this.reports.sort((a, b) => a[column].localeCompare(b[column]));
        this.firstNameAsc = true;
      }
    }

    if (column === 'status') {
      if (this.statusAsc) {
        this.reports.sort((a, b) => b[column].localeCompare(a[column]));
        this.statusAsc = false;
      } else {
        this.reports.sort((a, b) => a[column].localeCompare(b[column]));
        this.statusAsc = true;
      }
    }

    if (column === 'dateAndTime') {
      if (this.dateAndTimeAsc) {
        this.reports.sort(
          (a, b) => parseFloat(b[column]) - parseFloat(a[column])
        );
        this.dateAndTimeAsc = false;
      } else {
        this.reports.sort(
          (a, b) => parseFloat(a[column]) - parseFloat(b[column])
        );
        this.dateAndTimeAsc = true;
      }
    }
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
