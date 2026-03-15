import Game_config from "./Game_config";

export default {
    key: 'world_1',
    tilesetImage: 'world_1_tileset_64',
    wallAnimationKey: 'wall_animation_world_1',
    assets: {
        tilemaps: [
            {
                assetKey: 'world_1_room_1',
                assetPath: 'map/room_1_world_1.csv'
            },
            {
                assetKey: 'world_1_room_2',
                assetPath: 'map/room_2_world_1.csv'
            }
            ,
            {
                assetKey: 'world_1_room_3',
                assetPath: 'map/room_3_world_1.csv'
            }
        ],
        images: [
            {
                assetKey: 'world_1_tileset_64',
                assetPath: 'map/world_1_tileset_64.png'
            },
            {
                assetKey: 'easy_dark_world_1',
                assetPath: 'buttons/easy_dark_world_1.png'
            },
            {
                assetKey: 'easy_light_world_1',
                assetPath: 'buttons/easy_light_world_1.png'
            },
            {
                assetKey: 'hard_dark_world_1',
                assetPath: 'buttons/hard_dark_world_1.png'
            },
            {
                assetKey: 'hard_light_world_1',
                assetPath: 'buttons/hard_light_world_1.png'
            },
            {
                assetKey: 'quit_dark_world_1',
                assetPath: 'buttons/quit_dark_world_1.png'
            },
            {
                assetKey: 'quit_light_world_1',
                assetPath: 'buttons/quit_light_world_1.png'
            },
            {
                assetKey: 'key_tile_pressed_world_1',
                assetPath: 'map/key_tile_pressed_world_1.png'
            },
            {
                assetKey: 'door_top_open_static_world_1',
                assetPath: 'map/door_top_open_static_world_1.png'
            },
            {
                assetKey: 'door_left_open_static_world_1',
                assetPath: 'map/door_left_open_static_world_1.png'
            }
        ],
        atlases: [
            {
                assetKey: 'key_tile_animation_world_1',
                assetPath: 'map/key_tile_animation_world_1.png',
                atlasPath: 'map/key_tile_animation_world_1.json'
            },
            {
                assetKey: 'door_left_animation_world_1',
                assetPath: 'map/door_left_animation_world_1.png',
                atlasPath: 'map/door_left_animation_world_1.json'
            },
            {
                assetKey: 'door_top_animation_world_1',
                assetPath: 'map/door_top_animation_world_1.png',
                atlasPath: 'map/door_top_animation_world_1.json'
            },

            {
                assetKey: 'wall_animation_world_1',
                assetPath: 'map/wall_animation_world_1.png',
                atlasPath: 'map/wall_animation_world_1.json'
            },
            {
                assetKey: 'world_1_mach_animation_all',
                assetPath: 'avatars/mach_animation_all.png',
                atlasPath: 'avatars/mach_animation_all.json'
            },
            {
                assetKey: 'tupac_caged_animation',
                assetPath: 'avatars/tupac_caged_animation.png',
                atlasPath: 'avatars/tupac_caged_animation.json'
            },
            {
                assetKey: 'tupac_reveal_animation',
                assetPath: 'avatars/tupac_reveal_animation.png',
                atlasPath: 'avatars/tupac_reveal_animation.json'
            },
            {
                assetKey: 'end_dialogue_animation_world_1',
                assetPath: 'end_dialogue/end_dialogue_animation_world_1.png',
                atlasPath: 'end_dialogue/end_dialogue_animation_world_1.json'
            },
        ]
    },
    uiButtons: [
        /*
        {
            button: 'hard',
            pos_X: Game_config.tileSize * Game_config.col_3,
            pos_Y: Game_config.tileSize * Game_config.row_9 + Game_config.centerTile + Game_config.worldUiExtra,
            imgKeyDark: 'hard_dark_world_1',
            imgKeyLight: 'hard_light_world_1',
            onClickAction: 'setHard'
        },
        {
            button: 'easy',
            pos_X: Game_config.tileSize * Game_config.col_4,
            pos_Y: Game_config.tileSize * Game_config.row_9 + Game_config.centerTile + Game_config.worldUiExtra,
            imgKeyDark: 'easy_dark_world_1',
            imgKeyLight: 'easy_light_world_1',
            onClickAction: 'setEasy'
        },
        */
        {
            button: 'quit',
            pos_X: Game_config.tileSize * Game_config.col_8,
            pos_Y: Game_config.tileSize * Game_config.row_9 + Game_config.centerTile + Game_config.worldUiExtra,
            imgKeyDark: 'quit_dark_world_1',
            imgKeyLight: 'quit_light_world_1',
            onClickAction: 'quitWorld'
        }
    ],
    rooms: [
        {
            csv: 'world_1_room_1',
            playerStart: {
                x: 64,
                y: 128
            },
            keyTile: {
                // tileSize * pos [0-8] -> 0 left, 8 right +32 to center in tile
                pos_X: Game_config.tileSize * Game_config.col_6 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_6 + Game_config.centerTile,
                atlasKey: 'key_tile_animation_world_1',
                animationKey: 'key_tile_animation_world_1',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_1'
            },
            exitDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_1 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_5 + Game_config.centerTile,
                atlasKey: 'door_left_animation_world_1',
                animationKey: 'door_left_animation_world_1',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
                staticOpenDoor: 'door_left_open_static_world_1',
                openTileIndex: 15
            }
        },
        {
            csv: 'world_1_room_2',
            playerStart: {
                x: 480, // col 7, right side entry (Room 1 exits left at row 4)
                y: 288  // row 4
            },
            keyTile: {
                pos_X: Game_config.tileSize * Game_config.col_3 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_8 + Game_config.centerTile,
                atlasKey: 'key_tile_animation_world_1',
                animationKey: 'key_tile_animation_world_1',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_1'
            },
            entryDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_9 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_5 + Game_config.centerTile,
                atlasKey: 'door_left_animation_world_1',
                animationKey: 'door_left_close',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
            },
            exitDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_1 + Game_config.centerTile,
                atlasKey: 'door_top_animation_world_1',
                animationKey: 'door_top_animation_world_1',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
                staticOpenDoor: 'door_top_open_static_world_1',
                openTileIndex: 15
            },
        },
        {
            csv: 'world_1_room_3',
            playerStart: {
                x: 288, // col 4, bottom entry (Room 2 exits top at col 4)
                y: 480  // row 7
            },
            keyTile: {
                pos_X: Game_config.tileSize * Game_config.col_6 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_3 + Game_config.centerTile,
                atlasKey: 'key_tile_animation_world_1',
                animationKey: 'key_tile_animation_world_1',
                prefix: 'keyTile_',
                end: 11,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
                pressedKey: 'key_tile_pressed_world_1'
            },
            entryDoorAnimation: {
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_9 + Game_config.centerTile,
                atlasKey: 'door_top_animation_world_1',
                animationKey: 'door_top_close',
                prefix: 'door_',
                start: 0,
                end: 5,
                zeroPad: 4,
                repeat: 0,
                frameRate: 6,
            },
            entryAstroCaged: {
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_2,
                atlasKey: 'tupac_caged_animation',
                animationKey: 'tupac_caged_animation',
                prefix: 'tupac_caged_',
                start: 0,
                end: 23,
                zeroPad: 4,
                repeat: -1,
                frameRate: 12,
            },
            astroReveal: {
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_2,
                atlasKey: 'tupac_reveal_animation',
                animationKey: 'tupac_reveal_animation',
                prefix: 'tupac_reveal_',
                start: 0,
                end: 11,
                zeroPad: 4,
                repeat: 0,
                frameRate: 8,
            },
            endDialogue: {
                pos_X: Game_config.tileSize * Game_config.col_5 + Game_config.centerTile,
                pos_Y: Game_config.tileSize * Game_config.row_4 + Game_config.centerTile,
                atlasKey: 'end_dialogue_animation_world_1',
                animationKey: 'end_dialogue_animation_world_1',
                prefix: 'end_dialogue_',
                start: 0,
                end: 6,
                zeroPad: 4,
                repeat: 0,
                duration: 21000
            }
        },
    ],
    player: {
        speed: 300,
    }
    // keyTileClass: 'KeyTile',
    //doorClass: 'Door',
    //difficulty: 'hard', // default
};
