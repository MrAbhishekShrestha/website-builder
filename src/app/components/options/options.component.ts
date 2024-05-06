import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { INode } from "../home/home.component";
import { Observable } from "rxjs";
import { OnInit } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs";
import { filter } from "rxjs";
import { tap } from "rxjs";

@Component({
  selector: "app-options",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit, OnDestroy {
  @Input() selectedNode$: Observable<INode>;
  @Output() save = new EventEmitter<{ oldNode: INode, newNode: INode }>();

  selectedNodeFinal$: Observable<INode>;
  destroy$ = new Subject<void>();
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    ntype: new FormControl(null, Validators.required),
    childrenCount: new FormControl(0),
  })

  ngOnInit(): void {
    this.selectedNodeFinal$ = this.selectedNode$?.pipe(
      takeUntil(this.destroy$),
      filter(node => !!node),
      tap(node => {
        this.form.patchValue({
          name: node.name,
          ntype: node.type,
          childrenCount: node.children.length ?? 0,
        })
      })
    )
  }

  // TODO: Need to pass in the list as well as the old node 
  onSave(node: INode) {
    const newNode = {
      ...node,
      name: this.form.value?.name,
      type: this.form.value?.ntype,
    }
    this.save.emit({
      oldNode: node,
      newNode: newNode
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}