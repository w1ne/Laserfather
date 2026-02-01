# Changelog

All notable changes to Laseryx.
 
## [1.3.1] - 2026-02-01

### Fixed
- **Virtual Machine Jogging**: Fixed "jumping" behavior during jogging by correctly handling `$J=` commands and relative moves.
- **Driver Stability**: Improved Serial port handling and resolved TypeScript type mismatches in the I/O layer.
- **UI Logic**: Fixed a synchronization issue with the "Virtual Machine" toggle in the Machine Panel.

## [1.3.0] - 2026-02-01

### Added
**E2E Workflow Testing**
- Implemented full automation for "Golden Path" workflows: Image Import -> Generate -> Burn.
- Added support for SVG import automation and verification.
- Verified system stability across the entire chain from UI to Virtual Driver.

**PWA Installation**
- Added native "Install App" button handling for supported browsers.
- Improved offline capability and state persistence hints.

**Virtual Machine (G-code Engine)**
- Added support for **Arcs (G2/G3)** with endpoint tracking.
- Added support for **Dwell (G4)** with accurate timing simulation.
- Added support for **Unit Switching (G20/G21)** (Inches/Millimeters).
- Added support for **Work Offsets (G10 L20 / G92)** for better coordinate management.

**Material Library**
- Initial implementation of material presets and management.

### Fixed
- Fixed several race conditions in the Virtual Driver streaming logic.
- Improved PWA service worker stability.

## 1.2.0 - 2026-01-25

### Changed
**Rebranding**
Project renamed from **LaserFather** to **Laseryx**.
- Updated domain to `laseryx.com`.
- Updated application title and metadata.
- Renamed internal databases (Note: Local data will be reset).

## 1.1.2 - 2026-01-25

### Added
**Google Analytics**
Added GA4 tracking to better understand user behavior. Tracking is strictly limited to production domains (laserfather.com) and completely disabled on localhost/dev environments.

## 1.1.1 - 2026-01-25

### Fixed
**Version Display**
Fixed an issue where the About dialog showed `(unknown)` instead of the correct version/git hash. The build system now robustly detects version metadata from GitHub Actions environment variables.

## 1.1.0 - 2026-01-24

### Added

**Automatic Preview**
When you generate G-code, the app auto-switches to the Preview tab so you can verify the output immediately.
It uses HTML5 Canvas to handle complex designs with thousands of moves instantly. No more lag.

**Zoom and Pan**
You can freely explore your preview. Use the mouse wheel to zoom (centered on your cursor) and drag to pan around. Controls are also available on screen.

## 1.0.0 - 2026-01-23

### Added
We added a lot in this first release!

**PWA Support**
The app works offline and you can install it on your device.

**Machine Selection**
Supports GRBL 1.1+ based laser cutters. This includes most Diode and CO2 lasers.

**Design Workspace**
You can import SVG vectors and Raster images like PNG or JPG. We added basic primitives like rectangles. You can manage layers and move or scale items.

**CAM Engine**
G-code generation happens locally in your browser so it is fast and private. You can configure cuts, vector engraves, or raster engraves. Save your favorite settings to the Material Library.

**Machine Control**
Connect directly to your laser using USB. We use the Web Serial API for this. You have full Jog controls plus Homing and Unlock. The position updates in real-time.

**Android Support**
We added a polyfill so you can connect from Android phones using an OTG cable.

**UI**
The Properties panel now rounds numbers nicely. We added an About dialog with links to the source code. You can also buy me a coffee if you like!

**Documentation**
New README with a setup guide. We also documented the architecture and roadmap.

**License**
Released under CC BY-NC-SA 4.0.

### Fixed
We fixed a crash on non-secure HTTP sites regarding `crypto.randomUUID`.
The Properties panel no longer shows messy numbers with too many decimal places.
The build config was fixed to work with relative paths.

### Changed
G-code generation is now separate from streaming. This makes the workflow smoother.
We updated the project structure for better organization.
