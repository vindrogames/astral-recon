const TILE_SIZE = 64;
const NUM_TILES = 9;

export default {
    tileSize: TILE_SIZE,
    numTiles: NUM_TILES,
    gameWidth: TILE_SIZE * NUM_TILES,
    gameHeight: TILE_SIZE * NUM_TILES,
    centerTile: 32,
    // 9x9 grid 0 based with col and rows [0, 1, 2, 3, 4, 5, 6, 7, 8]
    col_1: 0,
    col_2: 1,
    col_3: 2,
    col_4: 3,
    col_5: 4,
    col_6: 5,
    col_7: 6,
    col_8: 7,
    col_9: 8,
    row_1: 0,
    row_2: 1,
    row_3: 2,
    row_4: 3,
    row_5: 4,
    row_6: 5,
    row_7: 6,
    row_8: 7,
    row_9: 8,
    worldUiExtra: 4,
}