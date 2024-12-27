import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { Subject } from "rxjs";
import { IFileNode } from "src/app/models/fs.model";
import { WIDGET_ID } from "src/app/models/website-builder.constants";

@Component({
  selector: "app-filesystem",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filesystem.component.html',
  styleUrls: ['./filesystem.component.scss']
})
export class FileSystemComponent {
  private currentDraggableEvent?: DragEvent;
  private currentDragEffectMsg?: string;
  private _selectedNode = new Subject<IFileNode>();
  private selectedList: IFileNode[];
  selectedNode$ = this._selectedNode.asObservable();
  lastSelectedNode: IFileNode;
  isLastSelectedNodeRoot = false;

  root: IFileNode = {
    name: "Root",
    type: "folder",
    selected: false,
    expanded: true,
    data: null,
    children: [
      { name: "Organization", type: "applet", selected: false, data: null, expanded: false, children: [], },
      {
        name: "Sales", "type": "folder", selected: false, data: null, expanded: true, children: [
          { name: "Sales Order", type: "applet", selected: false, data: null, expanded: false, children: [], },
          { name: "Sales Invoice", type: "applet", selected: false, data: null, expanded: false, children: [], },
        ],
      },
      { name: "CP COM", type: "folder", selected: false, data: null, expanded: false, children: [
        { name: "CP COM Admin", type: "applet", selected: false, data: null, expanded: false, children: [], },
        { name: "Content Management System", type: "applet", selected: false, data: null, expanded: false, children: [], },
      ]},
    ]
  };

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;
  }

  onDragged(payload: { event: DragEvent, effect: DropEffect, node: IFileNode, list?: IFileNode[] }) {
    this.currentDragEffectMsg = `Drag ended with effect "${payload.effect}"!`;
    if (payload.effect === 'move' && payload.list) {
      const index = this.findNodeIndexInList(payload.node, payload.list);
      if (index >= 0) payload.list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
  }

  onDrop(payload: { event: DndDropEvent, list?: IFileNode[] }) {
    if (payload.list && (payload.event.dropEffect === 'copy' || payload.event.dropEffect === 'move')) {
      let index = payload.event.index;
      if (typeof index === 'undefined') index = payload.list.length;
      payload.list.splice(index, 0, payload.event.data);
      this.clearSelection();
      this.onNodeSelected({ node: payload.event.data as IFileNode, isRoot: false, list: payload.list });
    }
  }

  onRemove(payload: { node: IFileNode, list: IFileNode[] }) {
    const index = this.findNodeIndexInList(payload.node, payload.list);
    if (index >= 0) payload.list.splice(index, 1);
    this.clearSelection();
  }

  onNodeSelected(payload: { node: IFileNode, isRoot: boolean, list?: IFileNode[] }) {
    if (this.lastSelectedNode) this.lastSelectedNode.selected = false;
    payload.node.selected = true;
    this.lastSelectedNode = payload.node;
    this._selectedNode.next(payload.node);
    this.isLastSelectedNodeRoot = payload.isRoot;
    this.selectedList = payload.list;
  }

  onNodeSave(payload: { oldNode: IFileNode, newNode: IFileNode, isRoot: boolean }) {
    if (payload.isRoot) {
      this.root = payload.newNode;
    } else {
      const index = this.findNodeIndexInList(payload.oldNode, this.selectedList);
      if (index >= 0) this.selectedList[index] = payload.newNode;
    }
    this.onNodeSelected({ node: payload.newNode, isRoot: payload.isRoot, list: this.selectedList });
  }

  findNodeIndexInList(node: IFileNode, list: IFileNode[]): number {
    return list.indexOf(node)
  }

  /** when the user performs any Drag and Drop event, the lastSelectedNode object is no longer part of this.layout. So run this function to clean up any unwanted state that may persist */
  clearSelection() {
    this.lastSelectedNode = null;
    this.selectedList = null;
    this._selectedNode.next(null);
    this.unselectAllFromTree(this.root);
  }

  /** depth first search recursive tree traversal to unselect all nodes */
  unselectAllFromTree(tree: IFileNode) {
    tree.selected = false;
    tree.children.forEach(child => this.unselectAllFromTree(child));
  }

  ngOnDestroy(): void {
    this._selectedNode.complete();
  }
}