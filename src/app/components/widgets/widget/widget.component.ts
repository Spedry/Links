import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-card',
  templateUrl: './widget.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  @Input() title?: string;
}
