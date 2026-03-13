# Astral Recon — Architecture Document

## Overview

A Phaser 3 top-down tile-based game built with Vite. The player navigates rooms, collects a key per room to unlock a door, and progresses through 3 rooms to rescue a captive "Astro" character. Two worlds are currently implemented (Tupac / Elvis).

**Stack:** Phaser 3, JavaScript (ES modules), Vite, Arcade Physics

---

## Scene Flow

```
Preloader → StartScene → World (single reusable scene)
```

| Scene | File | Purpose |
|---|---|---|
| `Preloader` | `src/scenes/Preloader.js` | Loads shared assets (player sprite, start screen), then launches `Start_Scene` |
| `StartScene` | `src/scenes/StartScene.js` | Main menu. Shows world select buttons; hides completed world buttons and shows rescued Astro image |
| `World` | `src/scenes/World.js` | Single generic world scene. Loads world-specific assets at runtime via world config, delegates all room logic to `RoomManager`. Handles persistent UI buttons (easy/hard/quit). Exposes `handleDoorTransition()` called by Player on open-door tiles |

---

## Managers

| Class | File | Purpose |
|---|---|---|
| `GameState` | `src/managers/GameState.js` | Singleton plain object. Tracks current world, room index, key collected, difficulty, and completed worlds |
| `RoomManager` | `src/managers/RoomManager.js` | Orchestrates room lifecycle: load tilemap, spawn player, spawn key tile, handle door animations, manage cleanup array, trigger end-world sequence |

---

## Game Objects

| Class | File | Extends | Purpose |
|---|---|---|---|
| `Player` | `src/gameobjects/Player.js` | `GameObjects.Sprite` | Tile-by-tile movement (arrow/WASD). Checks wall/door/death tiles on each move. After landing, calls `RoomManager.checkKeyTileCollision`. Plays walk/die/idle animations. Respawns on death. Depth 5 (renders above floor elements) |
| `KeyTile` | `src/gameobjects/Key_tile.js` | `GameObjects.Sprite` | Animated collectible. Plays loop animation from atlas config |
| `Door` | `src/gameobjects/Door.js` | `GameObjects.Sprite` | Plays open/close animation from config. Frames are reversed for entry doors (closing animation) |
| `Wall` | `src/gameobjects/Wall.js` | `GameObjects.Sprite` | Hidden death-tile overlay. Triggers a flash animation when player steps on tile index `2`. Uses `wallAnimationKey` from world config (not hardcoded) |
| `GameButton` | `src/gameobjects/GameButton.js` | `GameObjects.Image` | Reusable hover-state button (dark/light texture swap). Supports enable/disable |

---

## Config System

All data lives in `src/configs/`. Adding a new world only requires a new config file.

| File | Purpose |
|---|---|
| `Game_config.js` | Global constants: 64px tile size, 9×9 grid, named row/col helpers (0-based: `col_1=0` … `col_9=8`) |
| `Start_scene_config.js` | Start screen button positions, Astro image keys per world, animation key |
| `World_1_config.js` | All World 1 data: asset lists, 3 room configs (CSV key, player start, key tile, door animations, Astro animations, end dialogue) |
| `World_2_config.js` | Same structure as World 1 config for World 2 |

Each world config passed to the `World` scene contains:
- `key` — world identifier
- `wallAnimationKey` — atlas key for the death-tile wall flash animation (e.g. `'wall_animation_world_1'`)
- `assets` — tilemaps, images, atlases to preload
- `uiButtons` — hard/easy/quit button positions and actions
- `rooms[]` — per-room: CSV key, player start, keyTile config, door animation configs, Astro caged/reveal configs, end dialogue config

Each `exitDoorAnimation` inside a room config must include:
- `openTileIndex` — tile index (`15` or `22`) written into the tilemap after the door opens, making the tile walkable and triggering room transition

Each room `playerStart` is the pixel-center of the tile just inside the entry door (matching the exit door position of the previous room, mirrored to the opposite wall).

---

## Tile Map System

Maps are 9×9 CSV files in `public/assets/world_N/map/`. Each cell is a tile index:

| Index | Meaning |
|---|---|
| `1` | Key tile placeholder — player landing here triggers key collection |
| `2` | Death tile — triggers Wall flash animation, player dies and respawns |
| `5,6,8,9,10,11,12,13` | Border walls (block movement) |
| `16,17` | Hidden/closed door (blocks movement until key is collected) |
| `15,22` | Open door — triggers room transition via `handleDoorTransition` |

---

## Room Progression Flow

```
loadCurrentRoom()
  → cleanupPreviousRoom()        // destroy all tracked objects
  → loadTileMap()                // CSV → Phaser tilemap layer
  → handleRoomEntryAnimations()  // optional: close entry door, spawn caged Astro
  → setupKeyTile()               // spawn animated key on tile index 1
  → spawnPlayer()                // create Player at config playerStart (entry-door side)
  → createWalls()                // place Wall sprites on all death tiles

[Player walks onto tile index 1]
  → Player.moveToTile() onComplete → roomManager.checkKeyTileCollision(x, y)
  → pressKeyTile()               // replace key sprite with pressed image (depth 2), set GameState.keyCollected
  → triggerDoorAnimation('exit') → on complete: tilemap.putTileAt(openTileIndex, doorX, doorY)

[Player walks onto tile index 15 or 22]
  → Player.moveToTile() → scene.handleDoorTransition()
  → roomManager.goToNextRoom() → GameState.nextRoom() → loadCurrentRoom()

[Room 3 key collected]
  → endWorldSequence()
  → astroReveal animation
  → endDialogue animation (if configured) → fadeOut → quitWorld() → StartScene
  → (no endDialogue) → fadeOut → quitWorld() → StartScene
```

---

## Depth (Z-order) Hierarchy

| Depth | Objects |
|---|---|
| `0` | Tilemap layer (floor, walls) |
| `2` | `pressedKeyTile` image, `closedDoorPlaceholder` image |
| `5` | Player sprite |

---

## Cheat Mode

Press **C** in-game to toggle cheat mode (persists within session, resets on world restart). When active, the player passes through death tiles (`index 2`) without dying. Useful for debugging room progression. State stored on the `World` scene as `this.cheatMode`.

---

## Keyboard / Canvas Focus

The Phaser canvas is given `tabindex="1"` and focused on game ready. A `window click` listener re-focuses the canvas so keyboard events always reach Phaser regardless of browser focus state. See `src/main.js`.

---

## Asset Organization

```
public/assets/
├── player/              # shared player spritesheet (all worlds)
├── start_screen/        # menu background, world buttons, worlds animation
├── world_1/
│   ├── avatars/         # mach player, tupac_caged, tupac_reveal
│   ├── buttons/         # hard/easy/quit UI
│   ├── end_dialogue/
│   └── map/             # tileset PNG, room CSVs, door/key/wall atlases
└── world_2/             # same structure (no end_dialogue folder)
```

Atlas frame naming convention: `<prefix>_NNNN` (zero-padded 4 digits), e.g. `wall_animation_0000`.

---

## Notes / Known Issues

- Wall animations are registered per-world using the `wallAnimationKey` from config (e.g. `wall_animation_world_1`). If both worlds share the same Phaser scene instance without a full scene restart, the second world's wall animation may reuse the first world's frames (cosmetic only).
- Simulation debug buttons (`🗝 Simulate Key`, `➡️ Next Room`) are still present in `World.js` and marked `*TO BE DELETED*`.
