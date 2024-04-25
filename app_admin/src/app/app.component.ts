import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationService } from './services/authentication.service';
import { TripDataService } from './services/trip-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    TripListingComponent, 
    NavbarComponent
  ],
  providers: [AuthenticationService, TripDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Travlr Getaways Admin!';
}
