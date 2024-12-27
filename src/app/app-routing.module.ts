import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FileSystemComponent } from './components/filesystem/filesystem.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fs', component: FileSystemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
