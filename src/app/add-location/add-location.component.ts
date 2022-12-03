import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  private map: any;
  private myMarker: any;
  private extras: any;

  constructor(
    private router: Router,
    public service: ApiService,
    private fb: FormBuilder
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.extras = this.router.getCurrentNavigation()?.extras.state?.['data'];
    }
  }

  addLocationForm = this.fb.group({
    locationName: [''],
  });

  ngOnInit(): void {
    this.addLocationForm = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
    });
  }

  get locationName() {
    return this.addLocationForm.get('locationName');
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

    this.map.on('click', (e: any) => {
      if (this.myMarker) {
        this.map.removeLayer(this.myMarker);
      }

      this.myMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
    });
  }

  submit(formData: any) {
    if (!this.myMarker) {
      Swal.fire({
        title: 'Error !',
        text: 'Please select a location on the map.',
        icon: 'error',
      });
    } else {
      const data = {
        locationName: formData.locationName,
        lat: this.myMarker._latlng.lat,
        lng: this.myMarker._latlng.lng,
      };

      this.service.postLocation(data).subscribe((res: any) => {
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

        if (res) {
          Toast.fire({
            icon: 'success',
            title: 'Location added successfullty',
          });
          
          if (this.extras) {
            const navigationExtras: NavigationExtras = {
              state: {
                data: this.extras,
              },
            };

            this.router.navigate(['create-report'], navigationExtras);
          } else {
            this.router.navigate(['create-report']);
          }
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Something went wrong !. Please try again',
          });
        }
      });
    }
  }
}
