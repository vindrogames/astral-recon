import Game_config from "./Game_config";

export default {
    key: 'world_2',
    tilesetImage: 'world_2_tileset_64',
    wallAnimationKey: 'wall_animation_world_2',
    assets: {
        tilemaps: [
            {
                assetKey: 'world_2_room_1',
                assetPath: 'map/room_1_world_2.csv'
            },
            {
                assetKey: 'world_2_room_2',
                assetPath: 'map/room_2_world_2.csv'
            }
            ,
            {
                assetKey: 'world_2_room_3',
                assetPath: 'map/room_3_world_2.csv'
            }
        ],
        images: [
            {
                assetKey: 'world_2_tileset_64',
                assetPath: 'map/world_2_tileset_64.png'
            },
            {
                assetKey: 'easy_dark_world_2',
                assetPath: 'buttons/easy_dark_world_2.png'
            },
            {
                assetKey: 'easy_light_world_2',
                assetPath: 'buttons/easy_light_world_2.png'
            },
            {
                assetKey: 'hard_dark_world_2',
                assetPath: 'buttons/hard_dark_world_2.png'
            },
            {
                assetKey: 'hard_light_world_2',
                assetPath: 'buttons/hard_light_world_2.png'
            },
            {
                assetKey: 'quit_dark_world_2',
                assetPath: 'buttons/quit_dark_world_2.png'
            },
            {
                assetKey: 'quit_light_world_2',
                assetPath: 'buttons/quit_light_world_2.png'
            },
            {
                assetKey: 'key_tile_pressed_world_2',
                assetPath: 'map/key_tile_pressed_world_2.png'
            },
            {
                assetKey: 'door_top_closed_placeholder_world_2',
                assetPath: 'map/door_top_closed_placeholder_world_2.png'
            },
            {
                assetKey: 'door_right_closed_placeholder_world_2',
                assetPath: 'map/door_right_closed_placeholder_world_2.png'
            },
        ],
        atlases: [
            {
                assetKey: 'key_tile_animation_world_2',
                assetPath: 'map/key_tile_animation_world_2.png',
                atlasPath: 'map/key_tile_animation_world_2.json'
            },
            {
                assetKey: 'door_top_animation_world_2',
                assetPath: 'map/door_top_animation_world_2.png',
                atlasPath: 'map/door_top_animation_world_2.json'
            },
            {
                assetKey: 'door_right_animation_world_2',
                assetPath: 'map/door_right_animation_world_2.png',
                atlasPath: 'map/door_right_animation_world_2.json'
            },
            {
                assetKey: 'wall_animation_world_2',
                assetPath: 'map/wall_animation_world_2.png',
                atlasPath: 'map/wall_animation_world_2.json'
            },
            {
                assetKey: 'elvis_caged_animation',
                assetPath: 'avatars/elvis_caged_animation.png',
                atlasPath: 'avatars/elvis_caged_animation.json'
            },
            {
                assetKey: 'elvis_reveal_animation',
                assetPath: 'avatars/elvis_reveal_animation.png',
                atlasPath: 'avatars/elvis_reveal_animation.json'
            },
        ]
    },
    uiButtons: [
        {
            button: 'hard',
            pos_X: 64 * 1.5 + 32,
            pos_Y: 576 - 28,
            imgKeyDark: 'hard_dark_world_2',
            imgKeyLight: 'hard_light_world_2',
            onClickAction: 'setHard'
        },
        {
            button: 'easy',
            pos_X: 64 * 2.5 + 32,
            pos_Y: 576 - 28,
            imgKeyDark: 'easy_dark_world_2',
            imgKeyLight: 'easy_light_world_2',
            onClickAction: 'setEasy'
        },
        {
            button: 'quit',
            pos_X: 64 * 4.5 + 160,
            pos_Y: 576 - 28,
            imgKeyDark: 'quit_dark_world_2',
            imgKeyLight: 'quit_light_world_2',
            onClickAction: 'quitWorld'
        }
    ],
    rooms: [
        {
            csv: 'world_2_room_1',
            playerStart: {
                x: ((64 * 1) + 32),
                y: ((64 * 1) + 32),
            },
            keyTile: {
                // tileSize * pos [0-8] -> 0=left edge, 8=right egde +32 to center in tile
                pos_X: ((64 * 6) + 32),
                pos_Y: ((64 * 1) + 32),
                atlasKey: 'key_tile_animation_world_2',
                animationKey: 'key_tile_animation_world_2',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_2'
            },
            exitDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_6 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_1 + Game_config.centerTile,
                atlasKey: 'door_top_animation_world_2',
                animationKey: 'door_top_animation_world_2',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
                closedDoorPlaceholder: 'door_top_closed_placeholder_world_2',
                openTileIndex: 15
            }
        },
        {
            csv: 'world_2_room_2',
            playerStart: {
                x: 352, // col 5, bottom entry (Room 1 exits top at col 5)
                y: 480  // row 7
            },
            keyTile: {
                // tileSize * pos [0-8] -> 0=left edge, 8=right egde +32 to center in tile
                pos_X: Game_config.tileSize * Game_config.col_6 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.col_2 + Game_config.centerTile,
                atlasKey: 'key_tile_animation_world_2',
                animationKey: 'key_tile_animation_world_2',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_2'
            },
            exitDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_9 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_7 + Game_config.centerTile,
                atlasKey: 'door_right_animation_world_2',
                animationKey: 'door_right_animation_world_2',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
                closedDoorPlaceholder: 'door_right_closed_placeholder_world_2',
                openTileIndex: 15
            }
        },
        {
            csv: 'world_2_room_3',
            playerStart: {
                x: 96,  // col 1, left entry (Room 2 exits right at row 6)
                y: 416  // row 6
            },
            keyTile: {
                // tileSize * pos [0-8] -> 0=left edge, 8=right egde +32 to center in tile
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.col_2 + Game_config.centerTile,
                atlasKey: 'key_tile_animation_world_2',
                animationKey: 'key_tile_animation_world_2',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_2'
            },
            entryAstroCaged: {
                pos_X: Game_config.tileSize * Game_config.col_4 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_2,
                atlasKey: 'elvis_caged_animation',
                animationKey: 'elvis_caged_animation',
                prefix: 'elvis_caged_',
                start: 0,
                end: 23,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
            },
            astroReveal: {
                pos_X: Game_config.tileSize * Game_config.col_4 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_2,
                atlasKey: 'elvis_reveal_animation',
                animationKey: 'elvis_reveal_animation',
                prefix: 'elvis_reveal_',
                start: 0,
                end: 11,
                zeroPad: 4,
                repeat: 0,
                frameRate: 8,
            },
        },
    ],
    playerClass: 'PlayerW2',
    keyTileClass: 'KeyTile',
    //doorClass: 'Door',
    //difficulty: 'hard', // default
};