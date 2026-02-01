# Virtual Machine & Headless Testing

Laseryx includes a powerful **Virtual Machine** (Virtual GRBL Driver) that simulates a physical laser cutter in software. This allows developers to test G-code generation, streaming logic, and machine control workflows without connecting to hardware.

## Features

- **G-code Simulation**: Parses and executes `G0`, `G1`, `M3`, `M5`, `$H`, and other standard commands.
- **State Tracking**: Maintains real-time `MPos` (Machine Position) and `WPos` (Work Position).
- **Alarm Simulation**: Correctly enters `ALARM` state on errors or aborts.
- **Headless Mode**: Can be run entirely in Node.js for integration testing (see `src/io/virtualMachine.test.ts`).

## How to Use

### In Development (UI)

You can enable the Virtual Machine in the PWA Development build in two ways:

1. **URL Parameter**: Append `?virtual=true` to the URL.
   ```
   http://localhost:5173/?virtual=true
   ```
   
2. **Machine Panel**: In the "Machine" tab, look for the "Use Virtual Machine" checkbox at the top (only visible in `DEV` mode).

Once enabled:
1. Click **Connect**. The status should turn green (`IDLE`).
2. Use the **Jog Controls** to move the virtual laser. You will see coordinates update.
3. **Run a Job**: Generate G-code in the Design tab and click "Start Job". The virtual machine will stream the job, simulating movement delay.

### In Integration Tests

You can instantiate the `VirtualGrblDriver` directly in tests:

```typescript
import { createVirtualGrblDriver } from './grblDriver';

const driver = createVirtualGrblDriver({ responseDelayMs: 0 }); // 0ms for instant tests
await driver.connect();
await driver.sendLine('G0 X10 Y10');
const status = await driver.getStatus(); 
// status.mpos.x === 10
```

## Architecture

The `VirtualGrblDriver` implements the `GrblDriver` interface but replaces the Web Serial I/O with an innovative state machine.

- **`streamJob`**: Processes G-code lines sequentially, simulating protocol `ok` acknowledgments.
- **`sendLine`**: Parses G-code immediately and updates the internal `state` object.
- **`getStatus`**: Returns a snapshot of the current simulated `MPos`, `WPos`, and `Feed/Speed`.
