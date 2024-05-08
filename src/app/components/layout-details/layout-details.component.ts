import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { ILayout } from "src/app/models/website-builder.models";

@Component({
  selector: 'app-layout-details',
  templateUrl: './layout-details.component.html',
  styleUrls: ['./layout-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDetailsComponent implements OnInit, OnDestroy {
  @Input() layout$: Observable<ILayout>;
  @Output() save = new EventEmitter<ILayout>();

  layoutFinal$: Observable<ILayout>;
  destroy$ = new Subject<void>();
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    code: new FormControl(null, Validators.required),
    description: new FormControl(),
    type: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  ngOnInit(): void {
    this.layoutFinal$ = this.layout$.pipe(
      takeUntil(this.destroy$),
      tap(layout => {
        if (layout) {
          this.form.patchValue({
            name: layout.name,
            code: layout.code,
            description: layout?.description,
            type: layout.type,
            status: layout.status
          });
        }
      })
    )
  }

  onSave() { return { ...this.form.value } as ILayout; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}