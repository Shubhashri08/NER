export interface Incident {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  severity: 'CRITICAL' | 'WARNING' | 'MODERATE' | 'INFO';
  impact: string;
  clearance_estimate: string;
  data_source_tier: 'REAL' | 'FIELD REPORT' | 'SIMULATED';
}

export interface Village {
  id: string;
  name: string;
  state: string;
  district: string;
  census_code: string;
  population: number;
  vulnerabilities: { infants: number; elderly: number; injured: number };
  isolation_day: number;
  lat: number;
  lng: number;
  urgency_score: number;
  water_hours_remaining: number;
  food_days_remaining: number;
  medical_status: string;
  access_route: string;
  alternate_route: string;
  sustainability_status: string;
  data_source_tier: 'REAL';
}

export interface Warehouse {
  id: string;
  name: string;
  state: string;
  type: string;
  lat: number;
  lng: number;
  stock: {
    drinking_water_liters: number;
    high_calorie_meals: number;
    trauma_medical_kits: number;
    emergency_shelter_kits: number;
  };
  capacity_used_pct: number;
  data_source_tier: 'SIMULATED';
}

export interface Vehicle {
  id: string;
  callsign: string;
  type: string;
  registration: string;
  status: 'IN_TRANSIT' | 'AVAILABLE' | 'MAINTENANCE' | 'WEATHER_HOLD';
  active_mission: string | null;
  payload_capacity_kg: number;
  cargo_current: string;
  fuel_remaining_pct: number;
  driver: string;
  telemetry_speed: string;
  data_source_tier: 'SIMULATED';
}

export interface Shelter {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  certified_capacity: number;
  current_occupancy: number;
  headroom_available: number;
  potable_water: boolean;
  generator_backup: boolean;
  medical_post: boolean;
  intake_status: 'ACCEPTING' | 'NEAR_CAPACITY' | 'FULL';
  data_source_tier: 'SIMULATED';
}

export const MOCK_DATA = {
  villages: [
    {
      id: 'LOC-NER-ASM-003',
      name: 'Harangajao (Cutoff Valley)',
      state: 'Assam',
      district: 'Dima Hasao',
      census_code: '298205',
      population: 3680,
      vulnerabilities: { infants: 460, elderly: 390, injured: 42 },
      isolation_day: 3,
      lat: 25.0210,
      lng: 93.0334,
      urgency_score: 86.4,
      water_hours_remaining: 4.2,
      food_days_remaining: 1.5,
      medical_status: 'Critical Shortage: Anti-venom & Trauma Kits exhausted',
      access_route: 'NH-27 (Blocked at Jatinga km-142)',
      alternate_route: 'BRO Old Mahur Mountain Bypass (+23 mins)',
      sustainability_status: 'RELOCATION_EVALUATION_ACTIVE',
      data_source_tier: 'REAL' as const,
    },
    {
      id: 'LOC-NER-ASM-002',
      name: 'Jatinga (Ridge Post)',
      state: 'Assam',
      district: 'Dima Hasao',
      census_code: '298144',
      population: 1587,
      vulnerabilities: { infants: 210, elderly: 165, injured: 12 },
      isolation_day: 2,
      lat: 25.1245,
      lng: 93.1512,
      urgency_score: 68.0,
      water_hours_remaining: 14.0,
      food_days_remaining: 3.0,
      medical_status: 'Moderate: Local PHC holding baseline triage supplies',
      access_route: 'NH-27 Upper Highway (Passable to Haflong)',
      alternate_route: 'Direct Arterial from Haflong Depot',
      sustainability_status: 'SUSTAINABLE_IN_SITU',
      data_source_tier: 'REAL' as const,
    },
    {
      id: 'LOC-NER-SIK-002',
      name: 'Chungthang Confluence',
      state: 'Sikkim',
      district: 'North Sikkim',
      census_code: '260850',
      population: 3942,
      vulnerabilities: { infants: 410, elderly: 340, injured: 58 },
      isolation_day: 4,
      lat: 27.6033,
      lng: 88.6472,
      urgency_score: 88.2,
      water_hours_remaining: 6.0,
      food_days_remaining: 2.0,
      medical_status: 'Acute: Teesta surge breached pharmacy store',
      access_route: 'North Sikkim Highway (NH-10 Severed)',
      alternate_route: 'Military Foot Track & Ropeway Only',
      sustainability_status: 'RELOCATION_RECOMMENDED',
      data_source_tier: 'REAL' as const,
    },
    {
      id: 'LOC-NER-SIK-003',
      name: 'Lachen Alpine Station',
      state: 'Sikkim',
      district: 'North Sikkim',
      census_code: '260862',
      population: 1325,
      vulnerabilities: { infants: 120, elderly: 175, injured: 15 },
      isolation_day: 5,
      lat: 27.7310,
      lng: 88.5520,
      urgency_score: 82.5,
      water_hours_remaining: 8.5,
      food_days_remaining: 2.5,
      medical_status: 'Oxygen and hypothermia dressings critically low',
      access_route: 'Chungthang-Lachen Axis (Collapsed)',
      alternate_route: 'Air-drop corridor / Forward foot recon',
      sustainability_status: 'RELOCATION_RECOMMENDED',
      data_source_tier: 'REAL' as const,
    },
    {
      id: 'LOC-NER-MEG-002',
      name: 'Sohra (Cherrapunji)',
      state: 'Meghalaya',
      district: 'East Khasi Hills',
      census_code: '278450',
      population: 11772,
      vulnerabilities: { infants: 1320, elderly: 1190, injured: 24 },
      isolation_day: 2,
      lat: 25.2986,
      lng: 91.7314,
      urgency_score: 62.0,
      water_hours_remaining: 24.0,
      food_days_remaining: 5.0,
      medical_status: 'Stable civil hospital, road debris on SH-05',
      access_route: 'SH-05 from Shillong',
      alternate_route: 'Mawsmai Escarpment Secondary Line',
      sustainability_status: 'SUSTAINABLE_IN_SITU',
      data_source_tier: 'REAL' as const,
    }
  ],
  warehouses: [
    {
      id: 'WH-NER-HAFLONG',
      name: 'Haflong Forward Tactical Staging Depot',
      state: 'Assam',
      type: 'Hill Tactical Forward Depot',
      lat: 25.1832,
      lng: 93.0254,
      stock: {
        drinking_water_liters: 64800,
        high_calorie_meals: 24500,
        trauma_medical_kits: 460,
        emergency_shelter_kits: 270,
      },
      capacity_used_pct: 78,
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'WH-NER-SILCHAR',
      name: 'Silchar Central Transshipment Depot',
      state: 'Assam',
      type: 'Barak Valley Regional Supply Base',
      lat: 24.8333,
      lng: 92.7926,
      stock: {
        drinking_water_liters: 357600,
        high_calorie_meals: 86250,
        trauma_medical_kits: 2750,
        emergency_shelter_kits: 1550,
      },
      capacity_used_pct: 64,
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'WH-NER-MANGAN',
      name: 'Mangan Alpine Forward Depot',
      state: 'Sikkim',
      type: 'High-Altitude Forward Base',
      lat: 27.5050,
      lng: 88.5286,
      stock: {
        drinking_water_liters: 9600,
        high_calorie_meals: 4250,
        trauma_medical_kits: 90,
        emergency_shelter_kits: 45,
      },
      capacity_used_pct: 92,
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'WH-NER-SHILLONG',
      name: 'Shillong Civil Defense Base',
      state: 'Meghalaya',
      type: 'State Command Reserve',
      lat: 25.5689,
      lng: 91.8833,
      stock: {
        drinking_water_liters: 186000,
        high_calorie_meals: 53000,
        trauma_medical_kits: 1280,
        emergency_shelter_kits: 620,
      },
      capacity_used_pct: 55,
      data_source_tier: 'SIMULATED' as const,
    }
  ],
  vehicles: [
    {
      id: 'VEH-NER-4X4-01',
      callsign: 'BRAHMAPUTRA-TACTICAL-01',
      type: 'Heavy 4x4 High-Clearance Tactical',
      registration: 'AS-01-TC-9901',
      status: 'IN_TRANSIT' as const,
      active_mission: 'MSN-NER-2026-001',
      payload_capacity_kg: 2500,
      cargo_current: 'Water (800 Packs) + 350 Trauma & Anti-Venom Kits',
      fuel_remaining_pct: 82,
      driver: 'Subedar Bipul Saikia',
      telemetry_speed: '22 km/h (BRO Bypass Ascent)',
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'VEH-NER-TRK-02',
      callsign: 'BARAK-SUPPLY-02',
      type: '10-Ton Multi-Axle Freight Hauler',
      registration: 'AS-11-BC-4402',
      status: 'AVAILABLE' as const,
      active_mission: null,
      payload_capacity_kg: 10000,
      cargo_current: 'Pre-loaded 4,000 High-Calorie Rations',
      fuel_remaining_pct: 90,
      driver: 'Kamal Debbarma',
      telemetry_speed: 'Stationary (Silchar Depot)',
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'VEH-NER-SIK-4X4',
      callsign: 'KANCHENJUNGA-ALPINE-03',
      type: 'Alpine 4x4 Heavy Cargo Carrier',
      registration: 'SK-04-A-1088',
      status: 'AVAILABLE' as const,
      active_mission: null,
      payload_capacity_kg: 2000,
      cargo_current: 'Oxygen Cylinders (20 Units) + Trauma Packs',
      fuel_remaining_pct: 88,
      driver: 'Tenzing Lepcha',
      telemetry_speed: 'Stationary (Mangan Hub)',
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'VEH-NER-BOAT-01',
      callsign: 'SDRF-FLOOD-RESCUE-01',
      type: 'Motorized Inflatable Flood Rescue Vessel',
      registration: 'AS-SDRF-B-09',
      status: 'AVAILABLE' as const,
      active_mission: null,
      payload_capacity_kg: 1200,
      cargo_current: 'Life Jackets & First Aid Pouch',
      fuel_remaining_pct: 95,
      driver: 'Inspector Jiten Das',
      telemetry_speed: 'Stationary (Jatinga River Basin)',
      data_source_tier: 'SIMULATED' as const,
    }
  ],
  shelters: [
    {
      id: 'SHELTER-NER-HAFLONG-COLLEGE',
      name: 'Haflong Government College Safe Haven',
      state: 'Assam',
      district: 'Dima Hasao',
      lat: 25.1850,
      lng: 93.0270,
      certified_capacity: 650,
      current_occupancy: 210,
      headroom_available: 440,
      potable_water: true,
      generator_backup: true,
      medical_post: true,
      intake_status: 'ACCEPTING' as const,
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'SHELTER-NER-SILCHAR-STAD',
      name: 'Silchar Sports Stadium Mega Shelter',
      state: 'Assam',
      district: 'Cachar',
      lat: 24.8350,
      lng: 92.7950,
      certified_capacity: 2500,
      current_occupancy: 740,
      headroom_available: 1760,
      potable_water: true,
      generator_backup: true,
      medical_post: true,
      intake_status: 'ACCEPTING' as const,
      data_source_tier: 'SIMULATED' as const,
    },
    {
      id: 'SHELTER-NER-MANGAN-SCHOOL',
      name: 'Mangan Senior Secondary High-Ground Shelter',
      state: 'Sikkim',
      district: 'North Sikkim',
      lat: 27.5080,
      lng: 88.5300,
      certified_capacity: 400,
      current_occupancy: 320,
      headroom_available: 80,
      potable_water: true,
      generator_backup: true,
      medical_post: true,
      intake_status: 'NEAR_CAPACITY' as const,
      data_source_tier: 'SIMULATED' as const,
    }
  ]
};
