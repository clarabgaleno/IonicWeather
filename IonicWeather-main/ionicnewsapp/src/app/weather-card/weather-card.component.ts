import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { OpenWeatherMapResponse } from '../services/open-weather-map.service';
import { Router } from '@angular/router';

type WeatherCache = Array<{
  cityName: string | null
  temperature: number | null
  weatherCode: number | null
  humidity: number | null
  weatherStatus: string | null
}>

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss'],
})
export class WeatherCardComponent implements OnInit {
  constructor(private localStorage: LocalStorageService, private router: Router) { }
  cityName!: string | null;
  temperature!: number | null;
  weatherCode!: number | null;
  humidity!: number | null;
  weatherStatus!: string | null;
  isFavorited!: boolean;

  @Input() weather!: OpenWeatherMapResponse;

  favoriteCard(event: MouseEvent | undefined) {
    if (event) event.stopPropagation();

    this.isFavorited = !this.isFavorited;
    if (this.isFavorited) {
      this.localStorage.saveWeather(this.weather);
    }
    if (!this.isFavorited) {
      this.localStorage.removeWeather(this.weather);
    }
  }

  getWeatherIcon(weatherCode: number | null): number | null {
    if (weatherCode === null) return null;
    if (weatherCode === 800) return 0; // sunny
    if ((weatherCode >= 700 && weatherCode < 800) || weatherCode > 800) return 1; // cloudy
    if (weatherCode >= 300 && weatherCode < 600) return 2; // rainy
    if (weatherCode >= 200 && weatherCode < 300) return 3; // thunderstorm
    if (weatherCode >= 600 && weatherCode < 700) return 4; // snow

    return null;
  }

  ngOnInit() {
    this.cityName = this.weather.name;
    this.temperature = Math.round(this.weather.main.temp);
    this.weatherCode = this.weather.weather[0]?.id || null;
    this.humidity = this.weather.main.humidity;
    this.weatherStatus = this.capitalizeFirstLetter(this.weather.weather[0]?.description);
    this.isFavorited = !!this.weather.favorited;
  }

  goToDetails() {
    this.router.navigate(["/weather-details", JSON.stringify(this.weather)])
  }

  private capitalizeFirstLetter(str: string | null) {
    if (!str) return null
    return str[0].toUpperCase() + str.slice(1)
  }
}
