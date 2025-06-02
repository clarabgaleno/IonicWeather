import { Component, OnInit } from '@angular/core';
import { OpenWeatherMapResponse, OpenWeatherMapService } from '../services/open-weather-map.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  weathers: OpenWeatherMapResponse[] = [];
  defaultLatitude: number = -8.0539;
  defaultLongitude: number = -34.8811;
  
  latitude: number = this.defaultLatitude;
  longitude: number = this.defaultLongitude;

  constructor(
    private openWeatherMapService: OpenWeatherMapService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    this.searchWeathers();
  }

  searchWeathers(latitude: number = this.latitude, longitude: number = this.longitude) {
    const weathersInCache = this.localStorage.getWeathersInCache();
    this.weathers = [...weathersInCache];

    weathersInCache.forEach((weather, i) => {
      this.openWeatherMapService.getCity(weather.coord.lat, weather.coord.lon).subscribe((data) => {
        data.favorited = true;
        this.weathers[i] = data;
      });
    });

    this.openWeatherMapService.getSurroundingCities(latitude, longitude, 0.1).subscribe(data => {
      data.forEach((weather) => {
        const cityNames = this.weathers.map(w => w.name);
        const alreadyFetched = cityNames.includes(weather.name);
        if (alreadyFetched) return;

        weather.favorited = false;
        this.weathers.push(weather);
      });
    });
  }
  
  setLatitude(input: string | number | null = null) {
    if (typeof input === "string") {
      input = parseFloat(input);
      if (Number.isNaN(input)) return;
    }
    if (input === null) {
      input = this.defaultLatitude;
    }
    
    this.latitude = input;
  }

  setLongitude(input: string | number | null = null) {
    if (typeof input === "string") {
      input = parseFloat(input);
      if (Number.isNaN(input)) return;
    }
    if (input === null) {
      input = this.defaultLongitude;
    }
    
    this.longitude = input;
  }

  async setLocationWithGPS() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.setLatitude(coordinates.coords.latitude);
    this.setLongitude(coordinates.coords.longitude);
    this.searchWeathers();
  }
}
