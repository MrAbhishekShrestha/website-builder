import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { Subject } from "rxjs";

export interface INode {
  name: string;
  type: "row" | "column" | "widget",
  children: INode[],
  selected: boolean,
  description?: string,
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
  private selectedList: INode[];
  selectedNode$ = this._selectedNode.asObservable();
  lastSelectedNode: INode;

  layout: INode = {
    name: "Layout",
    type: "row",
    selected: false,
    children: [
      { name: "Header", type: "widget", selected: false, description: "first", children: [], },
      {
        name: "Column", "type": "column", selected: false, children: [
          { name: "Image", type: "widget", selected: false, children: [], },
          { name: "Description", type: "widget", selected: false, children: [], },
        ],
      },
      { name: "Footer", type: "widget", selected: false, children: [], },
    ]
  };

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;
  }

  onDragged(payload: { event: DragEvent, effect: DropEffect, node: INode, list?: INode[] }) {
    this.currentDragEffectMsg = `Drag ended with effect "${payload.effect}"!`;
    if (payload.effect === 'move' && payload.list) {
      const index = this.findNodeIndexInList(payload.node, payload.list);
      if (index >= 0) payload.list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
  }

  onDrop(payload: { event: DndDropEvent, list?: INode[] }) {
    if (payload.list && (payload.event.dropEffect === 'copy' || payload.event.dropEffect === 'move')) {
      let index = payload.event.index;
      if (typeof index === 'undefined') index = payload.list.length;
      if (index >= 0) payload.list.splice(index, 0, payload.event.data);
    }
  }

  onRemove(payload: { node: INode, list: INode[] }) {
    if (this.lastSelectedNode && this.lastSelectedNode == payload.node) this.lastSelectedNode = null;
    const index = this.findNodeIndexInList(payload.node, payload.list);
    if (index >= 0) payload.list.splice(index, 1);
  }

  onNodeSelected(payload: { node: INode, list: INode[] }) {
    if (this.lastSelectedNode) this.lastSelectedNode.selected = false;
    payload.node.selected = true;
    this.lastSelectedNode = payload.node;
    this._selectedNode.next(payload.node);
    this.selectedList = payload.list;
  }

  onNodeSave(payload: { oldNode: INode, newNode: INode }) {
    const index = this.findNodeIndexInList(payload.oldNode, this.selectedList);
    if (index >= 0) this.selectedList[index] = payload.newNode;
    this.onNodeSelected({ node: payload.newNode, list: this.selectedList });
  }

  findNodeIndexInList(node: INode, list: INode[]): number {
    return list.indexOf(node)
  }

  ngOnDestroy(): void {
    this._selectedNode.complete();
  }

}