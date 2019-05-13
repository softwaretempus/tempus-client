import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { StarComponent } from './star.component';

@NgModule({
  imports: [
    CommonModule,    
  ],
  declarations: [
    StarComponent
  ],
  exports: [
    StarComponent,
    CommonModule,
    FormsModule,
    TextMaskModule,
    ShowHidePasswordModule,
  ]
})
export class SharedModule { }
