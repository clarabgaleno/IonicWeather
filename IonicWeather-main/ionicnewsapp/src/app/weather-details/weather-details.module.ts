import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherDetailsPageRoutingModule } from './weather-details-routing.module';

import { WeatherDetailsPage } from './weather-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherDetailsPageRoutingModule
  ],
  declarations: [WeatherDetailsPage]
})
export class WeatherDetailsPageModule {}
