import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf and ngFor
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { DetailsComponent } from './details.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,  // Add CommonModule here
    FormsModule,
    DetailsComponent,
  ],
})
export class DetailsModule {}
