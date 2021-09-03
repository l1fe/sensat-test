export interface SensorReading {
  id: string;
  box_id: string;
  sensor_type: string;
  name: string;
  range_l: number;
  range_u: number;
  longitude: number;
  latitude: number;
  reading: number;
  unit: string;
  reading_ts: Date;
}
