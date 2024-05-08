import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { INode } from '../home/home.component';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  // OnPush does not work because the nested elements within the input list change. 
  // To make OnPush work, the layout needs to be reduced immutably (eg. ngrx reducer)
})
export class LayoutComponent {
  @Input() layout: INode;
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, list: INode[] }>();
  @Output() remove = new EventEmitter<{ node: INode, list: INode[] }>();
  @Output() nodeSelected = new EventEmitter<{ node: INode, isRoot: boolean, list?: INode[] }>();

  onDragStart(event: DragEvent) { this.dragStart.emit(event); }

  onDragged(event: DragEvent, node: INode, list: INode[], effect: DropEffect) {
    this.dragMove.emit({ event, effect, node, list });
  }

  onDragEnd(event: DragEvent) { this.dragEnd.emit(event); }

  onDrop(event: DndDropEvent, list: INode[]) {
    this.drop.emit({ event, list });
  }

  onRemove(node: INode, list: INode[]) {
    this.remove.emit({ node, list });
  }

  onClickNode(event: MouseEvent, node: INode, isRoot: boolean, list?: INode[]) {
    this.nodeSelected.emit({ node, isRoot, list });
    event.stopPropagation();
    return false;
  }
}
