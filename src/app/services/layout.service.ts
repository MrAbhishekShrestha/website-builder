import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ILayout } from "../models/website-builder.models";

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private layoutSubject = new BehaviorSubject<ILayout>({
    name: "home",
    code: "home",
    description: "",
    type: "ROUTABLE",
    status: "ACTIVE"
  });
  layout$ = this.layoutSubject.asObservable();

  updateLayout(newLayout: ILayout) {
    this.layoutSubject.next(newLayout);
  }
}