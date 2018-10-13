import { makeGrid } from './gridGenerator.js'
import { generateMaze } from './mazeGenerator.js'
import { getRandomCell, mazeData, wall}  from './mazeHelpers.js'
import { resetSim } from './reset.js'

function startSim() {

    //Cellsize needs to be adjusted with resolution
    let startGridData = mazeData(),
        height = 800,
        width = 800,
        cellSize = 100,
        halfCellSize = parseInt(cellSize / 2)

    startGridData.height = height
    startGridData.width = width
    startGridData.cellSize = cellSize
    startGridData.halfCellSize = halfCellSize

    //generate maze data
    let gridData = makeGrid(startGridData);
    let DrawMazeData = generateMaze(gridData);

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,

        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        
    //canvas: document.querySelector('#myCanvas'),
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: false,
            background: 'white',
            wireframes: false
        }
    })

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // create world
    // add ball in random cell
    let ballSpawnPoint = getRandomCell(DrawMazeData.cellCenters)
    var ball = Matter.Bodies.circle(ballSpawnPoint.x, ballSpawnPoint.y, halfCellSize - 10, {
        density: 0.006,
        restitution: 0.5,
        render: {
        fillStyle: 'black'
        }
    })

    // Create outer walls
    World.add(world, [
        ball,
        Bodies.rectangle(width/2, 0, width, 2, { isStatic: true, fillStyle: 'black'}),
        Bodies.rectangle(width/2, height, width, 2, { isStatic: true, fillStyle: 'black'}),
        Bodies.rectangle(width, height/2, 2, height, { isStatic: true, fillStyle: 'black'}),
        Bodies.rectangle(0, height/2, 2, height, { isStatic: true, fillStyle: 'black'})
    ])

    // Create maze walls
    DrawMazeData.horizontalGridWalls.forEach(function(line) {
        let mazeWall = wall(line.x1 + halfCellSize - 1, line.y1, cellSize + 2, 3);
        Matter.World.add(world, mazeWall);
    })

    DrawMazeData.verticalGridWalls.forEach(function(line) {
        let mazeWall = wall(line.x1, line.y1 + halfCellSize - 1, 3, cellSize + 2);
        World.add(engine.world, mazeWall);
    })

    //Create goal in random cell
    let goalSpawnPoint = getRandomCell(DrawMazeData.cellCenters)
    var goal = Bodies.circle(goalSpawnPoint.x, goalSpawnPoint.y, 5, {
        isSensor: true,
        isStatic: true,
        render: {
            fillStyle: 'transparent',
            lineWidth: 0
        }
    })

    var goalFrame = Bodies.circle(goalSpawnPoint.x, goalSpawnPoint.y, halfCellSize-5, {
        isSensor: true,
        isStatic: true,
        render: {
          strokeStyle: 'black',
          fillStyle: 'transparent',
          lineWidth: 2
        }
    })

    World.add(world, [
        goal, goalFrame
    ])

    //define collision event
    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === goal) {
                setTimeout(resetSim(World, world, Engine, engine, Events, Runner, runner, render, Render), 9000);

            } else if (pair.bodyB === goal) {
                setTimeout(resetSim(World, world, Engine, engine, Events, Runner, runner, render, Render), 9000);
            }
        }
    })

    // add gyro control
    var updateGravity = function(event) {
        var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
            gravity = engine.world.gravity;

        if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
        }
    }

    window.addEventListener('deviceorientation', updateGravity);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    })

    return {
        engine: engine,
        runner: runner,
        render: render,
    }
}

startSim();

export { startSim };
