import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherDetailsPage } from './weather-details.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherDetailsPageRoutingModule {}
