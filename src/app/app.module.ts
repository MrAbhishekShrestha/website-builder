import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DndModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
