export interface Catch {
  date: any;
  weight: number;
  length: number;
  source: string;
  position: { lon: number; name: string; lat: number };
  water: string;
  weather: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_min: number;
    temp_max: number;
  };
}
