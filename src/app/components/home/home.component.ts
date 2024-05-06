import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";

export interface INode {
  name: string;
  type: "row" | "column" | "widget",
  children: INode[]
}

@Component({
  selector: "app-home",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private currentDraggableEvent?: DragEvent;
  private currentDragEffectMsg?: string;

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;
  }

  onDragged(payload: { event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }) {
    this.currentDragEffectMsg = `Drag ended with effect "${payload.effect}"!`;
    if (payload.effect === 'move' && payload.list) {
      const index = payload.list.indexOf(payload.node);
      payload.list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
    console.log(this.currentDragEffectMsg ?? "Drag ended!");
  }

  onDrop(payload: { event: DndDropEvent, list?: INode[] }) {
    console.log('onDrop: ', payload);
    if (payload.list && (payload.event.dropEffect === 'copy' || payload.event.dropEffect === 'move')) {
      let index = payload.event.index;

      if (typeof index === 'undefined') {
        index = payload.list.length;
      }

      payload.list.splice(index, 0, payload.event.data);
    }
  }

  onRemove(payload: { node: INode, list: INode[] }) {
    const index = payload.list.indexOf(payload.node);
    payload.list.splice(index, 1)
  }
}