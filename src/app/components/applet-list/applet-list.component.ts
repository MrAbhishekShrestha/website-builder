import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { DropEffect } from 'ngx-drag-drop';
import { map, take, tap } from 'rxjs';
import { IFileNode } from 'src/app/models/fs.model';

@Component({
  selector: 'app-applet-list',
  templateUrl: './applet-list.component.html',
  styleUrls: ['./applet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletListComponent {
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragMove = new EventEmitter<{ event: DragEvent, effect: DropEffect, node: IFileNode, list?: IFileNode[] }>();
  @Output() dragEnd = new EventEmitter<DragEvent>();

  http = inject(HttpClient);
  readonly originList: IFileNode[] = [
    {
      name: "Folder",
      type: "folder",
      data: null,
      children: [],
      selected: false,
      expanded: false,
    }
  ];

  ogList$ = this.http.get('/assets/applet-list.json').pipe(
    take(1),
    map((resp: any): any[] => resp?.data),
    map(arr => [this.getOriginFolder(), ...arr.map(this.mapResponseContainerToFileNode)]),
  );

  onDragStart(event: DragEvent) { this.dragStart.emit(event); }

  onDragged(event: DragEvent, node: IFileNode, effect: DropEffect) {
    this.dragMove.emit({ event, effect, node });
  }

  onDragEnd(event: DragEvent) { this.dragEnd.emit(event); }

  mapResponseContainerToFileNode(respContainer: any): IFileNode {
    const node: IFileNode = {
      name: respContainer?.applet?.applet_name,
      type: "applet",
      data: respContainer,
      children: [],
      selected: false,
      expanded: false,
    }
    return node;
  }

  getOriginFolder(): IFileNode {
    return {
      name: "Folder",
      type: "folder",
      data: null,
      children: [],
      selected: false,
      expanded: false,
    } as IFileNode
  }
}
