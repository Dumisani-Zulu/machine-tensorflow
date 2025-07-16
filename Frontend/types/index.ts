// Frontend types for machine learning prediction
export interface SensorData {
  temperature: number;
  pressure: number;
  vibration: number;
}

export interface PredictionRequest {
  temperature: number;
  pressure: number;
  vibration: number;
}

export interface PredictionResponse {
  prediction: number; // 0 = no failure, 1 = failure
  probability_no_failure: number;
  probability_failure: number;
}

export interface ApiError {
  error: string;
}

// Machine types
export interface Machine {
  id: string;
  name: string;
  type: 'Crusher' | 'Belt Conveyor' | 'Excavator' | 'Drill' | 'Loader' | 'Haul Truck' | 'Mill' | 'Separator';
  status: 'online' | 'offline' | 'maintenance';
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
  efficiency: number;
  temperature: number;
  pressure: number;
  vibration: number;
}

export interface MachineFilters {
  type: string;
  status: string;
  healthStatus: string;
  location: string;
}
