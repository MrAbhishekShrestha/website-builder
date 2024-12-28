import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { IFileNode } from "src/app/models/fs.model";

@Component({
  selector: "app-fs-options",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class FilesystemOptionsComponent {
  @Input() selectedNode$: Observable<IFileNode>;
  @Input() root: IFileNode;
  @Input() selectedNodeIsRoot = false;
  @Output() saveNode = new EventEmitter<{ oldNode: IFileNode, newNode: IFileNode, isRoot: boolean }>();
}