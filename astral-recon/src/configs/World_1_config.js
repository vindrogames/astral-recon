// src/config/World1Config.js

export default {
    key: 'world_1',
    tilesetImage: 'world_1_tileset_64',
    assetPaths: [
        {
            type: 'image',
            loadedRef: 'world_1_tileset_64',
            imgPath: 'map/world_1_tileset_64.png'
        },
        {
            type: 'image',
            loadedRef: 'easy_off',
            imgPath: 'buttons/easy_off.png'
        },
        {
            type: 'image',
            loadedRef: 'easy_on',
            imgPath: 'buttons/easy_on.png'
        },
        {
            type: 'image',
            loadedRef: 'hard_off',
            imgPath: 'buttons/hard_off.png'
        },
        {
            type: 'image',
            loadedRef: 'hard_on',
            imgPath: 'buttons/hard_on.png'
        },
        {
            type: 'image',
            loadedRef: 'quit_btn',
            imgPath: 'buttons/quit_btn.png'
        },
        {
            type: 'image',
            loadedRef: 'quit_btn_hover',
            imgPath: 'buttons/quit_btn_hover.png'
        },
        {
            type: 'atlas',
            animationRef: 'door_left_animation',
            imgPath: 'map/door_left_animation.png',
            jsonPath: 'map/door_left_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'door_top_animation',
            imgPath: 'map/door_top_animation.png',
            jsonPath: 'map/door_top_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'key_tile_animation',
            imgPath: 'map/key_tile_animation.png',
            jsonPath: 'map/key_tile_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'wall_animation',
            imgPath: 'map/wall_animation.png',
            jsonPath: 'map/wall_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'world_1_mach_animation_all',
            imgPath: 'avatars/mach_animation_all.png',
            jsonPath: 'avatars/mach_animation_all.json'
        },
        {
            type: 'atlas',
            animationRef: 'tupac_caged_animation',
            imgPath: 'avatars/tupac_caged_animation.png',
            jsonPath: 'avatars/tupac_caged_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'tupac_reveal_animation',
            imgPath: 'avatars/tupac_reveal_animation.png',
            jsonPath: 'avatars/tupac_reveal_animation.json'
        },
        {
            type: 'atlas',
            animationRef: 'world_1_final_dialogue_animation',
            imgPath: 'end_dialogue/final_dialogue_animation.png',
            jsonPath: 'end_dialogue/final_dialogue_animation.json'
        },
        {
            type: 'tilemapCSV',
            loadedRef: 'world_1_room_1',
            csvPath: 'map/room_1.csv'
        },
        {
            type: 'tilemapCSV',
            loadedRef: 'world_1_room_2',
            csvPath: 'map/room_2.csv'
        }
        ,
        {
            type: 'tilemapCSV',
            loadedRef: 'world_1_room_3',
            csvPath: 'map/room_3.csv'
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
                x: ((64 * 5) + 32),
                y: ((64 * 5) + 32),
                animation: 'key_tile_animation',
            },
            endRoom: {
                x: 320,
                y: 64,
                atlasKey: 'door_left_animation',
                prefix: 'door_'
            },
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
                animation: 'key_tile_animation'
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
                animation: 'key_tile_animation'
            },
            entryDoor: {
                x: ((64 * 8) + 32),
                y: ((64 * 5) + 32),
                atlasKey: 'door_left_animation',
                animKey: 'door_left_close',
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
