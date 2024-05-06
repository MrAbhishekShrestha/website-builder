import { Component, EventEmitter, Output } from '@angular/core';
import { INode } from '../home/home.component';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, list: INode[] }>();
  @Output() remove = new EventEmitter<{ node: INode, list: INode[] }>();

  layout: INode = {
    name: "Layout",
    type: "row",
    children: [
      { name: "Header", type: "widget", children: [] },
      {
        name: "Column", "type": "column", children: [
          { name: "Image", type: "widget", children: [] },
          { name: "Description", type: "widget", children: [] },
        ]
      },
      { name: "Footer", type: "widget", children: [] },
    ]
  };

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
}
