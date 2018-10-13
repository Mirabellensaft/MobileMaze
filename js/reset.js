import { startSim } from './gameLoop.js'

function resetSim(World, world, Engine, engine, Events, Runner, runner, render, Render) {

    //remove canvas
    render.canvas.remove();

    // clear world and engine
    World.clear(world);
    console.log("world cleared");
    Engine.clear(engine);

    // stop render
    Runner.stop(runner);

    //remove events
    engine.events = {};

    setTimeout(startSim, 1000);
}

export { resetSim };
