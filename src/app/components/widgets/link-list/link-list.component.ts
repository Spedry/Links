import {Component, Input} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {Links} from "../../../models/links";
import {ConfigService} from "../../../services/config.service";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-link-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgForOf
  ],
  templateUrl: './link-list.component.html',
  styleUrl: './link-list.component.scss'
})
export class LinkListComponent {
  @Input() content?: string;
  links: Links = {id: "", links: []};


  constructor(private config: ConfigService,
              private log: NGXLogger) {
    config.getConfig<Links[]>("links").subscribe((links: Links[]) => {
      if (links) {
        this.log.debug("Retrieved", links)
        this.links = <Links>links.find(item => item.id === this.content);
      }
    })
  }

}
