import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherDetailsPage } from './weather-details.page';

describe('WeatherDetailsPage', () => {
  let component: WeatherDetailsPage;
  let fixture: ComponentFixture<WeatherDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
