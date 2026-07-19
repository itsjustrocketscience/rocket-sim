# Apogee - Rocket Simulator

**Link to Access:** [apogee-simulator.vercel.app](https://apogee-simulator.vercel.app/)

Apogee is a web-based rocket simulator designed to incorporate real rocket science into a more accessible and fun way. Inspired by Kerbal Space Program, it is meant to be a more simple and intuitive way to grasp concepts such as Delta V, Center of Pressure vs Center of Mass, aerodynamics, etc.

## Features

* **Vehicle Assembly Building (VAB):** Build rockets by selecting custom nose cones, fuselage tubes, and motors.
* **Live Physics Engine:** Calculates Center of Mass, Center of Pressure, and aerodynamic stability while playing.
* **2.5D Visualizer:** A CSS-based visualizer of the rocket, complete with an exhaust plume and launchpad.
* **Mission Progression:** A progression system designed to help with introducing rocket science concepts one by one.
* **Authentication:** All progress is saved in an account, so you can pick up where you left off on *any* device that has a web browser.

## Stack

* **Frontend:** React 18, Vite, CSS for 2.5D rendering
* **Backend:** Google Firebase (Authentication and saving)
* **Hosting:** Vercel

## Running Locally

Want to boot up the simulator on your own machine? 

1. **Clone the repo**
   ```bash
   git clone https://github.com/itsjustrocketscience/rocket-sim.git
2. **Navigate into the directory using cd**
   ```bash
   cd rocket-sim
3. **Install dependencies via npm (YOU'LL NEED NODE.JS!)**
   ```bash
   npm install
4. **Start the server**
   ```bash
   npm run dev
**You're done!**
