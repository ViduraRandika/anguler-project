import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postCreatePigReport(formData: any) {
    const pigReportsUrl =
      'https://272.selfip.net/apps/wSydF7O5LC/collections/reports/documents/';

    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      breed: formData.breed,
      pid: formData.pid,
      locationId: formData.locationId,
      extraNotes: formData.extraNotes,
      dateAndTime: unixTime,
      status: 'READY FOR PICKUP',
    };

    const key = uuidv4();

    const body = {
      key: key,
      data: data,
    };

    return this.http
      .post(pigReportsUrl, body, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  deleteReport(key: any) {
    const pigReportsUrl = `https://272.selfip.net/apps/wSydF7O5LC/collections/reports/documents/${key}/`;

    console.log(key);
    
    return this.http
      .delete(pigReportsUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }
  
  updateReport(key: any, data:any) {
    const pigReportsUrl = `https://272.selfip.net/apps/wSydF7O5LC/collections/reports/documents/${key}/`;

    console.log(data);
    
    return this.http
      .put(pigReportsUrl,data, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  getReports() {
    const reportsGetUrl =
      'https://272.selfip.net/apps/wSydF7O5LC/collections/reports/documents/';

    return this.http
      .get(reportsGetUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  getSelectedReportData(key: any) {
    const reportsGetUrl = `https://272.selfip.net/apps/wSydF7O5LC/collections/reports/documents/${key}/`;

    return this.http
      .get(reportsGetUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  getSelectedReportLocationData(key: any) {
    const placesGetUrl = `https://272.selfip.net/apps/wSydF7O5LC/collections/places/documents/${key}/`;

    return this.http
      .get(placesGetUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  postLocation(data: any) {
    const placesPostUrl =
      'https://272.selfip.net/apps/wSydF7O5LC/collections/places/documents/';

    const key = uuidv4();
    const body = {
      key: key,
      data: {
        locationName: data.locationName,
        lat: data.lat,
        lng: data.lng,
      },
    };

    return this.http
      .post(placesPostUrl, body, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  getLocations() {
    const placesGetUrl =
      'https://272.selfip.net/apps/wSydF7O5LC/collections/places/documents/';

    return this.http
      .get(placesGetUrl, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Something went wront. Please try again.`;
    }

    Swal.fire({
      title: 'Error !',
      text: errorMessage,
      icon: 'error',
    });

    return throwError(() => {
      return errorMessage;
    });
  }
}
