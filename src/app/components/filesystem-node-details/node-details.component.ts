import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, debounceTime, distinctUntilChanged, filter, skip } from "rxjs";
import { OnInit } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs";
import { tap } from "rxjs";
import { IFileNode } from "src/app/models/fs.model";

@Component({
  selector: "app-fs-node-details",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./node-details.component.html",
  styleUrls: ["./node-details.component.scss"],
})
export class FileSystemNodeDetailsComponent implements OnInit, OnDestroy {
  @Input() selectedNode$: Observable<IFileNode>;
  @Input() selectedNodeIsRoot = false;
  @Output() save = new EventEmitter<{ oldNode: IFileNode, newNode: IFileNode, isRoot: boolean }>();

  selectedNodeFinal$: Observable<IFileNode>;
  destroy$ = new Subject<void>();
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    ntype: new FormControl(null, Validators.required),
    childrenCount: new FormControl(0),
  })

  ngOnInit(): void {
    this.selectedNodeFinal$ = this.selectedNode$?.pipe(
      takeUntil(this.destroy$),
      tap(node => {
        if (node) {
          this.form.patchValue({
            name: node.name,
            ntype: node.type,
            childrenCount: node.children.length ?? 0
          })
        }
      })
    )
  }

  onSave(node: IFileNode) {
    const newNode = {
      ...node,
      name: this.form.value?.name,
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