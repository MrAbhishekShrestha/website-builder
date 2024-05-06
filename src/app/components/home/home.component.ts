import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { Subject } from "rxjs";

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
export class HomeComponent implements OnDestroy {
  private currentDraggableEvent?: DragEvent;
  private currentDragEffectMsg?: string;
  private _selectedNode = new Subject<INode>();
  selectedNode$ = this._selectedNode.asObservable();

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

  onNodeSelected(node: INode) {
    this._selectedNode.next(node);
  }

  onNodeSave(payload: { oldNode: INode, newNode: INode }) {
    console.log('save!', payload.oldNode, payload.newNode);
  }

  ngOnDestroy(): void {
    this._selectedNode.complete();
  }
}