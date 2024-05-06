import { Component, EventEmitter, Output } from '@angular/core';
import { INode } from '../home/home.component';
import { DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-origin-list',
  templateUrl: './origin-list.component.html',
  styleUrls: ['./origin-list.component.scss']
})
export class OriginListComponent {
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();

  readonly originList: INode[] = [
    {
      name: "Row",
      type: "row",
      children: []
    },
    {
      name: "Column",
      type: "column",
      children: []
    },
    {
      name: "Widget",
      type: "widget",
      children: []
    }
  ];

  onDragStart(event: DragEvent) { this.dragStart.emit(event); }

  onDragged(event: DragEvent, node: INode, effect: DropEffect) {
    this.dragMove.emit({ event, effect, node });
  }

  onDragEnd(event: DragEvent) { this.dragEnd.emit(event); }
}
