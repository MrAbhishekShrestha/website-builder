import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { INode } from '../home/home.component';
import { DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-origin-list',
  templateUrl: './origin-list.component.html',
  styleUrls: ['./origin-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OriginListComponent {
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();

  readonly originList: INode[] = [
    {
      name: "Row",
      type: "row",
      selected: false,
      children: []
    },
    {
      name: "Column",
      type: "column",
      selected: false,
      children: []
    },
    {
      name: "Widget",
      type: "widget",
      selected: false,
      children: []
    }
  ];

  onDragStart(event: DragEvent) { this.dragStart.emit(event); }

  onDragged(event: DragEvent, node: INode, effect: DropEffect) {
    this.dragMove.emit({ event, effect, node });
  }

  onDragEnd(event: DragEvent) { this.dragEnd.emit(event); }
}
