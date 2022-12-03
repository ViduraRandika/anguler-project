import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-project';

  constructor(private router: Router, private titleSevice: Title) {
    titleSevice.setTitle(this.title);
  }
}
