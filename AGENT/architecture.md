# Astral Recon — Architecture Document

## Overview

A Phaser 3 top-down tile-based game built with Vite. The player navigates rooms, collects a key per room to unlock a door, and progresses through 3 rooms to rescue a captive "Astro" character. Two worlds are currently implemented (Tupac / Elvis). Each world has its own movement mechanic, player sprite, and visual theme.

**Stack:** Phaser 3, JavaScript (ES modules), Vite, Arcade Physics

---

## Scene Flow

```
Preloader → StartScene → World (single reusable scene)
```

| Scene | File | Purpose |
|---|---|---|
| `Preloader` | `src/scenes/Preloader.js` | Loads shared assets (fallback player sprite, start screen), then launches `Start_Scene` |
| `StartScene` | `src/scenes/StartScene.js` | Main menu. Shows world select buttons; hides completed world buttons and shows rescued Astro image |
| `World` | `src/scenes/World.js` | Single generic world scene. Loads world-specific assets at runtime via world config, delegates all room logic to `RoomManager`. Handles persistent UI buttons (easy/hard/quit), touch/swipe input, cheat mode toggle, and `handleDoorTransition()` |

---

## Managers

| Class | File | Purpose |
|---|---|---|
| `GameState` | `src/managers/GameState.js` | Singleton plain object. Tracks current world, room index, key collected, difficulty, and completed worlds |
| `RoomManager` | `src/managers/RoomManager.js` | Orchestrates room lifecycle: load tilemap, spawn player (using config's `playerClass` and `playerAsset`), spawn key tile, handle door animations, manage cleanup array, trigger end-world sequence |

---

## Game Objects

| Class | File | Extends | Purpose |
|---|---|---|---|
| `Player` | `src/gameobjects/Player.js` | `GameObjects.Sprite` | **World 1** — tile-by-tile movement (arrow/WASD/swipe). Checks wall/door/death tiles on each move. After landing, calls `RoomManager.checkKeyTileCollision`. Plays walk/die/idle animations. Respawns on death. Depth 5 |
| `PlayerW2` | `src/gameobjects/PlayerW2.js` | `Player` | **World 2** — sliding movement: player slides in the pressed direction until hitting a wall, border, or death tile. Death tiles are stop obstacles (no death). Flashes the wall that stopped the slide. No die animations |
| `KeyTile` | `src/gameobjects/Key_tile.js` | `GameObjects.Sprite` | Animated collectible. Plays loop animation from atlas config |
| `Door` | `src/gameobjects/Door.js` | `GameObjects.Sprite` | Plays open/close animation from config. Frames are reversed for entry doors (closing animation) |
| `Wall` | `src/gameobjects/Wall.js` | `GameObjects.Sprite` | Death-tile overlay. Hidden until triggered. Uses `asset` key as animation key (per-world, no cross-world conflicts). World 1: triggered when player lands on tile 2. World 2: triggered when slide stops against tile 2 |
| `GameButton` | `src/gameobjects/GameButton.js` | `GameObjects.Image` | Reusable hover-state button (dark/light texture swap). Supports enable/disable |

---

## Config System

All data lives in `src/configs/`. Adding a new world only requires a new config file.

| File | Purpose |
|---|---|
| `Game_config.js` | Global constants: 64px tile size, 9×9 grid, named row/col helpers (0-based: `col_1=0` … `col_9=8`) |
| `Start_scene_config.js` | Start screen button positions, Astro image keys per world, animation key |
| `World_1_config.js` | All World 1 data: asset lists, 3 room configs (CSV key, player start, key tile, door animations, Astro animations, end dialogue) |
| `World_2_config.js` | Same structure as World 1. Also sets `playerClass: 'PlayerW2'` and `playerAsset: 'world_2_mach_animation_all'` |

Each world config contains:
- `key` — world identifier
- `wallAnimationKey` — atlas key for the death-tile wall flash animation (e.g. `'wall_animation_world_1'`)
- `playerClass` *(optional)* — name of the player class to instantiate. Defaults to `Player` if absent. Currently: `'PlayerW2'` for World 2
- `playerAsset` *(optional)* — atlas key for the player sprite. Defaults to `'player_animation'` if absent
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
| `0` | Open floor — walkable |
| `1` | Key tile placeholder — player landing here triggers key collection |
| `2` | Death tile — World 1: player dies and respawns. World 2: stops the slide, flashes wall |
| `3` | Top-left corner border (blocks movement) |
| `4` | Top border interior (blocks movement) |
| `5,6,7` | Top-right, right border, bottom-right corners (block movement) |
| `8,9,10,11,12,13` | Bottom, left border variants (block movement) |
| `14` | Closed door variant (right wall, World 2 Room 2) — blocks until opened |
| `16` | Closed door (blocks movement until key is collected) |
| `15,22` | Open door — triggers room transition via `handleDoorTransition` |

---

## Player Movement Systems

### World 1 — Tile-by-Tile (`Player`)
- Each key/swipe press moves the player exactly one tile
- Movement blocked by border tiles and closed doors
- Landing on death tile (index 2) triggers death + respawn
- Door tiles (15/22) trigger immediate room transition (no tween)
- Bounds check uses tile-space arithmetic to avoid float drift

### World 2 — Sliding (`PlayerW2`)
- Each key/swipe press launches a slide scan in that direction
- Player slides to the furthest reachable tile before a blocking tile
- Death tiles (index 2) **stop** the slide without killing the player; wall flashes on arrival
- Key tile (index 1) stops the slide; key is collected on arrival
- Open door tiles (15/22) stop the slide; room transition fires in `onComplete`
- Tween uses `Linear` easing at 120ms/tile
- No die animations — only walk (frames 0–3) and idle (frames 4–7) from the 8-frame sprite

---

## Room Progression Flow

```
loadCurrentRoom()
  → cleanupPreviousRoom()        // destroy all tracked objects
  → loadTileMap()                // CSV → Phaser tilemap layer
  → handleRoomEntryAnimations()  // optional: close entry door, spawn caged Astro
  → setupKeyTile()               // spawn animated key on tile index 1
  → spawnPlayer()                // instantiate playerClass at config playerStart
  → createWalls()                // place Wall sprites on all death tiles (hidden)

[Player lands on tile index 1]
  → moveToTile() onComplete → roomManager.checkKeyTileCollision(x, y)
  → pressKeyTile()               // replace key sprite with pressed image (depth 2), set GameState.keyCollected
  → triggerDoorAnimation('exit') → on complete: tilemap.putTileAt(openTileIndex, doorX, doorY)

[Player reaches tile index 15 or 22]
  → scene.handleDoorTransition()
  → roomManager.goToNextRoom() → GameState.nextRoom() → loadCurrentRoom()

[Room 3 key collected]
  → endWorldSequence()
  → astroReveal animation
  → endDialogue animation (if configured) → fadeOut → quitWorld() → StartScene
  → (no endDialogue) → fadeOut → quitWorld() → StartScene
```

---

## Touch / Mobile Input

Swipe detection is handled in `World.create()` via Phaser pointer events:
- `pointerdown` stores start coordinates (`touchStartX/Y`, initialised to `null`)
- `pointerup` computes delta; if `|dx|` or `|dy| > 30px` (game coords), calls `player.moveToTile()` in the dominant axis direction
- `touchStartX/Y = null` on scene start prevents false swipes carried over from the StartScene button tap
- `canvas { touch-action: none }` in `style.css` prevents browser scroll/zoom during swipes

---

## Depth (Z-order) Hierarchy

| Depth | Objects |
|---|---|
| `0` | Tilemap layer (floor, walls) |
| `2` | `pressedKeyTile` image, `closedDoorPlaceholder` image |
| `5` | Player sprite |
| `42` | Persistent UI buttons (hard/easy/quit) |

---

## Animation System

- Player animations are recreated on every player spawn (`remove` then `create`), ensuring the correct world's atlas is always bound even when switching between worlds in the same session
- `Wall` registers its animation under the atlas key (`wall_animation_world_1` / `wall_animation_world_2`), preventing cross-world conflicts
- `keyPressed` flags are initialised from the current key state on player spawn, preventing an extra move firing from a held key after a room transition

---

## Cheat Mode

Press **C** in-game to toggle cheat mode (persists within session, resets on world restart). World 1 only: the player passes through death tiles without dying. State stored on the `World` scene as `this.cheatMode`.

---

## Keyboard / Canvas Focus

The Phaser canvas is given `tabindex="1"` and focused on game ready. A `window click` listener re-focuses the canvas so keyboard events always reach Phaser. See `src/main.js`.

---

## CI / Deployment

GitHub Actions (`.github/workflows/static.yml`) runs on push to `dev`:
1. **build** job — Node 20, `npm ci`, `npm run build` inside `astral-recon/`, uploads `dist/` as Pages artifact
2. **deploy** job — publishes the artifact to GitHub Pages

The `dist/` folder does not need to be committed to the repository.

---

## Asset Organization

```
public/assets/
├── player/              # fallback player sprite (player_animation key)
├── start_screen/        # menu background, world buttons, worlds animation
├── world_1/
│   ├── avatars/         # world_1_mach_animation_all (player), tupac_caged, tupac_reveal
│   ├── buttons/         # hard/easy/quit UI
│   ├── end_dialogue/
│   └── map/             # tileset PNG, room CSVs, door/key/wall atlases
└── world_2/
    ├── avatars/         # world_2_mach_animation_all (player, 8 frames), elvis_caged, elvis_reveal
    ├── buttons/         # hard/easy/quit UI
    └── map/             # tileset PNG, room CSVs, door/key/wall atlases
```

Atlas frame naming conventions:
- Wall / door / key atlases: `<prefix>_NNNN` (zero-padded 4 digits), e.g. `wall_animation_0000`
- Player atlases: numeric string keys `"0"`, `"1"`, … used with `generateFrameNumbers`
