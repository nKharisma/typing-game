// Your spaceship's radar system has detected multiple enemy ships approaching.
// To maximize your defense, you must destroy the closest enemy ship!

// Instructions
// Modify this program to calculate the distance of each enemy ship from your spaceship.
// Identify and shoot the closest enemy ship by outputting its name.

// Input
// The total number of enemy ships 'N'
// A list of ship names and their respective distances from your spaceship

// Output
// The name of the closest ship

function main() {
    const prompt = require('prompt-sync')();

    // Getting the number of enemy ships
    const n = parseInt(prompt("Enter the number of enemy ships: "));

    let closestShipName = "";
    let closestDistance = Infinity;

    // Loop to get the name and distance of each enemy ship
    for (let i = 0; i < n; i++) {
        const shipName = prompt(`Enter the name of enemy ship ${i + 1}: `);
        const distance = parseInt(prompt(`Enter the distance of ${shipName} from your spaceship: `));

        // --- User Submission Area ---
        // Update the closest ship if the current one is closer
        // Feel free to modify the logic below to determine the closest ship
        // Answer!!
        if (distance < closestDistance) {
            closestDistance = distance;
            closestShipName = shipName;
        }
    }

    // --- End of User Submission Area ---

    // Output the name of the closest enemy ship
    console.log(`The closest enemy ship is: ${closestShipName}`);
    console.log(`Prepare to fire at ${closestShipName}!`);
}

main();
