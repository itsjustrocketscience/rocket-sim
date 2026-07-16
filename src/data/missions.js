// src/data/missions.js
export const missions = [
  {
    id: 1,
    title: "Mission 1: First Ignition",
    brief: "Welcome to Mission Control, Pilot. Your objective is simple: achieve an apogee of 20km. Environmental conditions are perfectly static, meaning that there are no crosswinds. Calculate the required fuel mass using the scratchpad to achieve enough Delta-V. Good luck!",
    targetApogee: 20, // in km
    payloadMass: 0,   // in kg
    avionicsMass: 0,  // in kg
    crosswind: 0,     // m/s
  },
  {
    id: 2,
    title: "Mission 2: Reaching the Stratosphere",
    brief: "Excellent work on the first launch. The target is now pushed to 50km. Structural parameters remain identical. Optimize your mass fractions to ensure the sounding rocket has enough velocity.",
    targetApogee: 50,
    payloadMass: 0,
    avionicsMass: 0,
    crosswind: 0,
  },
  {
    id: 3,
    title: "Mission 3: High Altitude Crosswinds",
    brief: "WARNING: Atmospheric sensors detect localized crosswinds of 5 m/s. The rocket has been retrofitted with an Automated Avionics Stabilization system to stay true to its vector. NOTE: This system adds 40kg of dead weight to your dry mass structural profile. Recalculate your math carefully.",
    targetApogee: 65,
    payloadMass: 0,
    avionicsMass: 40,
    crosswind: 5,
  },
  {
    id: 4,
    title: "Mission 4: Piercing the Mesosphere",
    brief: "Winds are picking up. Telemetry predicts a 10 m/s crosswind. Your active avionics suite is locked online. Target apogee is 80km. Compensate for the extra guidance weight.",
    targetApogee: 80,
    payloadMass: 0,
    avionicsMass: 40,
    crosswind: 10,
  },
  {
    id: 5,
    title: "Mission 5: Weather Drone Deployment",
    brief: "Our first scientific contract! We need to deploy an Atmospheric Weather Drone at peak apogee (85km). The drone acts as a scientific payload, weighing an additional 50kg. Remember: payload mass does not burn away. It stays inside the dry mass envelope.",
    targetApogee: 85,
    payloadMass: 50,
    avionicsMass: 40,
    crosswind: 12,
  },
  {
    id: 6,
    title: "Mission 6: Ionospheric Research Array",
    brief: "We are lifting a heavy Ionospheric Research Probe (150kg payload) to an altitude of 95km. Crosswinds are holding steady at 15 m/s. Mass management is becoming critical. Watch your structural weight limitations.",
    targetApogee: 95,
    payloadMass: 150,
    avionicsMass: 40,
    crosswind: 15,
  },
  {
    id: 7,
    title: "Mission 7: The Karman Line Final Exam",
    brief: "The ultimate Tier 1 objective. You must clear the official boundary of space at 100km while carrying a heavy 300kg Prototype Satellite Capsule. Winds are severe at 20 m/s. Complete your Tsiolkovsky calculations cleanly. Space awaits your arrival.",
    targetApogee: 100,
    payloadMass: 300,
    avionicsMass: 40,
    crosswind: 20,
  }
];