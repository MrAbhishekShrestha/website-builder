import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DndModule } from 'ngx-drag-drop';
import { HeaderComponent } from './components/header.component';
import { HomeComponent } from './components/home/home.component';
import { OriginListComponent } from './components/origin-list/origin-list.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    OriginListComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DndModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
