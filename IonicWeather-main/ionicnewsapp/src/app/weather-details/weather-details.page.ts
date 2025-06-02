import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenWeatherMapResponse } from '../services/open-weather-map.service';
import { OpenMeteoService } from '../services/open-meteo.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.page.html',
  styleUrls: ['./weather-details.page.scss'],
})
export class WeatherDetailsPage implements OnInit {
  constructor(
    private location: Location,
    private router: Router,
    private openMeteoService: OpenMeteoService,
    private localStorage: LocalStorageService,
  ) { }

  weather!: OpenWeatherMapResponse;
  weatherCode: number | null = null;
  weatherStatus: string | null = null;
  temperature!: number;
  humidity!: number;
  isFavorited!: boolean;

  selectedDate!: string;
  selectedDateLabel!: string;
  canSelectPrev: boolean = false;
  canSelectNext: boolean = true;

  currentDateWeatherData: Array<{
    temperature: number
    humidity: number
    time: string
  }> = []

  DAYS_TO_SEARCH: number = 5;
  hourlyData: Array<{
    temperature: number
    humidity: number
    time: Date
  }> = []
  
  ngOnInit(): void {
    const url = this.router.url;
    const decodedUrl = decodeURI(url.split("/")[2]);
    this.weather = JSON.parse(decodedUrl);

    this.weatherCode = this.weather.weather[0]?.id;
    this.weatherStatus = this.capitalizeFirstLetter(this.weather.weather[0]?.description);
    this.temperature = this.weather.main.temp;
    this.humidity = this.weather.main.humidity;
    this.isFavorited = this.weather.favorited;

    this.getHourlyWeatherData(this.weather.coord.lat, this.weather.coord.lon);
    
    const today = new Date();
    today.setMinutes(0, 0, 0);
    this.selectedDate = today.toISOString();
    this.updateSelectedDateLabel();
  }

  goBack() {
    this.location.back();
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

  private capitalizeFirstLetter(str: string | null): string | null {
    if (!str) return null
    return str[0].toUpperCase() + str.slice(1)
  }

  getHourlyWeatherData(lat: number, lon: number) {
    this.openMeteoService.getCity(lat, lon, this.DAYS_TO_SEARCH).subscribe((data) => {
      const today = new Date();
      const minIndex = data.hourly.time.findIndex((weather) => {
        const date = new Date(weather);
        if (date.getDate() === today.getDate()) {
          return date.getHours() === today.getHours()
        }

        return false;
      })

      this.hourlyData = data.hourly.time
        .filter((_, i) => i >= minIndex)
        .map((time) => new Date(time))
        .sort((a, b) => a.getTime() - b.getTime())
        .map((time, i) => ({
          humidity: data.hourly.relative_humidity_2m[i],
          temperature: data.hourly.temperature_2m[i],
          time,
        }));

        console.log(this.hourlyData);

      this.updateCurrentDateWeatherData();
    });
  }

  favoriteCard() {
    this.isFavorited = !this.isFavorited;
    if (this.isFavorited) {
      this.localStorage.saveWeather(this.weather);
    }
    if (!this.isFavorited) {
      this.localStorage.removeWeather(this.weather);
    }
  }

  updateSelectedDateLabel() {
    const date = new Date(this.selectedDate);
    const dayNumber = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const yearNumber = date.getFullYear();

    const day = this.addTrailingZero(dayNumber);
    const month = this.addTrailingZero(monthNumber);
    const year = yearNumber.toString().slice(2);

    this.selectedDateLabel = `${day}/${month}/${year}`;
  }

  decreaseSelectedDate() {
    const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    const currentDateInMilliseconds = new Date(this.selectedDate).getTime();
    
    const previousDateInMilliseconds = currentDateInMilliseconds - ONE_DAY_IN_MILLISECONDS;
    
    const previousDate = new Date(previousDateInMilliseconds);
    const minDate = new Date();

    previousDate.setHours(0, 0, 0, 0);
    minDate.setHours(0, 0, 0, 0);

    if (minDate.getTime() > previousDate.getTime()) return;
    
    this.canSelectNext = true;
    this.canSelectPrev = minDate.getTime() <= previousDate.getTime() - ONE_DAY_IN_MILLISECONDS;
    this.selectedDate = previousDate.toISOString();
    this.updateSelectedDateLabel();
    this.updateCurrentDateWeatherData();
  }

  increaseSelectedDate() {
    const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    const currentDateInMilliseconds = new Date(this.selectedDate).getTime();
    const nextDateInMilliseconds = currentDateInMilliseconds + ONE_DAY_IN_MILLISECONDS;
    
    const nextDate = new Date(nextDateInMilliseconds);
    const today = new Date();
    
    nextDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const todayInMilliseconds = today.getTime();
    const maxDate = new Date(todayInMilliseconds + (ONE_DAY_IN_MILLISECONDS * this.DAYS_TO_SEARCH));
    if (nextDate.getTime() > maxDate.getTime()) return;
    
    this.canSelectPrev = true;
    this.canSelectNext = maxDate.getTime() >= nextDate.getTime() + ONE_DAY_IN_MILLISECONDS;
    this.selectedDate = nextDate.toISOString();
    this.updateSelectedDateLabel();
    this.updateCurrentDateWeatherData()
  }

  updateCurrentDateWeatherData() {
    this.currentDateWeatherData = this.hourlyData.filter((hourlyData) => {
      const date = new Date(this.selectedDate);
      return date.getDate() === hourlyData.time.getDate();
    }).map((hourlyData) => {
      const hour = hourlyData.time.getHours();
      const minutes = hourlyData.time.getMinutes();
      const time = `${this.addTrailingZero(hour)}:${this.addTrailingZero(minutes)}`;

      return {
        humidity: hourlyData.humidity,
        temperature: hourlyData.temperature,
        time,
      };
    });
  }

  private addTrailingZero(num: number): string {
    if (num < 10) return `0${num}`;
    return num.toString();
  }
}
