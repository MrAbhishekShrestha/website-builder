import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { IFileNode } from 'src/app/models/fs.model';

/* 
* OnPush does not work because the nested elements within the input list change. 
* To make OnPush work, the layout needs to be reduced immutably (eg. ngrx reducer)
*/
@Component({
  selector: 'app-fs-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FileSystemLayoutComponent {
  @Input() root: IFileNode;
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: IFileNode, list?: IFileNode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, list: IFileNode[] }>();
  @Output() remove = new EventEmitter<{ node: IFileNode, list: IFileNode[] }>();
  @Output() nodeSelected = new EventEmitter<{ node: IFileNode, isRoot: boolean, list?: IFileNode[] }>();

  onDragStart(event: DragEvent) { this.dragStart.emit(event); }

  onDragged(event: DragEvent, node: IFileNode, list: IFileNode[], effect: DropEffect) {
    this.dragMove.emit({ event, effect, node, list });
  }

  onDragEnd(event: DragEvent) { this.dragEnd.emit(event); }

  onDrop(event: DndDropEvent, list: IFileNode[]) {
    this.drop.emit({ event, list });
  }

  onRemove(node: IFileNode, list: IFileNode[]) {
    this.remove.emit({ node, list });
  }

  onClickNode(event: MouseEvent, node: IFileNode, isRoot: boolean, list?: IFileNode[]) {
    this.nodeSelected.emit({ node, isRoot, list });
    event.stopPropagation();
    return false;
  }

  toggleExpansion(node: IFileNode) {
    node.expanded = !node.expanded;
  }
}
