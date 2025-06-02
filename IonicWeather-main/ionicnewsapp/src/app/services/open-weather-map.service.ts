import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherMapService {

  private url = "https://api.openweathermap.org/data/2.5";
  private API_KEY = "f2ed83e4127fab215be16253d167f896";

  constructor(private httpClient: HttpClient) { }

  getCity(latitude: number, longitude: number): Observable<OpenWeatherMapResponse> {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      lang: "pt",
      units: "metric",
      appId: this.API_KEY,
    })

    return this.httpClient.get<OpenWeatherMapResponse>(this.url + "/weather?" + params.toString())
  }

  getSurroundingCities(latitude: number, longitude: number, delta: number = 0.5): Observable<OpenWeatherMapResponse[]> {
    const coordinates: { lat: number, lon: number }[] = [{
      lat: latitude,
      lon: longitude,
    }, {
      lat: latitude + delta,
      lon: longitude + delta
    }, {
      lat: latitude - delta,
      lon: longitude + delta
    }, {
      lat: latitude + delta,
      lon: longitude - delta
    }, {
      lat: latitude - delta,
      lon: longitude - delta
    }];

    const requests = coordinates.map(
      ({ lat, lon }) => this.getCity(lat, lon)
    );

    return forkJoin(requests)
  }
}

export interface OpenWeatherMapResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
  favorited: boolean;
}
