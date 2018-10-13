import {
  wallCoordinates,
  listContainsCoordinate,
  listContainsWall,
  generateNeighbors,
  shuffle,
  mazeData
} from './mazeHelpers.js'


function generateMaze(mazeGridData) {

    let visitedCells = mazeGridData.visitedCells,
        cellCenters = mazeGridData.cellCenters,
        horizontalGridWalls = mazeGridData.horizontalGridWalls,
        verticalGridWalls = mazeGridData.verticalGridWalls,
        cellSize = mazeGridData.cellSize,
        halfCellSize = mazeGridData.halfCellSize,
        currentCoordinate = mazeGridData.currentCoordinate

    // if currentCoordinate is not already a coordinate, x and y needs to be added with coordinate()
    visitedCells.push(currentCoordinate);

    var neighborCells = generateNeighbors(currentCoordinate, cellSize);

    shuffle(neighborCells);
    let NumberOfVisitedNeighbors = 0;

    for (var element in neighborCells) {
        var currentNeighbor = neighborCells[element];
        var isNeighborOnGrid = listContainsCoordinate(cellCenters, currentNeighbor);
        var wasNeighborVisited = listContainsCoordinate(visitedCells, currentNeighbor);

        if (cellCenters.length == visitedCells.length) {
          return mazeGridData;
          break;

        } else if (NumberOfVisitedNeighbors == 4) {

            // Going back to the last coordinate with less then 4 occupied neighbors
            // not -2 instead of minus one? saves one step!
            lastNotSurroundedCell = visitedCells[-1];

            visitedCells[0] = visitedCells[-1];
            visitedCells.pop();

            //update mazeGridData
            mazeGridData.visitedCells = visitedCells;
            mazeGridData.currentCoordinate = lastNotSurroundedCell;

            generateMaze(mazeGridData);

        } else if ( isNeighborOnGrid == false ) {

            NumberOfVisitedNeighbors ++;
            continue;

        } else if ( wasNeighborVisited !== false ) {

            NumberOfVisitedNeighbors ++;
            continue;

        } else if (currentNeighbor.x == currentCoordinate.x + cellSize) {

            try {
                var rightWall = wallCoordinates(currentCoordinate.x + halfCellSize, currentCoordinate.y - halfCellSize, currentCoordinate.x + halfCellSize, currentCoordinate.y + halfCellSize)
                var thisRightWallInList = listContainsWall(verticalGridWalls, rightWall);
                var indexOfThisWall = verticalGridWalls.indexOf(thisRightWallInList);
                verticalGridWalls.splice(indexOfThisWall, 1);

            } catch(ValueError) {
                console.log("ValueError: can't remove Wall");
                continue;
            }

        } else if (currentNeighbor.x == currentCoordinate.x - cellSize) {

            try {
                var leftWall = wallCoordinates(currentCoordinate.x - halfCellSize, currentCoordinate.y - halfCellSize, currentCoordinate.x - halfCellSize, currentCoordinate.y + halfCellSize)
                var thisLeftWallInList = listContainsWall(verticalGridWalls, leftWall);
                var indexOfThisWall = verticalGridWalls.indexOf(thisLeftWallInList);
                verticalGridWalls.splice(indexOfThisWall, 1);

            } catch(ValueError) {
                console.log("ValueError: can't remove Wall");
                continue;
            }

        } else if (currentNeighbor.y == currentCoordinate.y + cellSize) {

            try{
                var bottomWall = wallCoordinates(currentCoordinate.x - halfCellSize, currentCoordinate.y + halfCellSize, currentCoordinate.x + halfCellSize, currentCoordinate.y + halfCellSize)
                var thisBottomWallInList = listContainsWall(horizontalGridWalls, bottomWall);
                var indexOfThisWall = horizontalGridWalls.indexOf(thisBottomWallInList);
                horizontalGridWalls.splice(indexOfThisWall, 1);

            } catch(ValueError) {
                console.log("ValueError: can't remove Wall");
                continue;
            }

        } else if (currentNeighbor.y == currentCoordinate.y - cellSize) {
          
            try{
                var topWall = wallCoordinates(currentCoordinate.x - halfCellSize, currentCoordinate.y - halfCellSize, currentCoordinate.x + halfCellSize, currentCoordinate.y - halfCellSize)
                var thisTopWallInList = listContainsWall(horizontalGridWalls, topWall);
                var indexOfThisWall = horizontalGridWalls.indexOf(thisTopWallInList);
                horizontalGridWalls.splice(indexOfThisWall, 1);

            } catch(ValueError) {
                console.log("ValueError: can't remove Wall");
                continue;
            }
        }

        // update mazeGridData
        mazeGridData.visitedCells = visitedCells;
        mazeGridData.horizontalGridWalls = horizontalGridWalls;
        mazeGridData.verticalGridWalls = verticalGridWalls;
        mazeGridData.currentCoordinate = currentNeighbor;

        generateMaze(mazeGridData);
    }
}

export { generateMaze };
