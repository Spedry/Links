import {Component, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {ConfigService} from "../../../services/config.service";
import {NGXLogger} from "ngx-logger";
import {map} from "rxjs/operators";
import {Breakpoints, BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {WidgetComponent} from "../../widgets/widget/widget.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {AsyncPipe, NgSwitchDefault, NgSwitch, NgForOf, NgSwitchCase} from "@angular/common";
import {LinkListComponent} from "../../widgets/link-list/link-list.component";
import {Subscription} from "rxjs";
import {PageContent} from "../../../models/pageContent";
import {PageConfigService} from "../../../services/page-config.service";
import {AllWidget, PageWidgets} from "../../../models/pageWidgets";
import {CardLayout} from "../../../models/cardLayout";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    WidgetComponent,
    MatGridListModule,
    AsyncPipe,
    NgSwitchDefault,
    NgSwitch,
    NgForOf,
    NgSwitchCase,
    LinkListComponent,
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  pageWidgets?: PageWidgets;
  /*miniWidgets : AllWidget = {widgetType: "miniWidgets", widgets: []}
  mediumWidgets : AllWidget = {widgetType: "mediumWidgets", widgets: []}
  largeWidgets : AllWidget = {widgetType: "largeWidgets", widgets: []}*/

  constructor(private config: ConfigService,
              private log: NGXLogger,
              private pageConfig: PageConfigService,
              private breakpointObserver: BreakpointObserver) {
    /*config.getWidgets("miniWidgets").subscribe((widgets: Widgets) => {
      this.log.debug("Retrieved", widgets)
      if (widgets)
        this.miniWidgets = widgets;
    })
    config.getWidgets("mediumWidgets").subscribe((widgets: Widgets) => {
      this.log.debug("Retrieved", widgets)
      if (widgets)
        this.mediumWidgets = widgets;
    })
    config.getWidgets("largeWidgets").subscribe((widgets: Widgets) => {
      this.log.debug("Retrieved", widgets)
      if (widgets)
        this.largeWidgets = widgets;
    })*/
  }

  getWidgets(widgetType: string): AllWidget {
    const allWidgets = this.pageWidgets?.allWidgets.find(item => item.widgetType === widgetType);
    if (allWidgets) {
      return allWidgets
    }
    return {widgetType: widgetType, widgets: []};
  }

  ngOnInit(): void {
    this.subscription = this.pageConfig.selectedValue$.subscribe((value: PageContent) => {
      this.config.getConfig<PageWidgets[]>("pageWidgets").subscribe((pageWidgets: PageWidgets[]) => {
        this.log.debug("Subscription: ", pageWidgets)
        const pageContent: PageContent = value;
        this.log.debug("value.id: ", pageContent.viewValue)
        if (pageWidgets)
          this.pageWidgets = pageWidgets.find(item => item.id == pageContent.id);
      })
    });
     this.breakpointObserver.observe(Breakpoints.Handset).subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cardLayout = {
            columns: 1,
            miniCard: {cols: 1, rows: 1},
            mediumCard: {cols: 1, rows: 2},
            largeCard: {cols: 1, rows: 4}
          };
        } else {
          this.cardLayout = {
            columns: 6, // GRID COLUMNS
            miniCard: {cols: 1, rows: 1},
            mediumCard: {cols: 2, rows: 3},
            largeCard: {cols: 2, rows: 3}
          };
        }
      });
  }
  cardLayout?: CardLayout;
  /** Based on the screen size, switch from standard to one column per row */
  /*cardLayout = this.breakpointObserver.observe(Breakpoints.Web).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: {cols: 1, rows: 1},
          mediumCard: {cols: 1, rows: 2},
          largeCard: {cols: 1, rows: 4}
        };
      }

      return {
        columns: 6, // GRID COLUMNS
        miniCard: {cols: 1, rows: 1},
        mediumCard: {cols: 2, rows: 3},
        largeCard: {cols: 2, rows: 3}
      };
    })
  );*/

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}

