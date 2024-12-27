import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { DndModule } from 'ngx-drag-drop';
import { HeaderComponent } from './components/header.component';
import { HomeComponent } from './components/home/home.component';
import { OriginListComponent } from './components/origin-list/origin-list.component';
import { LayoutComponent } from './components/layout/layout.component';
import { OptionsComponent } from './components/options/options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstCharPipe } from './components/layout/first-char.pipe';
import { LayoutDetailsComponent } from './components/layout-details/layout-details.component';
import { NodeDetailsComponent } from './components/node-details/node-details.component';
import { FileSystemComponent } from './components/filesystem/filesystem.component';
import { AppletListComponent } from './components/applet-list/applet-list.component';
import { FolderCharPipe } from './components/layout/folder.pipe';
import { FileSystemLayoutComponent } from './components/file-system-layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    OriginListComponent,
    LayoutComponent,
    OptionsComponent,
    FirstCharPipe,
    LayoutDetailsComponent,
    NodeDetailsComponent,
    FileSystemComponent,
    AppletListComponent,
    FolderCharPipe,
    FileSystemLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DndModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
