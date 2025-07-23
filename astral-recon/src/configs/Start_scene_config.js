// Import Game_config to have access to game dimensions and posisions
import Game_config from "./Game_config";

export default {

    // Key to be used for super() in StartScene.js
    key: 'Start_Scene',
    // mission buttons to start World.js scene
    uiButtons: [
        {
            button: 'world_1_btn',
            pos_X: Game_config.tileSize * Game_config.col_3 + Game_config.centerTile,
            pos_Y: Game_config.tileSize * Game_config.row_7 + Game_config.centerTile,
            worldBtnDark: 'world_1_btn_dark',
            worldBtnLight: 'world_1_btn_light'
        },
        {
            button: 'world_2_btn',
            pos_X: Game_config.tileSize * Game_config.col_7 + Game_config.centerTile,
            pos_Y: Game_config.tileSize * Game_config.row_7 + Game_config.centerTile,
            worldBtnDark: 'world_2_btn_dark',
            worldBtnLight: 'world_2_btn_light'
        }
    ],
    uiAstros: {
        world_1: {
            imgKey: 'tupac_complete',
            pos_X: 576 / 2 - 126,
            pos_Y: Game_config.gameWidth / 2,
        },
        world_2: {

        }
    },
    uiAnimationKey: 'worlds_recon_animation',
    uiAnimationPos_X: Game_config.gameWidth / 2,
    uiAnimationPos_Y: Game_config.gameWidth / 2,
}