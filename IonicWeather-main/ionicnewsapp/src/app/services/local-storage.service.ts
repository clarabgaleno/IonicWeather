import { Injectable } from '@angular/core';
import { OpenWeatherMapResponse } from './open-weather-map.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveWeather(weather: OpenWeatherMapResponse, cacheKey: string = "weathers"): void {
    weather.favorited = true;
    const cachedWeathers = localStorage.getItem(cacheKey) || "[]";
    const weathers = JSON.parse(cachedWeathers) as OpenWeatherMapResponse[];
    weathers.push(weather);
    localStorage.setItem(cacheKey, JSON.stringify(weathers));
  }

  removeWeather(weather: OpenWeatherMapResponse, cacheKey: string = "weathers"): void {
    weather.favorited = false;
    const cachedWeathers = localStorage.getItem(cacheKey) || "[]";
    const weathers = JSON.parse(cachedWeathers) as OpenWeatherMapResponse[];
    const filteredWeathers = weathers.filter(w => w.name !== weather.name);

    if (filteredWeathers.length === 0) {
      localStorage.removeItem(cacheKey);
      return;
    }

    localStorage.setItem(cacheKey, JSON.stringify(filteredWeathers));
  }

  getWeathersInCache(cacheKey: string = "weathers"): OpenWeatherMapResponse[] {
    const cachedWeathers = localStorage.getItem(cacheKey) || "[]";
    return JSON.parse(cachedWeathers) as OpenWeatherMapResponse[];
  }
}
