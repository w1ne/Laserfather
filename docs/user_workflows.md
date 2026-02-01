# Typical User Workflows

This document describes the primary end-to-end workflows for Laseryx users. These workflows define the critical paths that must be supported and tested.

## 1. Raster Engraving (Image Workflow)

This workflow is used for engraving photographs or logos onto materials.

1.  **Import**: User uploads an image file (PNG/JPG/BMP).
    *   *System Action*: Converts image to internal Object (maintaining aspect ratio).
2.  **Configure**: User selects the image object and adjusts settings:
    *   **Mode**: Raster.
    *   **DPI**: Sets resolution (e.g., 10px/mm).
    *   **Speed/Power**: Sets laser parameters (e.g., 1000mm/min, 20%).
3.  **Generate**: User clicks "Generate G-code".
    *   *System Action*: Worker processes scanlines and produces distinct G-code sequences (`G1 ... S...`).
4.  **Connect & Run**:
    *   User connects to Virtual Machine (or real hardware).
    *   User clicks "Start Job".
    *   *System Action*: Streams G-code until completion.

## 2. Vector Cutting (SVG Workflow)

This workflow is used for cutting shapes out of materials.

1.  **Import**: User uploads an SVG file.
    *   *System Action*: Parses paths/shapes into internal Vector Objects.
2.  **Configure**: User selects objects:
    *   **Mode**: Cut (Vector).
    *   **Passes**: Multiple passes for thick material (e.g., 3 passes).
3.  **Generate**: User clicks "Generate G-code".
    *   *System Action*: Generates path following G-code, repeating for each pass.
4.  **Run**: Stream job to machine.

## 3. Design & Quick Shapes

This workflow is used for creating simple fixtures or tests directly in the app.

1.  **Design**: User adds a Rectangle or Circle from the toolbar.
    *   *User Action*: Resizes and positions the shape.
2.  **Configure**: Sets Material Preset (e.g., "Plywood 3mm Cut").
3.  **Generate & Run**: Standard generation and streaming flow.
