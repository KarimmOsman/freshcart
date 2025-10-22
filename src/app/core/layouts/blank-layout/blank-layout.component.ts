import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-blank-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './blank-layout.component.html',
  styleUrls: ['./blank-layout.component.css'],
})
export class BlankLayoutComponent {}
