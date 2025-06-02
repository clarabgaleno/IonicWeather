import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from './weather-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [WeatherCardComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [WeatherCardComponent]
})
export class WeatherCardModule { }
