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
  isLastSelectedNodeRoot = false;

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
      payload.list.splice(index, 0, payload.event.data);
      this.clearSelection();
      this.onNodeSelected({ node: payload.event.data as INode, isRoot: false, list: payload.list });
    }
  }

  onRemove(payload: { node: INode, list: INode[] }) {
    const index = this.findNodeIndexInList(payload.node, payload.list);
    if (index >= 0) payload.list.splice(index, 1);
    this.clearSelection();
  }

  onNodeSelected(payload: { node: INode, isRoot: boolean, list?: INode[] }) {
    if (this.lastSelectedNode) this.lastSelectedNode.selected = false;
    payload.node.selected = true;
    this.lastSelectedNode = payload.node;
    this._selectedNode.next(payload.node);
    this.isLastSelectedNodeRoot = payload.isRoot;
    this.selectedList = payload.list;
  }

  onNodeSave(payload: { oldNode: INode, newNode: INode, isRoot: boolean }) {
    if (payload.isRoot) {
      this.layout = payload.newNode;
    } else {
      const index = this.findNodeIndexInList(payload.oldNode, this.selectedList);
      if (index >= 0) this.selectedList[index] = payload.newNode;
    }
    this.onNodeSelected({ node: payload.newNode, isRoot: payload.isRoot, list: this.selectedList });
  }

  findNodeIndexInList(node: INode, list: INode[]): number {
    return list.indexOf(node)
  }

  /** when the user performs any Drag and Drop event, the lastSelectedNode object is no longer part of this.layout. So run this function to clean up any unwanted state that may persist */
  clearSelection() {
    this.lastSelectedNode = null;
    this.selectedList = null;
    this._selectedNode.next(null);
    this.unselectAllFromTree(this.layout);
  }

  /** depth first search recursive tree traversal to unselect all nodes */
  unselectAllFromTree(tree: INode) {
    tree.selected = false;
    tree.children.forEach(child => this.unselectAllFromTree(child));
  }

  ngOnDestroy(): void {
    this._selectedNode.complete();
  }
}