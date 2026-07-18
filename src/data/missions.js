// src/data/missions.js

export const missions = [
  {
    id: "M-01",
    title: "OPERATION: FIRST LIGHT",
    brief: "Construct a basic sounding rocket capable of crossing the 1,000m threshold. Try stripping weight to see how high you can go.",
    targetApogee: 1000,
    targetDeltaV: 350, // BONUS BUDGET!
    payloadMass: 0, avionicsMass: 2, crosswind: 0
  },
  {
    id: "M-02",
    title: "OPERATION: HIGH ATMOSPHERE",
    brief: "Carry a 5kg payload past 3,000m. The default rocket will fall short. You will need a better engine or a larger fuselage.",
    targetApogee: 3000,
    targetDeltaV: 550,
    payloadMass: 5, avionicsMass: 2, crosswind: 0
  },
  {
    id: "M-03",
    title: "OPERATION: JET STREAM",
    brief: "Apogee target is 5,000m. Aerodynamic stability is critical. If your Center of Pressure is above your Center of Mass, you will flip.",
    targetApogee: 5000,
    targetDeltaV: 850,
    payloadMass: 2, avionicsMass: 4, crosswind: 15
  },
  {
    id: "M-04",
    title: "OPERATION: NEEDLE THREAD",
    brief: "Precision required. Reach at least 6,000m, but DO NOT exceed 6,500m.",
    targetApogee: 6000, maxApogee: 6500,
    targetDeltaV: 950,
    payloadMass: 4, avionicsMass: 3, crosswind: 5
  },
  {
    id: "M-05",
    title: "OPERATION: HEAVY LIFT",
    brief: "We have a massive 15kg satellite to launch to 4,000m. Beware of your Thrust-to-Weight Ratio (TWR).",
    targetApogee: 4000,
    targetDeltaV: 700,
    payloadMass: 15, avionicsMass: 5, crosswind: 0
  },
  {
    id: "M-06",
    title: "OPERATION: DELICATE CARGO",
    brief: "Target altitude is 5,000m. Structural limit: Do not exceed 8 Gs of acceleration, or the samples will be destroyed.",
    targetApogee: 5000, maxG: 8,
    targetDeltaV: 850,
    payloadMass: 3, avionicsMass: 4, crosswind: 10
  },
  {
    id: "M-07",
    title: "OPERATION: EYE OF THE STORM",
    brief: "Target is 8,000m with massive 30 m/s crosswinds. You must design an incredibly stable, bottom-heavy rocket to survive.",
    targetApogee: 8000,
    targetDeltaV: 1100,
    payloadMass: 2, avionicsMass: 2, crosswind: 30
  },
  {
    id: "M-08",
    title: "OPERATION: STRATOSPHERIC OBSERVATORY",
    brief: "Lift a heavy 10kg telescope to a precise window between 12,000m and 13,000m. Acceleration must remain under 12 Gs.",
    targetApogee: 12000, maxApogee: 13000, maxG: 12,
    targetDeltaV: 1400,
    payloadMass: 10, avionicsMass: 5, crosswind: 5
  },
  {
    id: "M-09",
    title: "OPERATION: THE EDGE",
    brief: "We need a 5kg payload delivered to 18,000m. You will need to maximize your mass fraction and optimize your aerodynamic profile.",
    targetApogee: 18000,
    targetDeltaV: 1800,
    payloadMass: 5, avionicsMass: 3, crosswind: 15
  },
  {
    id: "M-10",
    title: "OPERATION: KÁRMÁN PRELUDE",
    brief: "Reach 25,000m with a full 10kg avionics and payload package. Only a perfectly engineered rocket will survive the drag at this velocity.",
    targetApogee: 25000,
    targetDeltaV: 2200,
    payloadMass: 5, avionicsMass: 5, crosswind: 20
  }
];