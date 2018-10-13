import { cellCoordinate, wallCoordinates, getRandomCell } from './mazeHelpers.js'

function makeGrid(mazeDataLib) {

    let cellSize = mazeDataLib.cellSize,
        halfCellSize = mazeDataLib.halfCellSize,
        height = mazeDataLib.height,
        width = mazeDataLib.width

    let visitedCells = [];
    let cellCenters = [];

    let verticalGridWalls = [];
    let horizontalGridWalls = [];

    // generate vertical walls as line coordinates in an array
    for (var y = 0; y < height; y += cellSize) {
        for (var x=0; x < width; x += cellSize) {
            verticalGridWalls.push(wallCoordinates(x, y, x, y + cellSize));
        }
    }

    // generate horizontal walls as line coordinates in an array
    for (x = 0; x < width; x += cellSize) {
        for (y = 0; y < height; y += cellSize) {
            horizontalGridWalls.push(wallCoordinates(x, y, x + cellSize, y));
        }
    }

    // generate array with cell center coordinates
    for (x = halfCellSize; x < width; x += cellSize) {
        for (y = halfCellSize; y < height; y += cellSize) {
            cellCenters.push(cellCoordinate(x, y));
        }
    }

    let RandomStartCell = getRandomCell(cellCenters);

    // update Library
    mazeDataLib.currentCoordinate = RandomStartCell;
    mazeDataLib.horizontalGridWalls = horizontalGridWalls;
    mazeDataLib.verticalGridWalls = verticalGridWalls;
    mazeDataLib.cellCenters = cellCenters;
    mazeDataLib.visitedCells = visitedCells;

    return mazeDataLib;
}

export { makeGrid };
