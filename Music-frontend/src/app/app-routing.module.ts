import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import {MusicianDetailsComponent} from './musician-details/musician-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add', component: DetailsComponent },
  { path: 'edit/:id', component: DetailsComponent },
  { path: 'details/:id', component: MusicianDetailsComponent },
  { path: 'musician/:id', component: MusicianDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
