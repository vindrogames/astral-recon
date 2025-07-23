import Game_config from "./Game_config";

export default {
    key: 'world_2',
    tilesetImage: 'world_2_tileset_64',
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
                closedDoorPlaceholder: 'door_top_closed_placeholder_world_2'
            }
        },
        {
            csv: 'world_1_room_2',
            playerStart: {
                x: 64,
                y: 64
            },
            keyTile: {
                x: ((64 * 2) + 32),
                y: ((64 * 7) + 32),
                animation: 'key_tile_animation_world_2',
                asset: 'key_tile_animation_world_2'
            },
            entryDoor: {
                x: ((64 * 8) + 32),
                y: ((64 * 5) + 32),
                atlasKey: 'door_left_animation',
                animKey: 'door_left_close',
                prefix: 'door_'
            },
            endRoom: {
                x: 320,
                y: 64,
                atlasKey: 'door_top_animation',
                prefix: 'door_'
            },
        },
        {
            csv: 'world_1_room_3',
            playerStart: {
                x: 64,
                y: 64
            },
            keyTile: {
                x: ((64 * 5) + 32),
                y: ((64 * 2) + 32),
                animation: 'key_tile_animation_world_2',
                asset: 'key_tile_animation_world_2'
            },
            entryDoor: {
                x: ((64 * 8) + 32),
                y: ((64 * 5) + 32),
                atlasKey: 'door_top_animation',
                animKey: 'door_top_close',
                prefix: 'door_'
            },
            cagedAstroAnimation: {
                x: ((64 * 8) + 32),
                y: ((64 * 5) + 32),
                atlasKey: 'tupac_caged_animation',
                prefix: 'tupac_caged_'
            },
            endRoom: {
                x: 320,
                y: 64,
                atlasKey: 'tupac_reveal_animation',
                prefix: 'tupac_reveal_'
            },
        },
    ],
    //playerClass: 'PlayerW1',
    keyTileClass: 'KeyTile',
    //doorClass: 'Door',
    //difficulty: 'hard', // default
};