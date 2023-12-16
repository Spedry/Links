import {Component, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ConfigService} from "../../../services/config.service";
import {NGXLogger} from "ngx-logger";
import {PageConfigService} from "../../../services/page-config.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {PageContent} from "../../../models/pageContent";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  pageContents: PageContent[] = [];
  pageContent?: PageContent
  iconName = "Icon"

  constructor(private pageConfig: PageConfigService,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private config: ConfigService,
              private log: NGXLogger) {
  }

  onSelectionChange(): void {
    if (this.pageContent) {
      this.log.debug("onSelectionChange:", this.pageContent)
      this.pageConfig.setSelectedValue(this.pageContent)
      localStorage.setItem('pageContent', JSON.stringify(this.pageContent));
      this.savePageContentToMem();
    }
  }

  ngOnInit(): void {
    const iconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon.svg');
    this.iconRegistry.addSvgIcon(
      this.iconName,
      iconUrl
    )
    this.getPageContent()
  }

  getPageContent() {
    this.config.getConfig<PageContent[]>("pageContents").subscribe((obj: PageContent[]) => {
      this.log.debug("Retrieved", obj)
      if (obj) {
        obj.sort((a, b) => b.id.localeCompare(a.id));
        this.pageContents = <PageContent[]>obj;
        this.getPageContentFromMem();
        this.onSelectionChange();
      }
    })
  }
  savePageContentToMem() {
    if (this.pageContent) {
      localStorage.setItem('pageContentId', JSON.stringify(this.pageContent.id));
    }
  }
  getPageContentFromMem(): void {
    const storedDataString: string | null = localStorage.getItem('pageContentId');
    if (storedDataString) {
      this.log.debug("Returning locally stored pageContentId", storedDataString);
      this.pageContent = this.pageContents.find(item => item.id === JSON.parse(storedDataString));
    }
    this.log.trace("Local storage didn't contain pageContent");
  }

  trackByFn(index: number, item: any): string {
    return item.id; // Use a unique identifier for tracking, in this case, item.id
  }
}
