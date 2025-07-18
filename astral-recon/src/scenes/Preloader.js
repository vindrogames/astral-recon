export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {

        // Load assets path
        this.load.setPath("assets");

        // Start Sceren Assets
        this.load.image("background", "start_screen/main_screen_start.png");
        this.load.image("world_1_button", "start_screen/world_1_button.png");
        this.load.image("world_2_button", "start_screen/world_2_button.png");
        this.load.atlas("worlds_recon_animation", "start_screen/worlds_recon_animation.png", "start_screen/worlds_recon_animation.json");
        this.load.image("tupac_complete", "/start_screen/tupac_complete.png");
    }

    create() {
        this.scene.start('StartScene');
    }
}
