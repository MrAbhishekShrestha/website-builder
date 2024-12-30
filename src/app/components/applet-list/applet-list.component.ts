import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { DropEffect } from 'ngx-drag-drop';
import { combineLatest, distinctUntilChanged, map, Observable, startWith, take } from 'rxjs';
import { IFileNode } from 'src/app/models/fs.model';

@Component({
  selector: 'app-applet-list',
  templateUrl: './applet-list.component.html',
  styleUrls: ['./applet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletListComponent implements OnInit {
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
  form = new FormGroup({ search: new FormControl() });
  ogList$ = this.http.get('https://mrabhishekshrestha.github.io/website-builder/assets/applet-list.json').pipe(
    take(1),
    map((resp: any): any[] => resp?.data),
    map(arr => arr.map(this.mapResponseContainerToFileNode)),
  );
  finalList$: Observable<IFileNode[]>;

  ngOnInit(): void {
    const search$ = this.form.valueChanges.pipe(
      map(form => form?.search as string),
      distinctUntilChanged(),
      startWith(<string>null),
    );
    this.finalList$ = combineLatest([this.ogList$, search$]).pipe(
      map(([ogList, search]) => {
        if (!search) return ogList;
        return ogList.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));
      }),
      map(filteredList => [this.getOriginFolder(), ...filteredList])
    );
  }

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
