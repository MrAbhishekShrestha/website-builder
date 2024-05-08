import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { Subject } from "rxjs";
import { LayoutService } from "../../services/layout.service";
import { INode, ILayout } from "src/app/models/website-builder.models";
import { WIDGET_ID } from "src/app/models/website-builder.constants";

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

  root: INode = {
    name: "Layout",
    type: "row",
    selected: false,
    children: [
      { name: "Header", type: "widget", selected: false, description: "first", widgetId: WIDGET_ID.header, children: [], },
      {
        name: "Column", "type": "column", selected: false, children: [
          { name: "Image Slider", type: "widget", selected: false, widgetId: WIDGET_ID.imageSlider, children: [], },
          { name: "Description", type: "widget", selected: false, widgetId: WIDGET_ID.text, children: [], },
        ],
      },
      { name: "Footer", type: "widget", selected: false, widgetId: WIDGET_ID.footer, children: [], },
    ]
  };
  layout$ = this.layoutService.layout$

  constructor(private layoutService: LayoutService) { }

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
      this.root = payload.newNode;
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
    this.unselectAllFromTree(this.root);
  }

  /** depth first search recursive tree traversal to unselect all nodes */
  unselectAllFromTree(tree: INode) {
    tree.selected = false;
    tree.children.forEach(child => this.unselectAllFromTree(child));
  }

  onSaveLayout(newLayout: ILayout) {
    this.layoutService.updateLayout(newLayout);
  }

  ngOnDestroy(): void {
    this._selectedNode.complete();
  }
}