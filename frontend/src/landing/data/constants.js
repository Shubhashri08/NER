export const STATES_DATA = [
  { name: 'Assam', img: 'assam.png', code: 'AS', status: 'Optimal Logistics', districts: 35, alert: 'Normal' },
  { name: 'Arunachal Pradesh', img: 'arunachal-pradesh.png', code: 'AR', status: 'High Alert: Passes', districts: 26, alert: 'Pass Watch' },
  { name: 'Manipur', img: 'manipur.png', code: 'MN', status: 'Active Monitoring', districts: 16, alert: 'Active' },
  { name: 'Meghalaya', img: 'meghalaya.png', code: 'ML', status: 'Heavy Rainfall Alert', districts: 12, alert: 'Rain Watch' },
  { name: 'Mizoram', img: 'mizoram.png', code: 'MZ', status: 'Clear Corridor', districts: 11, alert: 'Clear' },
  { name: 'Nagaland', img: 'nagaland.png', code: 'NL', status: 'Safe Mountain Transit', districts: 16, alert: 'Clear' },
  { name: 'Sikkim', img: 'sikkim.png', code: 'SK', status: 'Glacial Watch Active', districts: 6, alert: 'Glacial' },
  { name: 'Tripura', img: 'tripura.png', code: 'TR', status: 'Buffer Depot Ready', districts: 8, alert: 'Ready' }
];

export const HAZARDS_DATA = [
  {
    idx: '01',
    title: 'LANDSLIDES',
    desc1: 'Routes blocked.',
    desc2: 'Communities isolated.',
    image: 'hazards/landslide.png',
    tag: 'Critical Hill Pass'
  },
  {
    idx: '02',
    title: 'FLOODS',
    desc1: 'Rivers rise.',
    desc2: 'Roads vanish.',
    image: 'hazards/flood.png',
    tag: 'River Basin Inundation'
  },
  {
    idx: '03',
    title: 'SEVERE WEATHER',
    desc1: 'Conditions change.',
    desc2: 'Plans must adapt.',
    image: 'hazards/severe-weather.png',
    tag: 'Sudden Cloudburst'
  }
];

export const WORKFLOW_STEPS = [
  {
    num: '01',
    iconName: 'FileText',
    title: 'IDENTIFY NEEDS',
    detail: 'Instantly aggregate verified survivor reports, medical deficiencies, and clean water requirements.'
  },
  {
    num: '02',
    iconName: 'GitBranch',
    title: 'PLAN & ALLOCATE',
    detail: 'Calculate mathematically optimal route vectors and allocate scarce relief stock from nearest state hubs.'
  },
  {
    num: '03',
    iconName: 'Truck',
    title: 'MOVE & ADAPT',
    detail: 'Convoys move with real-time GPS telemetry. Dynamic failover reroutes convoys if road closures occur.'
  },
  {
    num: '04',
    iconName: 'ShieldCheck',
    title: 'PROTECT LIVES',
    detail: 'Execute calculated emergency evacuations and safe relocations before hazardous cut-offs occur.'
  }
];

export const IMPACTS_DATA = [
  {
    iconName: 'Zap',
    metric: '4.2x Faster',
    title: 'Faster',
    subtitle: 'Response',
    desc: 'Immediate dispatch turnaround across complex hill terrains.'
  },
  {
    iconName: 'Globe2',
    metric: '6,500+ Nodes',
    title: 'Connected',
    subtitle: 'Communities',
    desc: 'Continuous telemetry links even under complete network blackouts.'
  },
  {
    iconName: 'Activity',
    metric: '91% Reduction',
    title: 'Efficient',
    subtitle: 'Resource Use',
    desc: 'Eliminates redundant stockouts and expired emergency medical supplies.'
  },
  {
    iconName: 'ShieldCheck',
    metric: 'Zero Blindspots',
    title: 'Disaster-Ready',
    subtitle: 'Northeast',
    desc: 'Unified state-border coordination protocols across all 8 sister states.'
  }
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Platform', href: '#platform' },
  { label: 'Impact', href: '#impact' },
  { label: 'NER', href: '#ner' },
  { label: 'Contact', href: '#contact' }
];
