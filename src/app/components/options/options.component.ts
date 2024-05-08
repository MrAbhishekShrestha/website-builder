import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ILayout, INode } from "../../models/website-builder.models";
import { Observable } from "rxjs";

@Component({
  selector: "app-options",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  @Input() selectedNode$: Observable<INode>;
  @Input() root: INode;
  @Input() layout$: Observable<ILayout>;
  @Input() selectedNodeIsRoot = false;
  @Output() saveNode = new EventEmitter<{ oldNode: INode, newNode: INode, isRoot: boolean }>();
  @Output() saveLayout = new EventEmitter<ILayout>();
}