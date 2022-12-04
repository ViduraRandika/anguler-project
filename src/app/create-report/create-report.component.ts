import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css'],
})
export class CreateReportComponent implements OnInit {
  private initialValues: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    breed: string;
    pid: string;
    locationId: string;
    extraNotes: string;
  } = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    breed: '',
    pid: '',
    locationId: '',
    extraNotes: '',
  };

  private map: any;
  private myMarker: any;

  constructor(
    public service: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      let data = this.router.getCurrentNavigation()?.extras.state?.['data'];

      this.initialValues.firstName = data.firstName;
      this.initialValues.lastName = data.lastName;
      this.initialValues.phoneNumber = data.phoneNumber;
      this.initialValues.breed = data.breed;
      this.initialValues.pid = data.pid;
      this.initialValues.locationId = data.locationId;
      this.initialValues.extraNotes = data.extraNotes;
    }
  }

  locations: [] = [];

  createReportForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    breed: [''],
    pid: [''],
    locationId: [''],
    extraNotes: [''],
  });

  ngOnInit(): void {
    this.service.getLocations().subscribe((data: any) => {
      this.locations = data;
    });

    this.createReportForm = new FormGroup({
      firstName: new FormControl(this.initialValues.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(this.initialValues.lastName, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.initialValues.phoneNumber, [
        Validators.required,
      ]),
      breed: new FormControl(this.initialValues.breed, [Validators.required]),
      pid: new FormControl(this.initialValues.pid, [Validators.required]),
      locationId: new FormControl(this.initialValues.locationId, [
        Validators.required,
      ]),
      extraNotes: new FormControl(this.initialValues.extraNotes, [
        Validators.required,
      ]),
    });
  }

  get firstName(){
    return this.createReportForm.get("firstName")
  }

  get lastName(){
    return this.createReportForm.get("lastName")
  }

  get phoneNumber(){
    return this.createReportForm.get("phoneNumber")
  }

  get breed(){
    return this.createReportForm.get("breed")
  }

  get pid(){
    return this.createReportForm.get("pid")
  }

  get locationId(){
    return this.createReportForm.get("locationId")
  }

  get extraNotes(){
    return this.createReportForm.get("extraNotes")
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

  onChangeLocation() {
    const locationId = this.createReportForm.value.locationId;
    let location: any;
    this.locations.forEach((element) => {
      if (element['key'] === locationId) {
        location = element;
        return;
      }
    });

    if (this.myMarker) {
      this.map.removeLayer(this.myMarker);
    }

    this.myMarker = L.marker([location.data.lat, location.data.lng], {
      icon: L.icon({
        ...L.Icon.Default.prototype.options,
        iconUrl: 'marker-icon.png',
        shadowUrl: 'marker-shadow.png',
      }),
    }).addTo(this.map);

    this.map.flyTo([location.data.lat, location.data.lng]);
  }

  submit(formData: any) {
    
    this.service.postCreatePigReport(formData).subscribe((res: any) => {
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
          title: 'Report added successfullty',
        });
        
        this.router.navigate(['']);

      } else {
        Toast.fire({
          icon: 'error',
          title: 'Something went wrong !. Please try again',
        });
      }
    });
  }

  goToAddLocationPage() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: this.createReportForm.value,
      },
    };

    this.router.navigate(['add-location'], navigationExtras);
  }
}
