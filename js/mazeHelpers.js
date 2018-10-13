
const cellCoordinate = (x, y) => ({x, y});

const wallCoordinates = (x1, y1, x2, y2) => ({x1, y1, x2, y2});

const cellCoordinatesEqual = (c1, c2) => c1.x === c2.x && c1.y === c2.y;

const wallsEqual = (l1, l2) => l1.x1 == l2.x1 && l1.y1 == l2.y1 && l1.x2 == l2.x2 && l1.y2 == l2.y2;

const mazeData = (
    currentCoordinate,
    horizontalGridWalls,
    verticalGridWalls,
    visitedCells,
    cellCenters,
    cellSize,
    halfCellSize,
    height,
    width
) => ({
    currentCoordinate,
    horizontalGridWalls,
    verticalGridWalls,
    visitedCells,
    cellCenters,
    cellSize,
    halfCellSize,
    height,
    width
    })

const listContainsCoordinate = (list, c) => {
    var value = list.find(current => cellCoordinatesEqual(current, c));
    if (value === undefined) {
        //console.log("undefined", c)
        return false;
    } else {
        //console.log("value", value)
        return value;
    }
}

const listContainsWall = (list, l) => list.find(current => wallsEqual(current, l));

const generateNeighbors = (coordinate, cellSize) => {

    let neighborCells = [
        cellCoordinate(coordinate.x - cellSize, coordinate.y),
        cellCoordinate(coordinate.x, coordinate.y + cellSize),
        cellCoordinate(coordinate.x + cellSize, coordinate.y),
        cellCoordinate(coordinate.x, coordinate.y - cellSize)
    ];

    return neighborCells;
}

const resolution = (h, w) => ({h, w});

function detectScreenSize() {
    var availableScreenHeight = screen.availHeight;
    var availableScreenWidth = screen.availWidth;
    var screenResolution = resolution(availableScreenHeight, availableScreenWidth);
    console.log(availableScreenHeight)
    console.log(availableScreenWidth)

    return screenResolution;
}

function shuffle(arrayToBeShuffled) {
    var ctr = arrayToBeShuffled.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arrayToBeShuffled[ctr];
        arrayToBeShuffled[ctr] = arrayToBeShuffled[index];
        arrayToBeShuffled[index] = temp;
    }
    return arrayToBeShuffled;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomCell(cellList) {
    let randomCell = cellList[getRandomInt(cellList.length-1)];
    return randomCell
}

function wall(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
            fillStyle: 'black'
        }
    })
}

export {
    cellCoordinate,
    wallCoordinates,
    cellCoordinatesEqual,
    wallsEqual,
    listContainsCoordinate,
    listContainsWall,
    generateNeighbors,
    shuffle,
    detectScreenSize,
    getRandomInt,
    getRandomCell,
    mazeData,
    wall
}
