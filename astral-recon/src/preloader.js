// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // Load all the assets
        this.load.setPath("assets");
        
        // Start Sceren Assets
        this.load.image("background", "start_screen/main_screen_start.png");
        this.load.image("world_1_button", "start_screen/world_1_button.png");
        this.load.image("world_2_button", "start_screen/world_2_button.png");
        this.load.atlas("worlds_recon_animation", "start_screen/worlds_recon_animation.png", "start_screen/worlds_recon_animation.json");
        this.load.image("tupac_complete", "/start_screen/tupac_complete.png");
        
        // World 1
        // Map assets
        this.load.image("world_1_tileset_64", "world_1/map/world_1_tileset_64.png");
        this.load.tilemapCSV("world_1_room_1", "world_1/map/room_1.csv");
        this.load.tilemapCSV("world_1_room_2", "world_1/map/room_2.csv");
        this.load.tilemapCSV("world_1_room_3", "world_1/map/room_3.csv");
        this.load.atlas("world_1_door_left_animation", "world_1/map/door_left_animation.png", "world_1/map/door_left_animation.json");
        this.load.atlas("world_1_door_top_animation", "world_1/map/door_top_animation.png", "world_1/map/door_top_animation.json");
        this.load.atlas("world_1_door_key_animation", "world_1/map/door_key_animation.png", "world_1/map/door_key_animation.json");
        this.load.atlas("world_1_wall_animation", "world_1/map/wall_animation.png", "world_1/map/wall_animation.json");

        // Buttons
        this.load.image("world_1_easy_off", "world_1/buttons/easy_off.png");
        this.load.image("world_1_easy_on", "world_1/buttons/easy_on.png");
        this.load.image("world_1_hard_off", "world_1/buttons/hard_off.png");
        this.load.image("world_1_hard_on", "world_1/buttons/hard_on.png");
        this.load.image("world_1_quit", "world_1/buttons/world_1_quit.png");
        this.load.image("world_1_quit_hover", "world_1/buttons/world_1_quit_hover.png");

        // Avatars assets
        this.load.atlas("world_1_mach_animation_all", "world_1/avatars/mach_animation_all.png", "world_1/avatars/mach_animation_all.json");
        this.load.atlas("tupac_caged_animation", "world_1/avatars/tupac_caged_animation.png", "world_1/avatars/tupac_caged_animation.json");
        this.load.atlas("tupac_reveal_animation", "world_1/avatars/tupac_reveal_animation.png", "world_1/avatars/tupac_reveal_animation.json");

        // End Dialogue
        this.load.atlas("world_1_final_dialogue_animation", "world_1/end_dialogue/final_dialogue_animation.png", "world_1/end_dialogue/final_dialogue_animation.json")

        // World 2
        // Map assets
        this.load.image("world_2_tileset_64", "world_2/map/world_2_tileset_64.png");
        this.load.tilemapCSV("world_2_room_1", "world_2/map/room_1.csv");
        this.load.tilemapCSV("world_2_room_2", "world_2/map/room_2.csv");
        this.load.tilemapCSV("world_2_room_3", "world_2/map/room_3.csv");
        this.load.atlas("world_2_final_key_animation", "world_2/map/final_key_animation.png", "world_2/map/final_key_animation.json");
        //this.load.atlas("world_2_wall_animation", "world_2/map/wall_animation.png", "world_2/map/wall_animation.json");

        // Buttons
        this.load.image("world_2_easy_off", "world_2/buttons/easy_off.png");
        this.load.image("world_2_easy_on", "world_2/buttons/easy_on.png");
        this.load.image("world_2_hard_off", "world_2/buttons/hard_off.png");
        this.load.image("world_2_hard_on", "world_2/buttons/hard_on.png");
        this.load.image("world_2_quit", "world_2/buttons/world_2_quit.png");
        this.load.image("world_2_quit_hover", "world_2/buttons/world_2_quit_hover.png");

        // Avatar Assets
    }

    create() {

        // When all the assets are loaded go to the next scene
        this.scene.start("StartScene");
    }
}