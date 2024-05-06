import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const FactionSymbol = z.enum([
  "COSMIC",
  "VOID",
  "GALACTIC",
  "QUANTUM",
  "DOMINION",
  "ASTRO",
  "CORSAIRS",
  "OBSIDIAN",
  "AEGIS",
  "UNITED",
  "SOLITARY",
  "COBALT",
  "OMEGA",
  "ECHO",
  "LORDS",
  "CULT",
  "ANCIENTS",
  "SHADOW",
  "ETHEREAL",
]);
const register_Body = z
  .object({
    faction: FactionSymbol,
    symbol: z.string().min(3).max(14),
    email: z.string().optional(),
  })
  .passthrough()
  .readonly();
const Agent = z
  .object({
    accountId: z.string().min(1).optional(),
    symbol: z.string().min(3).max(14),
    headquarters: z.string().min(1),
    credits: z.number().int(),
    startingFaction: z.string().min(1),
    shipCount: z.number().int(),
  })
  .passthrough()
  .readonly();
const ContractPayment = z
  .object({ onAccepted: z.number().int(), onFulfilled: z.number().int() })
  .passthrough()
  .readonly();
const ContractDeliverGood = z
  .object({
    tradeSymbol: z.string().min(1),
    destinationSymbol: z.string().min(1),
    unitsRequired: z.number().int(),
    unitsFulfilled: z.number().int(),
  })
  .passthrough()
  .readonly();
const ContractTerms = z
  .object({
    deadline: z.string().datetime({ offset: true }),
    payment: ContractPayment,
    deliver: z.array(ContractDeliverGood).readonly().optional(),
  })
  .passthrough()
  .readonly();
const Contract = z
  .object({
    id: z.string().min(1),
    factionSymbol: z.string().min(1),
    type: z.enum(["PROCUREMENT", "TRANSPORT", "SHUTTLE"]),
    terms: ContractTerms,
    accepted: z.boolean().default(false),
    fulfilled: z.boolean().default(false),
    expiration: z.string().datetime({ offset: true }),
    deadlineToAccept: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough()
  .readonly();
const FactionTraitSymbol = z.enum([
  "BUREAUCRATIC",
  "SECRETIVE",
  "CAPITALISTIC",
  "INDUSTRIOUS",
  "PEACEFUL",
  "DISTRUSTFUL",
  "WELCOMING",
  "SMUGGLERS",
  "SCAVENGERS",
  "REBELLIOUS",
  "EXILES",
  "PIRATES",
  "RAIDERS",
  "CLAN",
  "GUILD",
  "DOMINION",
  "FRINGE",
  "FORSAKEN",
  "ISOLATED",
  "LOCALIZED",
  "ESTABLISHED",
  "NOTABLE",
  "DOMINANT",
  "INESCAPABLE",
  "INNOVATIVE",
  "BOLD",
  "VISIONARY",
  "CURIOUS",
  "DARING",
  "EXPLORATORY",
  "RESOURCEFUL",
  "FLEXIBLE",
  "COOPERATIVE",
  "UNITED",
  "STRATEGIC",
  "INTELLIGENT",
  "RESEARCH_FOCUSED",
  "COLLABORATIVE",
  "PROGRESSIVE",
  "MILITARISTIC",
  "TECHNOLOGICALLY_ADVANCED",
  "AGGRESSIVE",
  "IMPERIALISTIC",
  "TREASURE_HUNTERS",
  "DEXTEROUS",
  "UNPREDICTABLE",
  "BRUTAL",
  "FLEETING",
  "ADAPTABLE",
  "SELF_SUFFICIENT",
  "DEFENSIVE",
  "PROUD",
  "DIVERSE",
  "INDEPENDENT",
  "SELF_INTERESTED",
  "FRAGMENTED",
  "COMMERCIAL",
  "FREE_MARKETS",
  "ENTREPRENEURIAL",
]);
const FactionTrait = z
  .object({
    symbol: FactionTraitSymbol,
    name: z.string(),
    description: z.string(),
  })
  .passthrough()
  .readonly();
const Faction = z
  .object({
    symbol: FactionSymbol,
    name: z.string().min(1),
    description: z.string().min(1),
    headquarters: z.string().min(1),
    traits: z.array(FactionTrait).readonly(),
    isRecruiting: z.boolean(),
  })
  .passthrough()
  .readonly();
const ShipRole = z.enum([
  "FABRICATOR",
  "HARVESTER",
  "HAULER",
  "INTERCEPTOR",
  "EXCAVATOR",
  "TRANSPORT",
  "REPAIR",
  "SURVEYOR",
  "COMMAND",
  "CARRIER",
  "PATROL",
  "SATELLITE",
  "EXPLORER",
  "REFINERY",
]);
const ShipRegistration = z
  .object({
    name: z.string().min(1),
    factionSymbol: z.string().min(1),
    role: ShipRole,
  })
  .passthrough()
  .readonly();
const SystemSymbol = z.string();
const WaypointSymbol = z.string();
const WaypointType = z.enum([
  "PLANET",
  "GAS_GIANT",
  "MOON",
  "ORBITAL_STATION",
  "JUMP_GATE",
  "ASTEROID_FIELD",
  "ASTEROID",
  "ENGINEERED_ASTEROID",
  "ASTEROID_BASE",
  "NEBULA",
  "DEBRIS_FIELD",
  "GRAVITY_WELL",
  "ARTIFICIAL_GRAVITY_WELL",
  "FUEL_STATION",
]);
const ShipNavRouteWaypoint = z
  .object({
    symbol: z.string().min(1),
    type: WaypointType,
    systemSymbol: SystemSymbol.min(1),
    x: z.number().int(),
    y: z.number().int(),
  })
  .passthrough()
  .readonly();
const ShipNavRoute = z
  .object({
    destination: ShipNavRouteWaypoint,
    origin: ShipNavRouteWaypoint,
    departureTime: z.string().datetime({ offset: true }),
    arrival: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();
const ShipNavStatus = z.enum(["IN_TRANSIT", "IN_ORBIT", "DOCKED"]);
const ShipNavFlightMode = z.enum(["DRIFT", "STEALTH", "CRUISE", "BURN"]);
const ShipNav = z
  .object({
    systemSymbol: SystemSymbol.min(1),
    waypointSymbol: WaypointSymbol.min(1),
    route: ShipNavRoute,
    status: ShipNavStatus,
    flightMode: ShipNavFlightMode.default("CRUISE"),
  })
  .passthrough()
  .readonly();
const ShipCrew = z
  .object({
    current: z.number().int(),
    required: z.number().int(),
    capacity: z.number().int(),
    rotation: z.enum(["STRICT", "RELAXED"]).default("STRICT"),
    morale: z.number().int().gte(0).lte(100),
    wages: z.number().int().gte(0),
  })
  .passthrough()
  .readonly();
const ShipComponentCondition = z.number();
const ShipComponentIntegrity = z.number();
const ShipRequirements = z
  .object({
    power: z.number().int(),
    crew: z.number().int(),
    slots: z.number().int(),
  })
  .partial()
  .passthrough()
  .readonly();
const ShipFrame = z
  .object({
    symbol: z.enum([
      "FRAME_PROBE",
      "FRAME_DRONE",
      "FRAME_INTERCEPTOR",
      "FRAME_RACER",
      "FRAME_FIGHTER",
      "FRAME_FRIGATE",
      "FRAME_SHUTTLE",
      "FRAME_EXPLORER",
      "FRAME_MINER",
      "FRAME_LIGHT_FREIGHTER",
      "FRAME_HEAVY_FREIGHTER",
      "FRAME_TRANSPORT",
      "FRAME_DESTROYER",
      "FRAME_CRUISER",
      "FRAME_CARRIER",
    ]),
    name: z.string(),
    description: z.string(),
    condition: ShipComponentCondition.gte(0).lte(1),
    integrity: ShipComponentIntegrity.gte(0).lte(1),
    moduleSlots: z.number().int().gte(0),
    mountingPoints: z.number().int().gte(0),
    fuelCapacity: z.number().int().gte(0),
    requirements: ShipRequirements,
  })
  .passthrough()
  .readonly();
const ShipReactor = z
  .object({
    symbol: z.enum([
      "REACTOR_SOLAR_I",
      "REACTOR_FUSION_I",
      "REACTOR_FISSION_I",
      "REACTOR_CHEMICAL_I",
      "REACTOR_ANTIMATTER_I",
    ]),
    name: z.string(),
    description: z.string(),
    condition: ShipComponentCondition.gte(0).lte(1),
    integrity: ShipComponentIntegrity.gte(0).lte(1),
    powerOutput: z.number().int().gte(1),
    requirements: ShipRequirements,
  })
  .passthrough()
  .readonly();
const ShipEngine = z
  .object({
    symbol: z.enum([
      "ENGINE_IMPULSE_DRIVE_I",
      "ENGINE_ION_DRIVE_I",
      "ENGINE_ION_DRIVE_II",
      "ENGINE_HYPER_DRIVE_I",
    ]),
    name: z.string(),
    description: z.string(),
    condition: ShipComponentCondition.gte(0).lte(1),
    integrity: ShipComponentIntegrity.gte(0).lte(1),
    speed: z.number().int().gte(1),
    requirements: ShipRequirements,
  })
  .passthrough()
  .readonly();
const Cooldown = z
  .object({
    shipSymbol: z.string().min(1),
    totalSeconds: z.number().int().gte(0),
    remainingSeconds: z.number().int().gte(0),
    expiration: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough()
  .readonly();
const ShipModule = z
  .object({
    symbol: z.enum([
      "MODULE_MINERAL_PROCESSOR_I",
      "MODULE_GAS_PROCESSOR_I",
      "MODULE_CARGO_HOLD_I",
      "MODULE_CARGO_HOLD_II",
      "MODULE_CARGO_HOLD_III",
      "MODULE_CREW_QUARTERS_I",
      "MODULE_ENVOY_QUARTERS_I",
      "MODULE_PASSENGER_CABIN_I",
      "MODULE_MICRO_REFINERY_I",
      "MODULE_ORE_REFINERY_I",
      "MODULE_FUEL_REFINERY_I",
      "MODULE_SCIENCE_LAB_I",
      "MODULE_JUMP_DRIVE_I",
      "MODULE_JUMP_DRIVE_II",
      "MODULE_JUMP_DRIVE_III",
      "MODULE_WARP_DRIVE_I",
      "MODULE_WARP_DRIVE_II",
      "MODULE_WARP_DRIVE_III",
      "MODULE_SHIELD_GENERATOR_I",
      "MODULE_SHIELD_GENERATOR_II",
    ]),
    capacity: z.number().int().gte(0).optional(),
    range: z.number().int().gte(0).optional(),
    name: z.string(),
    description: z.string(),
    requirements: ShipRequirements,
  })
  .passthrough()
  .readonly();
const ShipMount = z
  .object({
    symbol: z.enum([
      "MOUNT_GAS_SIPHON_I",
      "MOUNT_GAS_SIPHON_II",
      "MOUNT_GAS_SIPHON_III",
      "MOUNT_SURVEYOR_I",
      "MOUNT_SURVEYOR_II",
      "MOUNT_SURVEYOR_III",
      "MOUNT_SENSOR_ARRAY_I",
      "MOUNT_SENSOR_ARRAY_II",
      "MOUNT_SENSOR_ARRAY_III",
      "MOUNT_MINING_LASER_I",
      "MOUNT_MINING_LASER_II",
      "MOUNT_MINING_LASER_III",
      "MOUNT_LASER_CANNON_I",
      "MOUNT_MISSILE_LAUNCHER_I",
      "MOUNT_TURRET_I",
    ]),
    name: z.string(),
    description: z.string().optional(),
    strength: z.number().int().gte(0).optional(),
    deposits: z
      .array(
        z.enum([
          "QUARTZ_SAND",
          "SILICON_CRYSTALS",
          "PRECIOUS_STONES",
          "ICE_WATER",
          "AMMONIA_ICE",
          "IRON_ORE",
          "COPPER_ORE",
          "SILVER_ORE",
          "ALUMINUM_ORE",
          "GOLD_ORE",
          "PLATINUM_ORE",
          "DIAMONDS",
          "URANITE_ORE",
          "MERITIUM_ORE",
        ]),
      )
      .readonly()
      .optional(),
    requirements: ShipRequirements,
  })
  .passthrough()
  .readonly();
const TradeSymbol = z.enum([
  "PRECIOUS_STONES",
  "QUARTZ_SAND",
  "SILICON_CRYSTALS",
  "AMMONIA_ICE",
  "LIQUID_HYDROGEN",
  "LIQUID_NITROGEN",
  "ICE_WATER",
  "EXOTIC_MATTER",
  "ADVANCED_CIRCUITRY",
  "GRAVITON_EMITTERS",
  "IRON",
  "IRON_ORE",
  "COPPER",
  "COPPER_ORE",
  "ALUMINUM",
  "ALUMINUM_ORE",
  "SILVER",
  "SILVER_ORE",
  "GOLD",
  "GOLD_ORE",
  "PLATINUM",
  "PLATINUM_ORE",
  "DIAMONDS",
  "URANITE",
  "URANITE_ORE",
  "MERITIUM",
  "MERITIUM_ORE",
  "HYDROCARBON",
  "ANTIMATTER",
  "FAB_MATS",
  "FERTILIZERS",
  "FABRICS",
  "FOOD",
  "JEWELRY",
  "MACHINERY",
  "FIREARMS",
  "ASSAULT_RIFLES",
  "MILITARY_EQUIPMENT",
  "EXPLOSIVES",
  "LAB_INSTRUMENTS",
  "AMMUNITION",
  "ELECTRONICS",
  "SHIP_PLATING",
  "SHIP_PARTS",
  "EQUIPMENT",
  "FUEL",
  "MEDICINE",
  "DRUGS",
  "CLOTHING",
  "MICROPROCESSORS",
  "PLASTICS",
  "POLYNUCLEOTIDES",
  "BIOCOMPOSITES",
  "QUANTUM_STABILIZERS",
  "NANOBOTS",
  "AI_MAINFRAMES",
  "QUANTUM_DRIVES",
  "ROBOTIC_DRONES",
  "CYBER_IMPLANTS",
  "GENE_THERAPEUTICS",
  "NEURAL_CHIPS",
  "MOOD_REGULATORS",
  "VIRAL_AGENTS",
  "MICRO_FUSION_GENERATORS",
  "SUPERGRAINS",
  "LASER_RIFLES",
  "HOLOGRAPHICS",
  "SHIP_SALVAGE",
  "RELIC_TECH",
  "NOVEL_LIFEFORMS",
  "BOTANICAL_SPECIMENS",
  "CULTURAL_ARTIFACTS",
  "FRAME_PROBE",
  "FRAME_DRONE",
  "FRAME_INTERCEPTOR",
  "FRAME_RACER",
  "FRAME_FIGHTER",
  "FRAME_FRIGATE",
  "FRAME_SHUTTLE",
  "FRAME_EXPLORER",
  "FRAME_MINER",
  "FRAME_LIGHT_FREIGHTER",
  "FRAME_HEAVY_FREIGHTER",
  "FRAME_TRANSPORT",
  "FRAME_DESTROYER",
  "FRAME_CRUISER",
  "FRAME_CARRIER",
  "REACTOR_SOLAR_I",
  "REACTOR_FUSION_I",
  "REACTOR_FISSION_I",
  "REACTOR_CHEMICAL_I",
  "REACTOR_ANTIMATTER_I",
  "ENGINE_IMPULSE_DRIVE_I",
  "ENGINE_ION_DRIVE_I",
  "ENGINE_ION_DRIVE_II",
  "ENGINE_HYPER_DRIVE_I",
  "MODULE_MINERAL_PROCESSOR_I",
  "MODULE_GAS_PROCESSOR_I",
  "MODULE_CARGO_HOLD_I",
  "MODULE_CARGO_HOLD_II",
  "MODULE_CARGO_HOLD_III",
  "MODULE_CREW_QUARTERS_I",
  "MODULE_ENVOY_QUARTERS_I",
  "MODULE_PASSENGER_CABIN_I",
  "MODULE_MICRO_REFINERY_I",
  "MODULE_SCIENCE_LAB_I",
  "MODULE_JUMP_DRIVE_I",
  "MODULE_JUMP_DRIVE_II",
  "MODULE_JUMP_DRIVE_III",
  "MODULE_WARP_DRIVE_I",
  "MODULE_WARP_DRIVE_II",
  "MODULE_WARP_DRIVE_III",
  "MODULE_SHIELD_GENERATOR_I",
  "MODULE_SHIELD_GENERATOR_II",
  "MODULE_ORE_REFINERY_I",
  "MODULE_FUEL_REFINERY_I",
  "MOUNT_GAS_SIPHON_I",
  "MOUNT_GAS_SIPHON_II",
  "MOUNT_GAS_SIPHON_III",
  "MOUNT_SURVEYOR_I",
  "MOUNT_SURVEYOR_II",
  "MOUNT_SURVEYOR_III",
  "MOUNT_SENSOR_ARRAY_I",
  "MOUNT_SENSOR_ARRAY_II",
  "MOUNT_SENSOR_ARRAY_III",
  "MOUNT_MINING_LASER_I",
  "MOUNT_MINING_LASER_II",
  "MOUNT_MINING_LASER_III",
  "MOUNT_LASER_CANNON_I",
  "MOUNT_MISSILE_LAUNCHER_I",
  "MOUNT_TURRET_I",
  "SHIP_PROBE",
  "SHIP_MINING_DRONE",
  "SHIP_SIPHON_DRONE",
  "SHIP_INTERCEPTOR",
  "SHIP_LIGHT_HAULER",
  "SHIP_COMMAND_FRIGATE",
  "SHIP_EXPLORER",
  "SHIP_HEAVY_FREIGHTER",
  "SHIP_LIGHT_SHUTTLE",
  "SHIP_ORE_HOUND",
  "SHIP_REFINING_FREIGHTER",
  "SHIP_SURVEYOR",
]);
const ShipCargoItem = z
  .object({
    symbol: TradeSymbol,
    name: z.string(),
    description: z.string(),
    units: z.number().int().gte(1),
  })
  .passthrough()
  .readonly();
const ShipCargo = z
  .object({
    capacity: z.number().int().gte(0),
    units: z.number().int().gte(0),
    inventory: z.array(ShipCargoItem).readonly(),
  })
  .passthrough()
  .readonly();
const ShipFuel = z
  .object({
    current: z.number().int().gte(0),
    capacity: z.number().int().gte(0),
    consumed: z
      .object({
        amount: z.number().int().gte(0),
        timestamp: z.string().datetime({ offset: true }),
      })
      .passthrough()
      .readonly()
      .optional(),
  })
  .passthrough()
  .readonly();
const Ship = z
  .object({
    symbol: z.string(),
    registration: ShipRegistration,
    nav: ShipNav,
    crew: ShipCrew,
    frame: ShipFrame,
    reactor: ShipReactor,
    engine: ShipEngine,
    cooldown: Cooldown,
    modules: z.array(ShipModule).readonly(),
    mounts: z.array(ShipMount).readonly(),
    cargo: ShipCargo,
    fuel: ShipFuel,
  })
  .passthrough()
  .readonly();
const SystemType = z.enum([
  "NEUTRON_STAR",
  "RED_STAR",
  "ORANGE_STAR",
  "BLUE_STAR",
  "YOUNG_STAR",
  "WHITE_DWARF",
  "BLACK_HOLE",
  "HYPERGIANT",
  "NEBULA",
  "UNSTABLE",
]);
const WaypointOrbital = z
  .object({ symbol: z.string().min(1) })
  .passthrough()
  .readonly();
const SystemWaypoint = z
  .object({
    symbol: WaypointSymbol.min(1),
    type: WaypointType,
    x: z.number().int(),
    y: z.number().int(),
    orbitals: z.array(WaypointOrbital).readonly(),
    orbits: z.string().min(1).optional(),
  })
  .passthrough()
  .readonly();
const SystemFaction = z
  .object({ symbol: FactionSymbol })
  .passthrough()
  .readonly();
const System = z
  .object({
    symbol: z.string().min(1),
    sectorSymbol: z.string().min(1),
    type: SystemType,
    x: z.number().int(),
    y: z.number().int(),
    waypoints: z.array(SystemWaypoint).readonly(),
    factions: z.array(SystemFaction).readonly(),
  })
  .passthrough()
  .readonly();
const Meta = z
  .object({
    total: z.number().int().gte(0),
    page: z.number().int().gte(1).default(1),
    limit: z.number().int().gte(1).lte(20).default(10),
  })
  .passthrough()
  .readonly();
const WaypointTraitSymbol = z.enum([
  "UNCHARTED",
  "UNDER_CONSTRUCTION",
  "MARKETPLACE",
  "SHIPYARD",
  "OUTPOST",
  "SCATTERED_SETTLEMENTS",
  "SPRAWLING_CITIES",
  "MEGA_STRUCTURES",
  "PIRATE_BASE",
  "OVERCROWDED",
  "HIGH_TECH",
  "CORRUPT",
  "BUREAUCRATIC",
  "TRADING_HUB",
  "INDUSTRIAL",
  "BLACK_MARKET",
  "RESEARCH_FACILITY",
  "MILITARY_BASE",
  "SURVEILLANCE_OUTPOST",
  "EXPLORATION_OUTPOST",
  "MINERAL_DEPOSITS",
  "COMMON_METAL_DEPOSITS",
  "PRECIOUS_METAL_DEPOSITS",
  "RARE_METAL_DEPOSITS",
  "METHANE_POOLS",
  "ICE_CRYSTALS",
  "EXPLOSIVE_GASES",
  "STRONG_MAGNETOSPHERE",
  "VIBRANT_AURORAS",
  "SALT_FLATS",
  "CANYONS",
  "PERPETUAL_DAYLIGHT",
  "PERPETUAL_OVERCAST",
  "DRY_SEABEDS",
  "MAGMA_SEAS",
  "SUPERVOLCANOES",
  "ASH_CLOUDS",
  "VAST_RUINS",
  "MUTATED_FLORA",
  "TERRAFORMED",
  "EXTREME_TEMPERATURES",
  "EXTREME_PRESSURE",
  "DIVERSE_LIFE",
  "SCARCE_LIFE",
  "FOSSILS",
  "WEAK_GRAVITY",
  "STRONG_GRAVITY",
  "CRUSHING_GRAVITY",
  "TOXIC_ATMOSPHERE",
  "CORROSIVE_ATMOSPHERE",
  "BREATHABLE_ATMOSPHERE",
  "THIN_ATMOSPHERE",
  "JOVIAN",
  "ROCKY",
  "VOLCANIC",
  "FROZEN",
  "SWAMP",
  "BARREN",
  "TEMPERATE",
  "JUNGLE",
  "OCEAN",
  "RADIOACTIVE",
  "MICRO_GRAVITY_ANOMALIES",
  "DEBRIS_CLUSTER",
  "DEEP_CRATERS",
  "SHALLOW_CRATERS",
  "UNSTABLE_COMPOSITION",
  "HOLLOWED_INTERIOR",
  "STRIPPED",
]);
const traits = z
  .union([WaypointTraitSymbol, z.array(WaypointTraitSymbol).readonly()])
  .optional();
const WaypointFaction = z
  .object({ symbol: FactionSymbol })
  .passthrough()
  .readonly();
const WaypointTrait = z
  .object({
    symbol: WaypointTraitSymbol,
    name: z.string(),
    description: z.string(),
  })
  .passthrough()
  .readonly();
const WaypointModifierSymbol = z.enum([
  "STRIPPED",
  "UNSTABLE",
  "RADIATION_LEAK",
  "CRITICAL_LIMIT",
  "CIVIL_UNREST",
]);
const WaypointModifier = z
  .object({
    symbol: WaypointModifierSymbol,
    name: z.string(),
    description: z.string(),
  })
  .passthrough()
  .readonly();
const Chart = z
  .object({
    waypointSymbol: WaypointSymbol.min(1),
    submittedBy: z.string(),
    submittedOn: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough()
  .readonly();
const Waypoint = z
  .object({
    symbol: WaypointSymbol.min(1),
    type: WaypointType,
    systemSymbol: SystemSymbol.min(1),
    x: z.number().int(),
    y: z.number().int(),
    orbitals: z.array(WaypointOrbital).readonly(),
    orbits: z.string().min(1).optional(),
    faction: WaypointFaction.optional(),
    traits: z.array(WaypointTrait).readonly(),
    modifiers: z.array(WaypointModifier).readonly().optional(),
    chart: Chart.optional(),
    isUnderConstruction: z.boolean(),
  })
  .passthrough()
  .readonly();
const TradeGood = z
  .object({ symbol: TradeSymbol, name: z.string(), description: z.string() })
  .passthrough()
  .readonly();
const MarketTransaction = z
  .object({
    waypointSymbol: WaypointSymbol.min(1),
    shipSymbol: z.string(),
    tradeSymbol: z.string(),
    type: z.enum(["PURCHASE", "SELL"]),
    units: z.number().int().gte(0),
    pricePerUnit: z.number().int().gte(0),
    totalPrice: z.number().int().gte(0),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();
const SupplyLevel = z.enum([
  "SCARCE",
  "LIMITED",
  "MODERATE",
  "HIGH",
  "ABUNDANT",
]);
const ActivityLevel = z.enum(["WEAK", "GROWING", "STRONG", "RESTRICTED"]);
const MarketTradeGood = z
  .object({
    symbol: TradeSymbol,
    type: z.enum(["EXPORT", "IMPORT", "EXCHANGE"]),
    tradeVolume: z.number().int().gte(1),
    supply: SupplyLevel,
    activity: ActivityLevel.optional(),
    purchasePrice: z.number().int().gte(0),
    sellPrice: z.number().int().gte(0),
  })
  .passthrough()
  .readonly();
const Market = z
  .object({
    symbol: z.string(),
    exports: z.array(TradeGood).readonly(),
    imports: z.array(TradeGood).readonly(),
    exchange: z.array(TradeGood).readonly(),
    transactions: z.array(MarketTransaction).readonly().optional(),
    tradeGoods: z.array(MarketTradeGood).readonly().optional(),
  })
  .passthrough()
  .readonly();
const ShipType = z.enum([
  "SHIP_PROBE",
  "SHIP_MINING_DRONE",
  "SHIP_SIPHON_DRONE",
  "SHIP_INTERCEPTOR",
  "SHIP_LIGHT_HAULER",
  "SHIP_COMMAND_FRIGATE",
  "SHIP_EXPLORER",
  "SHIP_HEAVY_FREIGHTER",
  "SHIP_LIGHT_SHUTTLE",
  "SHIP_ORE_HOUND",
  "SHIP_REFINING_FREIGHTER",
  "SHIP_SURVEYOR",
]);
const ShipyardTransaction = z
  .object({
    waypointSymbol: WaypointSymbol.min(1),
    shipSymbol: z.string(),
    shipType: z.string(),
    price: z.number().int().gte(0),
    agentSymbol: z.string(),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();
const ShipyardShip = z
  .object({
    type: ShipType,
    name: z.string(),
    description: z.string(),
    supply: SupplyLevel,
    activity: ActivityLevel.optional(),
    purchasePrice: z.number().int(),
    frame: ShipFrame,
    reactor: ShipReactor,
    engine: ShipEngine,
    modules: z.array(ShipModule).readonly(),
    mounts: z.array(ShipMount).readonly(),
    crew: z
      .object({ required: z.number().int(), capacity: z.number().int() })
      .passthrough()
      .readonly(),
  })
  .passthrough()
  .readonly();
const Shipyard = z
  .object({
    symbol: z.string().min(1),
    shipTypes: z
      .array(z.object({ type: ShipType }).passthrough().readonly())
      .readonly(),
    transactions: z.array(ShipyardTransaction).readonly().optional(),
    ships: z.array(ShipyardShip).readonly().optional(),
    modificationsFee: z.number().int(),
  })
  .passthrough()
  .readonly();
const JumpGate = z
  .object({
    symbol: WaypointSymbol.min(1),
    connections: z.array(z.string()).readonly(),
  })
  .passthrough()
  .readonly();
const ConstructionMaterial = z
  .object({
    tradeSymbol: TradeSymbol,
    required: z.number().int(),
    fulfilled: z.number().int(),
  })
  .passthrough()
  .readonly();
const Construction = z
  .object({
    symbol: z.string(),
    materials: z.array(ConstructionMaterial).readonly(),
    isComplete: z.boolean(),
  })
  .passthrough()
  .readonly();
const supply_construction_Body = z
  .object({
    shipSymbol: z.string(),
    tradeSymbol: z.string(),
    units: z.number().int(),
  })
  .passthrough()
  .readonly();
const purchase_ship_Body = z
  .object({ shipType: ShipType, waypointSymbol: z.string() })
  .passthrough()
  .readonly();
const ship_refine_Body = z
  .object({
    produce: z.enum([
      "IRON",
      "COPPER",
      "SILVER",
      "GOLD",
      "ALUMINUM",
      "PLATINUM",
      "URANITE",
      "MERITIUM",
      "FUEL",
    ]),
  })
  .passthrough()
  .readonly();
const SurveyDeposit = z.object({ symbol: z.string() }).passthrough().readonly();
const Survey = z
  .object({
    signature: z.string().min(1),
    symbol: z.string().min(1),
    deposits: z.array(SurveyDeposit).readonly(),
    expiration: z.string().datetime({ offset: true }),
    size: z.enum(["SMALL", "MODERATE", "LARGE"]),
  })
  .passthrough()
  .readonly();
const extract_resources_Body = z
  .object({ survey: Survey })
  .partial()
  .passthrough()
  .readonly();
const ExtractionYield = z
  .object({ symbol: TradeSymbol, units: z.number().int() })
  .passthrough()
  .readonly();
const Extraction = z
  .object({ shipSymbol: z.string().min(1), yield: ExtractionYield })
  .passthrough()
  .readonly();
const ShipConditionEvent = z
  .object({
    symbol: z.enum([
      "REACTOR_OVERLOAD",
      "ENERGY_SPIKE_FROM_MINERAL",
      "SOLAR_FLARE_INTERFERENCE",
      "COOLANT_LEAK",
      "POWER_DISTRIBUTION_FLUCTUATION",
      "MAGNETIC_FIELD_DISRUPTION",
      "HULL_MICROMETEORITE_STRIKES",
      "STRUCTURAL_STRESS_FRACTURES",
      "CORROSIVE_MINERAL_CONTAMINATION",
      "THERMAL_EXPANSION_MISMATCH",
      "VIBRATION_DAMAGE_FROM_DRILLING",
      "ELECTROMAGNETIC_FIELD_INTERFERENCE",
      "IMPACT_WITH_EXTRACTED_DEBRIS",
      "FUEL_EFFICIENCY_DEGRADATION",
      "COOLANT_SYSTEM_AGEING",
      "DUST_MICROABRASIONS",
      "THRUSTER_NOZZLE_WEAR",
      "EXHAUST_PORT_CLOGGING",
      "BEARING_LUBRICATION_FADE",
      "SENSOR_CALIBRATION_DRIFT",
      "HULL_MICROMETEORITE_DAMAGE",
      "SPACE_DEBRIS_COLLISION",
      "THERMAL_STRESS",
      "VIBRATION_OVERLOAD",
      "PRESSURE_DIFFERENTIAL_STRESS",
      "ELECTROMAGNETIC_SURGE_EFFECTS",
      "ATMOSPHERIC_ENTRY_HEAT",
    ]),
    component: z.enum(["FRAME", "REACTOR", "ENGINE"]),
    name: z.string(),
    description: z.string(),
  })
  .passthrough()
  .readonly();
const SiphonYield = z
  .object({ symbol: TradeSymbol, units: z.number().int() })
  .passthrough()
  .readonly();
const Siphon = z
  .object({ shipSymbol: z.string().min(1), yield: SiphonYield })
  .passthrough()
  .readonly();
const jettison_Body = z
  .object({ symbol: TradeSymbol, units: z.number().int().gte(1) })
  .passthrough()
  .readonly();
const patch_ship_nav_Body = z
  .object({ flightMode: ShipNavFlightMode.default("CRUISE") })
  .partial()
  .passthrough()
  .readonly();
const sell_cargo_Body = z
  .object({ symbol: TradeSymbol, units: z.number().int() })
  .passthrough()
  .readonly();
const ScannedSystem = z
  .object({
    symbol: z.string().min(1),
    sectorSymbol: z.string().min(1),
    type: SystemType,
    x: z.number().int(),
    y: z.number().int(),
    distance: z.number().int(),
  })
  .passthrough()
  .readonly();
const ScannedWaypoint = z
  .object({
    symbol: WaypointSymbol.min(1),
    type: WaypointType,
    systemSymbol: SystemSymbol.min(1),
    x: z.number().int(),
    y: z.number().int(),
    orbitals: z.array(WaypointOrbital).readonly(),
    faction: WaypointFaction.optional(),
    traits: z.array(WaypointTrait).readonly(),
    chart: Chart.optional(),
  })
  .passthrough()
  .readonly();
const ScannedShip = z
  .object({
    symbol: z.string(),
    registration: ShipRegistration,
    nav: ShipNav,
    frame: z.object({ symbol: z.string() }).passthrough().readonly().optional(),
    reactor: z
      .object({ symbol: z.string() })
      .passthrough()
      .readonly()
      .optional(),
    engine: z.object({ symbol: z.string() }).passthrough().readonly(),
    mounts: z
      .array(z.object({ symbol: z.string() }).passthrough().readonly())
      .readonly()
      .optional(),
  })
  .passthrough()
  .readonly();
const refuel_ship_Body = z
  .object({ units: z.number().int().gte(1), fromCargo: z.boolean() })
  .partial()
  .passthrough()
  .readonly();
const transfer_cargo_Body = z
  .object({
    tradeSymbol: TradeSymbol,
    units: z.number().int(),
    shipSymbol: z.string(),
  })
  .passthrough()
  .readonly();
const ShipModificationTransaction = z
  .object({
    waypointSymbol: z.string(),
    shipSymbol: z.string(),
    tradeSymbol: z.string(),
    totalPrice: z.number().int().gte(0),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();
const ScrapTransaction = z
  .object({
    waypointSymbol: WaypointSymbol.min(1),
    shipSymbol: z.string(),
    totalPrice: z.number().int().gte(0),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();
const RepairTransaction = z
  .object({
    waypointSymbol: WaypointSymbol.min(1),
    shipSymbol: z.string(),
    totalPrice: z.number().int().gte(0),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough()
  .readonly();

export const schemas = {
  FactionSymbol,
  register_Body,
  Agent,
  ContractPayment,
  ContractDeliverGood,
  ContractTerms,
  Contract,
  FactionTraitSymbol,
  FactionTrait,
  Faction,
  ShipRole,
  ShipRegistration,
  SystemSymbol,
  WaypointSymbol,
  WaypointType,
  ShipNavRouteWaypoint,
  ShipNavRoute,
  ShipNavStatus,
  ShipNavFlightMode,
  ShipNav,
  ShipCrew,
  ShipComponentCondition,
  ShipComponentIntegrity,
  ShipRequirements,
  ShipFrame,
  ShipReactor,
  ShipEngine,
  Cooldown,
  ShipModule,
  ShipMount,
  TradeSymbol,
  ShipCargoItem,
  ShipCargo,
  ShipFuel,
  Ship,
  SystemType,
  WaypointOrbital,
  SystemWaypoint,
  SystemFaction,
  System,
  Meta,
  WaypointTraitSymbol,
  traits,
  WaypointFaction,
  WaypointTrait,
  WaypointModifierSymbol,
  WaypointModifier,
  Chart,
  Waypoint,
  TradeGood,
  MarketTransaction,
  SupplyLevel,
  ActivityLevel,
  MarketTradeGood,
  Market,
  ShipType,
  ShipyardTransaction,
  ShipyardShip,
  Shipyard,
  JumpGate,
  ConstructionMaterial,
  Construction,
  supply_construction_Body,
  purchase_ship_Body,
  ship_refine_Body,
  SurveyDeposit,
  Survey,
  extract_resources_Body,
  ExtractionYield,
  Extraction,
  ShipConditionEvent,
  SiphonYield,
  Siphon,
  jettison_Body,
  patch_ship_nav_Body,
  sell_cargo_Body,
  ScannedSystem,
  ScannedWaypoint,
  ScannedShip,
  refuel_ship_Body,
  transfer_cargo_Body,
  ShipModificationTransaction,
  ScrapTransaction,
  RepairTransaction,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/",
    alias: "getStatus",
    description: `Return the status of the game server.
This also includes a few global elements, such as announcements, server reset dates and leaderboards.`,
    requestFormat: "json",
    response: z
      .object({
        status: z.string(),
        version: z.string(),
        resetDate: z.string(),
        description: z.string(),
        stats: z
          .object({
            agents: z.number().int(),
            ships: z.number().int(),
            systems: z.number().int(),
            waypoints: z.number().int(),
          })
          .passthrough()
          .readonly(),
        leaderboards: z
          .object({
            mostCredits: z
              .array(
                z
                  .object({
                    agentSymbol: z.string(),
                    credits: z.number().int(),
                  })
                  .passthrough()
                  .readonly(),
              )
              .readonly(),
            mostSubmittedCharts: z
              .array(
                z
                  .object({
                    agentSymbol: z.string(),
                    chartCount: z.number().int(),
                  })
                  .passthrough()
                  .readonly(),
              )
              .readonly(),
          })
          .passthrough()
          .readonly(),
        serverResets: z
          .object({ next: z.string(), frequency: z.string() })
          .passthrough()
          .readonly(),
        announcements: z
          .array(
            z
              .object({ title: z.string(), body: z.string() })
              .passthrough()
              .readonly(),
          )
          .readonly(),
        links: z
          .array(
            z
              .object({ name: z.string(), url: z.string() })
              .passthrough()
              .readonly(),
          )
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/agents",
    alias: "getAgents",
    description: `Fetch agents details.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: z
      .object({ data: z.array(Agent).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/agents/:agentSymbol",
    alias: "getAgent",
    description: `Fetch agent details.`,
    requestFormat: "json",
    parameters: [
      {
        name: "agentSymbol",
        type: "Path",
        schema: z.string().default("FEBA66"),
      },
    ],
    response: z.object({ data: Agent }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/factions",
    alias: "getFactions",
    description: `Return a paginated list of all the factions in the game.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: z
      .object({ data: z.array(Faction).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/factions/:factionSymbol",
    alias: "getFaction",
    description: `View the details of a faction.`,
    requestFormat: "json",
    parameters: [
      {
        name: "factionSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Faction }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/my/agent",
    alias: "getMyAgent",
    description: `Fetch your agent&#x27;s details.`,
    requestFormat: "json",
    response: z.object({ data: Agent }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/my/contracts",
    alias: "getContracts",
    description: `Return a paginated list of all your contracts.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: z
      .object({ data: z.array(Contract).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/contracts/:contractId",
    alias: "getContract",
    description: `Get the details of a contract by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Contract }).passthrough().readonly(),
  },
  {
    method: "post",
    path: "/my/contracts/:contractId/accept",
    alias: "acceptContract",
    description: `Accept a contract by ID. 

You can only accept contracts that were offered to you, were not accepted yet, and whose deadlines has not passed yet.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ agent: Agent, contract: Contract })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/contracts/:contractId/deliver",
    alias: "deliverContract",
    description: `Deliver cargo to a contract.

In order to use this API, a ship must be at the delivery location (denoted in the delivery terms as &#x60;destinationSymbol&#x60; of a contract) and must have a number of units of a good required by this contract in its cargo.

Cargo that was delivered will be removed from the ship&#x27;s cargo.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: supply_construction_Body,
      },
      {
        name: "contractId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ contract: Contract, cargo: ShipCargo })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/contracts/:contractId/fulfill",
    alias: "fulfillContract",
    description: `Fulfill a contract. Can only be used on contracts that have all of their delivery terms fulfilled.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ agent: Agent, contract: Contract })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships",
    alias: "getMyShips",
    description: `Return a paginated list of all of ships under your agent&#x27;s ownership.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: z
      .object({ data: z.array(Ship).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships",
    alias: "purchaseShip",
    description: `Purchase a ship from a Shipyard. In order to use this function, a ship under your agent&#x27;s ownership must be in a waypoint that has the &#x60;Shipyard&#x60; trait, and the Shipyard must sell the type of the desired ship.

Shipyards typically offer ship types, which are predefined templates of ships that have dedicated roles. A template comes with a preset of an engine, a reactor, and a frame. It may also include a few modules and mounts.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: purchase_ship_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            ship: Ship,
            transaction: ShipyardTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol",
    alias: "getMyShip",
    description: `Retrieve the details of a ship under your agent&#x27;s ownership.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Ship }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/cargo",
    alias: "getMyShipCargo",
    description: `Retrieve the cargo of a ship under your agent&#x27;s ownership.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: ShipCargo }).passthrough().readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/chart",
    alias: "createChart",
    description: `Command a ship to chart the waypoint at its current location.

Most waypoints in the universe are uncharted by default. These waypoints have their traits hidden until they have been charted by a ship.

Charting a waypoint will record your agent as the one who created the chart, and all other agents would also be able to see the waypoint&#x27;s traits.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ chart: Chart, waypoint: Waypoint })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/cooldown",
    alias: "getShipCooldown",
    description: `Retrieve the details of your ship&#x27;s reactor cooldown. Some actions such as activating your jump drive, scanning, or extracting resources taxes your reactor and results in a cooldown.

Your ship cannot perform additional actions until your cooldown has expired. The duration of your cooldown is relative to the power consumption of the related modules or mounts for the action taken.

Response returns a 204 status code (no-content) when the ship has no cooldown.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Cooldown }).passthrough().readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/dock",
    alias: "dockShip",
    description: `Attempt to dock your ship at its current location. Docking will only succeed if your ship is capable of docking at the time of the request.

Docked ships can access elements in their current location, such as the market or a shipyard, but cannot do actions that require the ship to be above surface such as navigating or extracting.

The endpoint is idempotent - successive calls will succeed even if the ship is already docked.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ data: z.object({ nav: ShipNav }).passthrough().readonly() })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/extract",
    alias: "extractResources",
    description: `Extract resources from a waypoint that can be extracted, such as asteroid fields, into your ship. Send an optional survey as the payload to target specific yields.

The ship must be in orbit to be able to extract and must have mining equipments installed that can extract goods, such as the &#x60;Gas Siphon&#x60; mount for gas-based goods or &#x60;Mining Laser&#x60; mount for ore-based goods.

The survey property is now deprecated. See the &#x60;extract/survey&#x60; endpoint for more details.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: extract_resources_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            extraction: Extraction,
            cargo: ShipCargo,
            events: z.array(ShipConditionEvent).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/extract/survey",
    alias: "extractResourcesWithSurvey",
    description: `Use a survey when extracting resources from a waypoint. This endpoint requires a survey as the payload, which allows your ship to extract specific yields.

Send the full survey object as the payload which will be validated according to the signature. If the signature is invalid, or any properties of the survey are changed, the request will fail.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Survey,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            extraction: Extraction,
            cargo: ShipCargo,
            events: z.array(ShipConditionEvent).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/jettison",
    alias: "jettison",
    description: `Jettison cargo from your ship&#x27;s cargo hold.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: jettison_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ data: z.object({ cargo: ShipCargo }).passthrough().readonly() })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/jump",
    alias: "jumpShip",
    description: `Jump your ship instantly to a target connected waypoint. The ship must be in orbit to execute a jump.

A unit of antimatter is purchased and consumed from the market when jumping. The price of antimatter is determined by the market and is subject to change. A ship can only jump to connected waypoints`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ waypointSymbol: z.string() })
          .passthrough()
          .readonly(),
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            nav: ShipNav,
            cooldown: Cooldown,
            transaction: MarketTransaction,
            agent: Agent,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/mounts",
    alias: "getMounts",
    description: `Get the mounts installed on a ship.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ data: z.array(ShipMount).readonly() })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/mounts/install",
    alias: "installMount",
    description: `Install a mount on a ship.

In order to install a mount, the ship must be docked and located in a waypoint that has a &#x60;Shipyard&#x60; trait. The ship also must have the mount to install in its cargo hold.

An installation fee will be deduced by the Shipyard for installing the mount on the ship. `,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ symbol: z.string() }).passthrough().readonly(),
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            mounts: z.array(ShipMount).readonly(),
            cargo: ShipCargo,
            transaction: ShipModificationTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/mounts/remove",
    alias: "removeMount",
    description: `Remove a mount from a ship.

The ship must be docked in a waypoint that has the &#x60;Shipyard&#x60; trait, and must have the desired mount that it wish to remove installed.

A removal fee will be deduced from the agent by the Shipyard.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ symbol: z.string() }).passthrough().readonly(),
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            mounts: z.array(ShipMount).readonly(),
            cargo: ShipCargo,
            transaction: ShipModificationTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "patch",
    path: "/my/ships/:shipSymbol/nav",
    alias: "patchShipNav",
    description: `Update the nav configuration of a ship.

Currently only supports configuring the Flight Mode of the ship, which affects its speed and fuel consumption.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patch_ship_nav_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: ShipNav }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/nav",
    alias: "getShipNav",
    description: `Get the current nav status of a ship.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: ShipNav }).passthrough().readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/navigate",
    alias: "navigateShip",
    description: `Navigate to a target destination. The ship must be in orbit to use this function. The destination waypoint must be within the same system as the ship&#x27;s current location. Navigating will consume the necessary fuel from the ship&#x27;s manifest based on the distance to the target waypoint.

The returned response will detail the route information including the expected time of arrival. Most ship actions are unavailable until the ship has arrived at it&#x27;s destination.

To travel between systems, see the ship&#x27;s Warp or Jump actions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ waypointSymbol: z.string() })
          .passthrough()
          .readonly(),
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            fuel: ShipFuel,
            nav: ShipNav,
            events: z.array(ShipConditionEvent).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/negotiate/contract",
    alias: "negotiateContract",
    description: `Negotiate a new contract with the HQ.

In order to negotiate a new contract, an agent must not have ongoing or offered contracts over the allowed maximum amount. Currently the maximum contracts an agent can have at a time is 1.

Once a contract is negotiated, it is added to the list of contracts offered to the agent, which the agent can then accept. 

The ship must be present at any waypoint with a faction present to negotiate a contract with that faction.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z.object({ contract: Contract }).passthrough().readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/orbit",
    alias: "orbitShip",
    description: `Attempt to move your ship into orbit at its current location. The request will only succeed if your ship is capable of moving into orbit at the time of the request.

Orbiting ships are able to do actions that require the ship to be above surface such as navigating or extracting, but cannot access elements in their current waypoint, such as the market or a shipyard.

The endpoint is idempotent - successive calls will succeed even if the ship is already in orbit.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ data: z.object({ nav: ShipNav }).passthrough().readonly() })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/purchase",
    alias: "purchaseCargo",
    description: `Purchase cargo from a market.

The ship must be docked in a waypoint that has &#x60;Marketplace&#x60; trait, and the market must be selling a good to be able to purchase it.

The maximum amount of units of a good that can be purchased in each transaction are denoted by the &#x60;tradeVolume&#x60; value of the good, which can be viewed by using the Get Market action.

Purchased goods are added to the ship&#x27;s cargo hold.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: sell_cargo_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            cargo: ShipCargo,
            transaction: MarketTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/refine",
    alias: "shipRefine",
    description: `Attempt to refine the raw materials on your ship. The request will only succeed if your ship is capable of refining at the time of the request. In order to be able to refine, a ship must have goods that can be refined and have installed a &#x60;Refinery&#x60; module that can refine it.

When refining, 30 basic goods will be converted into 10 processed goods.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ship_refine_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cargo: ShipCargo,
            cooldown: Cooldown,
            produced: z
              .array(
                z
                  .object({ tradeSymbol: z.string(), units: z.number().int() })
                  .passthrough()
                  .readonly(),
              )
              .readonly(),
            consumed: z
              .array(
                z
                  .object({ tradeSymbol: z.string(), units: z.number().int() })
                  .passthrough()
                  .readonly(),
              )
              .readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/refuel",
    alias: "refuelShip",
    description: `Refuel your ship by buying fuel from the local market.

Requires the ship to be docked in a waypoint that has the &#x60;Marketplace&#x60; trait, and the market must be selling fuel in order to refuel.

Each fuel bought from the market replenishes 100 units in your ship&#x27;s fuel.

Ships will always be refuel to their frame&#x27;s maximum fuel capacity when using this action.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: refuel_ship_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            fuel: ShipFuel,
            transaction: MarketTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/repair",
    alias: "getRepairShip",
    description: `Get the cost of repairing a ship.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ transaction: RepairTransaction })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/repair",
    alias: "repairShip",
    description: `Repair a ship, restoring the ship to maximum condition. The ship must be docked at a waypoint that has the &#x60;Shipyard&#x60; trait in order to use this function. To preview the cost of repairing the ship, use the Get action.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ agent: Agent, ship: Ship, transaction: RepairTransaction })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/scan/ships",
    alias: "createShipShipScan",
    description: `Scan for nearby ships, retrieving information for all ships in range.

Requires a ship to have the &#x60;Sensor Array&#x60; mount installed to use.

The ship will enter a cooldown after using this function, during which it cannot execute certain actions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            ships: z.array(ScannedShip).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/scan/systems",
    alias: "createShipSystemScan",
    description: `Scan for nearby systems, retrieving information on the systems&#x27; distance from the ship and their waypoints. Requires a ship to have the &#x60;Sensor Array&#x60; mount installed to use.

The ship will enter a cooldown after using this function, during which it cannot execute certain actions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            systems: z.array(ScannedSystem).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/scan/waypoints",
    alias: "createShipWaypointScan",
    description: `Scan for nearby waypoints, retrieving detailed information on each waypoint in range. Scanning uncharted waypoints will allow you to ignore their uncharted state and will list the waypoints&#x27; traits.

Requires a ship to have the &#x60;Sensor Array&#x60; mount installed to use.

The ship will enter a cooldown after using this function, during which it cannot execute certain actions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            waypoints: z.array(ScannedWaypoint).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/my/ships/:shipSymbol/scrap",
    alias: "getScrapShip",
    description: `Get the amount of value that will be returned when scrapping a ship.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ transaction: ScrapTransaction })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/scrap",
    alias: "scrapShip",
    description: `Scrap a ship, removing it from the game and returning a portion of the ship&#x27;s value to the agent. The ship must be docked in a waypoint that has the &#x60;Shipyard&#x60; trait in order to use this function. To preview the amount of value that will be returned, use the Get Ship action.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ agent: Agent, transaction: ScrapTransaction })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/sell",
    alias: "sellCargo",
    description: `Sell cargo in your ship to a market that trades this cargo. The ship must be docked in a waypoint that has the &#x60;Marketplace&#x60; trait in order to use this function.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: sell_cargo_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            cargo: ShipCargo,
            transaction: MarketTransaction,
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/siphon",
    alias: "siphonResources",
    description: `Siphon gases, such as hydrocarbon, from gas giants.

The ship must be in orbit to be able to siphon and must have siphon mounts and a gas processor installed.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            cooldown: Cooldown,
            siphon: Siphon,
            cargo: ShipCargo,
            events: z.array(ShipConditionEvent).readonly(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/survey",
    alias: "createSurvey",
    description: `Create surveys on a waypoint that can be extracted such as asteroid fields. A survey focuses on specific types of deposits from the extracted location. When ships extract using this survey, they are guaranteed to procure a high amount of one of the goods in the survey.

In order to use a survey, send the entire survey details in the body of the extract request.

Each survey may have multiple deposits, and if a symbol shows up more than once, that indicates a higher chance of extracting that resource.

Your ship will enter a cooldown after surveying in which it is unable to perform certain actions. Surveys will eventually expire after a period of time or will be exhausted after being extracted several times based on the survey&#x27;s size. Multiple ships can use the same survey for extraction.

A ship must have the &#x60;Surveyor&#x60; mount installed in order to use this function.`,
    requestFormat: "json",
    parameters: [
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ cooldown: Cooldown, surveys: z.array(Survey).readonly() })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/transfer",
    alias: "transferCargo",
    description: `Transfer cargo between ships.

The receiving ship must be in the same waypoint as the transferring ship, and it must able to hold the additional cargo after the transfer is complete. Both ships also must be in the same state, either both are docked or both are orbiting.

The response body&#x27;s cargo shows the cargo of the transferring ship after the transfer is complete.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: transfer_cargo_Body,
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ data: z.object({ cargo: ShipCargo }).passthrough().readonly() })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/my/ships/:shipSymbol/warp",
    alias: "warpShip",
    description: `Warp your ship to a target destination in another system. The ship must be in orbit to use this function and must have the &#x60;Warp Drive&#x60; module installed. Warping will consume the necessary fuel from the ship&#x27;s manifest.

The returned response will detail the route information including the expected time of arrival. Most ship actions are unavailable until the ship has arrived at its destination.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ waypointSymbol: z.string() })
          .passthrough()
          .readonly(),
      },
      {
        name: "shipSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ fuel: ShipFuel, nav: ShipNav })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "post",
    path: "/register",
    alias: "register",
    description: `Creates a new agent and ties it to an account. 
The agent symbol must consist of a 3-14 character string, and will be used to represent your agent. This symbol will prefix the symbol of every ship you own. Agent symbols will be cast to all uppercase characters.

This new agent will be tied to a starting faction of your choice, which determines your starting location, and will be granted an authorization token, a contract with their starting faction, a command ship that can fly across space with advanced capabilities, a small probe ship that can be used for reconnaissance, and 150,000 credits.

&gt; #### Keep your token safe and secure
&gt;
&gt; Save your token during the alpha phase. There is no way to regenerate this token without starting a new agent. In the future you will be able to generate and manage your tokens from the SpaceTraders website.

If you are new to SpaceTraders, It is recommended to register with the COSMIC faction, a faction that is well connected to the rest of the universe. After registering, you should try our interactive [quickstart guide](https://docs.spacetraders.io/quickstart/new-game) which will walk you through basic API requests in just a few minutes.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: register_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            agent: Agent,
            contract: Contract,
            faction: Faction,
            ship: Ship,
            token: z.string(),
          })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/systems",
    alias: "getSystems",
    description: `Return a paginated list of all systems.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: z
      .object({ data: z.array(System).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol",
    alias: "getSystem",
    description: `Get the details of a system.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string().default("X1-OE"),
      },
    ],
    response: z.object({ data: System }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints",
    alias: "getSystemWaypoints",
    description: `Return a paginated list of all of the waypoints for a given system.

If a waypoint is uncharted, it will return the &#x60;Uncharted&#x60; trait instead of its actual traits.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "PLANET",
            "GAS_GIANT",
            "MOON",
            "ORBITAL_STATION",
            "JUMP_GATE",
            "ASTEROID_FIELD",
            "ASTEROID",
            "ENGINEERED_ASTEROID",
            "ASTEROID_BASE",
            "NEBULA",
            "DEBRIS_FIELD",
            "GRAVITY_WELL",
            "ARTIFICIAL_GRAVITY_WELL",
            "FUEL_STATION",
          ])
          .optional(),
      },
      {
        name: "traits",
        type: "Query",
        schema: traits,
      },
    ],
    response: z
      .object({ data: z.array(Waypoint).readonly(), meta: Meta })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol",
    alias: "getWaypoint",
    description: `View the details of a waypoint.

If the waypoint is uncharted, it will return the &#x27;Uncharted&#x27; trait instead of its actual traits.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Waypoint }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol/construction",
    alias: "getConstruction",
    description: `Get construction details for a waypoint. Requires a waypoint with a property of &#x60;isUnderConstruction&#x60; to be true.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Construction }).passthrough().readonly(),
  },
  {
    method: "post",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol/construction/supply",
    alias: "supplyConstruction",
    description: `Supply a construction site with the specified good. Requires a waypoint with a property of &#x60;isUnderConstruction&#x60; to be true.

The good must be in your ship&#x27;s cargo. The good will be removed from your ship&#x27;s cargo and added to the construction site&#x27;s materials.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: supply_construction_Body,
      },
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({ construction: Construction, cargo: ShipCargo })
          .passthrough()
          .readonly(),
      })
      .passthrough()
      .readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol/jump-gate",
    alias: "getJumpGate",
    description: `Get jump gate details for a waypoint. Requires a waypoint of type &#x60;JUMP_GATE&#x60; to use.

Waypoints connected to this jump gate can be `,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: JumpGate }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol/market",
    alias: "getMarket",
    description: `Retrieve imports, exports and exchange data from a marketplace. Requires a waypoint that has the &#x60;Marketplace&#x60; trait to use.

Send a ship to the waypoint to access trade good prices and recent transactions. Refer to the [Market Overview page](https://docs.spacetraders.io/game-concepts/markets) to gain better a understanding of the market in the game.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Market }).passthrough().readonly(),
  },
  {
    method: "get",
    path: "/systems/:systemSymbol/waypoints/:waypointSymbol/shipyard",
    alias: "getShipyard",
    description: `Get the shipyard for a waypoint. Requires a waypoint that has the &#x60;Shipyard&#x60; trait to use. Send a ship to the waypoint to access data on ships that are currently available for purchase and recent transactions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "systemSymbol",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "waypointSymbol",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ data: Shipyard }).passthrough().readonly(),
  },
]);

export const api = new Zodios("https://api.spacetraders.io/v2", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
