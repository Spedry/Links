import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, ReplaySubject, Subject, Subscription} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {PageContent} from "../models/pageContent";

@Injectable({
  providedIn: 'root'
})
export class PageConfigService {
  private selectedValueSubject = new Subject<PageContent>(); // Initial value is an empty string
  selectedValue$ = this.selectedValueSubject.asObservable();

  constructor(private log: NGXLogger) {
  }

  setSelectedValue(value: PageContent): void {
    this.log.debug("setSelectedValue:", value)
    this.selectedValueSubject.next(value);
  }
}
