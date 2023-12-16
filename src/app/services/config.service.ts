import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: JSONObject = new JSONObject;

  constructor(private http: HttpClient,
              private log: NGXLogger,
              private router: Router) { }
  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      let request: any;

      request = this.http.get<Response>(this.router.url + environment.config);

      if (request) {
        request.pipe(map((response: Response) => {
            this.log.info("Config subscribe is", response);
            resolve(true);
            return response;
          }),
          catchError((err, caught) => {
            this.log.error("Error reading configuration file:", err, "\ncaught:", caught);
            reject(true);
            return new Observable<any>;
          })
        ).subscribe((conf: JSONObject) => {
          this.config = conf;
        });
      } else {
        this.log.error("Couldn't load configuration file");
        reject(true);
      }
     })
  }

  /*getWidgets(configuration: string): Observable<Widgets> {
    this.log.debug("Retrieving", configuration)
    return this.http.get<Widgets>("assets/config/"+configuration+".json")
  }*/

  /*getConfig(configuration: string): Observable<Object> {
    this.log.debug("Retrieving", configuration)
    return this.http.get<Object>("assets/config/"+configuration+".json")
  }*/

  getConfig<T>(configuration: string): Observable<T> {
    this.log.debug("Retrieving", configuration)
    return this.http.get<T>("assets/config/"+configuration+".json")
  }

  public getValue(key: string): string {
    this.log.debug("Returning config value of", key)
    return this.config[key].toString();
  }
}

class JSONObject {
  [x: string]: JSONValue;
}

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
