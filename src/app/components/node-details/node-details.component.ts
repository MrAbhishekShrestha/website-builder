import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, debounceTime, distinctUntilChanged, filter, skip } from "rxjs";
import { OnInit } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs";
import { tap } from "rxjs";
import { INode } from "src/app/models/website-builder.models";
import { WIDGET_ID_LIST } from "src/app/models/website-builder.constants";

@Component({
  selector: "app-node-details",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./node-details.component.html",
  styleUrls: ["./node-details.component.scss"],
})
export class NodeDetailsComponent implements OnInit, OnDestroy {
  @Input() selectedNode$: Observable<INode>;
  @Input() selectedNodeIsRoot = false;
  @Output() save = new EventEmitter<{ oldNode: INode, newNode: INode, isRoot: boolean }>();

  WIDGET_ID_LIST = WIDGET_ID_LIST;
  selectedNodeFinal$: Observable<INode>;
  destroy$ = new Subject<void>();
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    ntype: new FormControl(null, Validators.required),
    childrenCount: new FormControl(0),
    description: new FormControl(),
    widgetId: new FormControl(),
  })

  ngOnInit(): void {
    this.selectedNodeFinal$ = this.selectedNode$?.pipe(
      takeUntil(this.destroy$),
      tap(node => {
        if (node) {
          this.form.patchValue({
            name: node.name,
            ntype: node.type,
            childrenCount: node.children.length ?? 0,
            description: node?.description ?? null,
            widgetId: node?.widgetId ?? null,
          })
        }
      })
    )
  }

  onSave(node: INode) {
    const newNode = {
      ...node,
      name: this.form.value?.name,
      type: this.form.value?.ntype,
      description: this.form.value?.description,
      widgetId: this.form.value?.widgetId,
    }
    this.save.emit({
      oldNode: node,
      newNode: newNode,
      isRoot: this.selectedNodeIsRoot
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}