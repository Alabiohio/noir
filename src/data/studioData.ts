export interface ProjectGalleryImage {
  url: string;
  caption: string;
}

export interface ArchitecturalProject {
  id: string;
  index: string;
  title: string;
  location: string;
  coordinates: string;
  year: string;
  typology: string;
  area: string;
  materials: string[];
  image: string;
  gallery: ProjectGalleryImage[];
  aspectClass: string;
  summary: string;
  narrative: string;
  architecturalConcept: string;
}

export interface StudioService {
  index: string;
  title: string;
  discipline: string;
  description: string;
  deliverables: string;
}

export type ArchitecturalMaterialId = 'concrete' | 'travertine' | 'titanium' | 'charred';

export interface ExplorerMaterialOption {
  id: ArchitecturalMaterialId;
  label: string;
  finish: string;
  swatchHex: string;
  accentHex: string;
  roughness: number;
  metalness: number;
  description: string;
}

export type CameraPresetId = 'perspective' | 'cantilever' | 'atrium' | 'elevation';

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const SELECTED_PROJECTS: ArchitecturalProject[] = [
  {
    id: 'the-monolith',
    index: '01',
    title: 'THE MONOLITH',
    location: 'Lagos, Nigeria',
    coordinates: '6.4549° N · 3.4346° E',
    year: '2025',
    typology: 'Residential',
    area: '920 m²',
    materials: ['Board-Formed Charcoal Concrete', 'Smoked Timber Soffits', 'Blackened Steel'],
    image: '/src/assets/images/project_monolith_lagos_1794946400741.jpg',
    gallery: [
      {
        url: '/src/assets/images/project_monolith_lagos_1794946400741.jpg',
        caption: 'Cantilevered upper living wing suspended above the Ikoyi reflection lagoon at dusk.',
      },
      {
        url: '/src/assets/images/project_monolith_lagos_detail_1794946400539.jpg',
        caption: 'Double-height central living hall with board-formed concrete walls and blackened steel stair.',
      },
    ],
    aspectClass: 'aspect-[16/9]',
    summary:
      'A post-tensioned charcoal concrete residence cantilevered dramatically above a still reflection lagoon in Ikoyi, balancing brutalist mass with passive tropical cross-ventilation.',
    narrative:
      'Set along a quiet peninsula in Lagos, The Monolith anchors a heavy poured-in-place living core into reclaimed coastal bedrock while projecting an eleven-meter sleeping wing effortlessly over water. Deep overhangs shield the double-height living salon from equatorial glare.',
    architecturalConcept:
      'Mass as climatic shelter: thick thermal concrete planes absorb tropical heat while continuous lagoon breezes pass beneath the raised upper volume, cooling the interior atrium naturally.',
  },
  {
    id: 'house-of-light',
    index: '02',
    title: 'HOUSE OF LIGHT',
    location: 'Accra, Ghana',
    coordinates: '5.6037° N · 0.1870° W',
    year: '2025',
    typology: 'Residential',
    area: '760 m²',
    materials: ['Warm Pigmented Concrete', 'Anodized Steel Louvers', 'Honed Travertine'],
    image: '/src/assets/images/project_house_of_light_accra_1794946400941.jpg',
    gallery: [
      {
        url: '/src/assets/images/project_house_of_light_accra_1794946400941.jpg',
        caption: 'South courtyard elevation screened by precision vertical sun-breakers.',
      },
      {
        url: '/src/assets/images/project_house_of_light_accra_detail_1794946402268.jpg',
        caption: 'Shaded pergola gallery measuring West African daylight across honed limestone.',
      },
    ],
    aspectClass: 'aspect-[4/3]',
    summary:
      'A serene residential sanctuary organized around a shaded water courtyard, where overhead concrete pergolas and vertical louvers choreograph shifting West African sunlight.',
    narrative:
      'Rather than sealing the home behind reflective glass, House of Light treats daylight as a carved structural material. Precision architectural louvers fracture direct solar intensity into rhythmic shadow bands that move slowly across travertine floors from dawn to dusk.',
    architecturalConcept:
      'Architecture as a solar instrument: perforated overhead soffits and perimeter colonnades mediate harsh equatorial sun into calm, habitable luminosity.',
  },
  {
    id: 'concrete-horizon',
    index: '03',
    title: 'CONCRETE HORIZON',
    location: 'Cape Town, South Africa',
    coordinates: '33.9249° S · 18.4241° E',
    year: '2026',
    typology: 'Commercial',
    area: '5,400 m²',
    materials: ['Marine-Grade Cast Concrete', 'Anodized Titanium Glazing', 'Honed Cape Basalt'],
    image: '/src/assets/images/project_concrete_horizon_capetown_1794946402338.jpg',
    gallery: [
      {
        url: '/src/assets/images/project_concrete_horizon_capetown_1794946402338.jpg',
        caption: 'Stepped cantilevered terraces anchored into Atlantic coastal granite.',
      },
      {
        url: '/src/assets/images/project_concrete_horizon_capetown_detail_1794946402999.jpg',
        caption: 'Exposed structural ceiling ribs and basalt reception hall facing the ocean horizon.',
      },
    ],
    aspectClass: 'aspect-[3/4]',
    summary:
      'A stepped coastal commercial headquarters sculpted directly into Atlantic cliffside granite, stepping down in horizontal concrete terraces toward Table Mountain mist.',
    narrative:
      'Designed as a flagship workplace and public architectural gallery, Concrete Horizon resists vertical tower convention in favor of horizontal geological stratification. Deep recessed terraces withstand fierce Cape coastal winds while framing uninterrupted oceanic vistas.',
    architecturalConcept:
      'Geological continuity: terraced post-tensioned slabs echo natural sedimentary cliff ledges, merging workplace infrastructure with coastal topography.',
  },
  {
    id: 'silent-form',
    index: '04',
    title: 'SILENT FORM',
    location: 'Copenhagen, Denmark',
    coordinates: '55.6761° N · 12.5683° E',
    year: '2026',
    typology: 'Cultural',
    area: '6,800 m²',
    materials: ['Nordic Cast Grey Concrete', 'Blackened Steel Fins', 'Honed Dark Granite'],
    image: '/src/assets/images/project_silent_form_copenhagen_1794946403424.jpg',
    gallery: [
      {
        url: '/src/assets/images/project_silent_form_copenhagen_1794946403424.jpg',
        caption: 'Harborfront monolith reflecting softly in calm Copenhagen waters at twilight.',
      },
      {
        url: '/src/assets/images/project_silent_form_copenhagen_detail_1794946402995.jpg',
        caption: 'Parabolic concrete exhibition vaults bathed in diffused Nordic zenithal daylight.',
      },
    ],
    aspectClass: 'aspect-[16/9]',
    summary:
      'A waterfront cultural foundation and sculpture museum defined by monolithic cast concrete vaults, rhythmic steel fins, and diffused northern zenithal daylight.',
    narrative:
      'Occupying a former industrial quay along Copenhagen’s inner harbor, Silent Form composes quiet, monumental galleries where acoustic stillness precedes visual encounter. Deeply recessed water-level glazing connects exhibition halls directly to tidal reflections outside.',
    architecturalConcept:
      'Nordic compression and release: low threshold passages expand suddenly into vaulted concrete chambers illuminated solely from overhead sky apertures.',
  },
];

export const STUDIO_IMAGE = '/src/assets/images/studio_atelier_space_1794945184952.jpg';

export const STUDIO_SERVICES: StudioService[] = [
  {
    index: '01',
    title: 'Monolithic Architecture',
    discipline: 'Civic · Cultural · Private Residences',
    description:
      'Site-specific architectural commissions shaped by structural honesty, cantilevered geometry, and enduring stone and concrete tectonics.',
    deliverables: 'Feasibility, Spatial Concept, Structural Integration, Construction Administration',
  },
  {
    index: '02',
    title: 'Spatial Interior Design',
    discipline: 'Bespoke Environments · Material Curation',
    description:
      'Quiet, tactile interiors composed from raw travertine, brushed steel, smoked oak, and precision architectural joinery.',
    deliverables: 'Interior Architecture, Custom Millwork, Material Library, Furniture Direction',
  },
  {
    index: '03',
    title: 'Museum & Exhibition Scenography',
    discipline: 'Galleries · Foundations · Pavilions',
    description:
      'Daylight-calibrated cultural spaces engineered for contemplative pacing, acoustic stillness, and monumental artwork installation.',
    deliverables: 'Gallery Sequencing, Daylight Modeling, Exhibition Architecture',
  },
  {
    index: '04',
    title: 'Light & Envelope Engineering',
    discipline: 'Facade Systems · Nocturnal Atmospheres',
    description:
      'Custom anodized louver facades and concealed architectural grazing illumination that transform building presence from noon to midnight.',
    deliverables: 'Facade Louver Systems, Photometric Studies, Architectural Lighting',
  },
];

export const EXPLORER_MATERIALS: ExplorerMaterialOption[] = [
  {
    id: 'concrete',
    label: 'Board-Formed Concrete',
    finish: 'Matte Mineral Charcoal',
    swatchHex: '#3a3d42',
    accentHex: '#94aabf',
    roughness: 0.88,
    metalness: 0.05,
    description: 'Cast in timber formwork with deep horizontal grain relief and raw mineral depth.',
  },
  {
    id: 'travertine',
    label: 'Honed Silver Travertine',
    finish: 'Satin Sedimentary Stone',
    swatchHex: '#9ea3a8',
    accentHex: '#7d92a6',
    roughness: 0.62,
    metalness: 0.04,
    description: 'Vein-cut silver limestone honed to a dry, light-absorbing architectural patina.',
  },
  {
    id: 'titanium',
    label: 'Brushed Architectural Titanium',
    finish: 'Anisotropic Steel Alloy',
    swatchHex: '#6c7580',
    accentHex: '#b6c8d9',
    roughness: 0.3,
    metalness: 0.88,
    description: 'Bead-blasted architectural titanium alloy calibrated for crisp cool specular reflections.',
  },
  {
    id: 'charred',
    label: 'Shou Sugi Ban Cedar',
    finish: 'Carbonized Dark Timber',
    swatchHex: '#1d1f22',
    accentHex: '#8da4b8',
    roughness: 0.78,
    metalness: 0.08,
    description: 'Kiln-charred vertical timber cladding offering velvety light absorption and weather resilience.',
  },
];

export const EXPLORER_CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'perspective',
    label: 'Perspective',
    position: [13.5, 7.2, 14.5],
    target: [0, 2.2, 0],
  },
  {
    id: 'cantilever',
    label: 'Cantilever',
    position: [-12.5, 3.8, 10.5],
    target: [-1.2, 2.6, 0.5],
  },
  {
    id: 'atrium',
    label: 'Atrium',
    position: [6.2, 11.5, 9.8],
    target: [0, 1.8, 0],
  },
  {
    id: 'elevation',
    label: 'Elevation',
    position: [0.2, 3.4, 17.5],
    target: [0, 2.3, 0],
  },
];
