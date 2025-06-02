import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenMeteoService {

  private url = "https://api.open-meteo.com/v1";

  constructor(private httpClient: HttpClient) { }

  getCity(latitude: number, longitude: number, days: number = 5): Observable<OpenMeteoResponse> {
    const hourlyParams = [
      "temperature_2m",
      "relative_humidity_2m",
      "weathercode",
    ];

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: hourlyParams.join(","),
      "forecast_days": (days + 1).toString(),
    });

    return this.httpClient.get<OpenMeteoResponse>(this.url + "/forecast?" + params.toString());
  }

  getCurrentTemperature(data: OpenMeteoResponse): number | null {
    const i = this.getCurrentTimeIndex(data);
    return data.hourly.temperature_2m[i] ?? null;
  }

  getCurrentHumidity(data: OpenMeteoResponse): number | null {
    const i = this.getCurrentTimeIndex(data);
    return data.hourly.relative_humidity_2m[i] ?? null;
  }

  getCurrentWeatherCode(data: OpenMeteoResponse): number | null {
    const i = this.getCurrentTimeIndex(data);
    return data.hourly.weathercode[i] ?? null;
  }

  private getCurrentTimeIndex(data: OpenMeteoResponse): number {
    const now = new Date().getHours();
    return data.hourly.time.findIndex((time) => {
      const hour = new Date(time).getHours();
      return hour === now;
    });
  }
}

export interface OpenMeteoResponse {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  hourly_units: {
    temperature_2m: string,
    relative_humidity_2m: string,
    weathercode: string,
  },
  hourly: {
    time: string[],
    temperature_2m: number[],
    relative_humidity_2m: number[],
    weathercode: number[]
  }
}
