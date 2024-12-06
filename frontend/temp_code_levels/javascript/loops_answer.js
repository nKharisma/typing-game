// Your spaceship requires energy crystals to power up for the journey ahead.
// You must mine asteroids to gather as many energy crystals as possible!

// Instructions
// Modify this program to calculate the total number of energy crystals collected.
// Use a loop to collect crystals from each asteroid.

// Input
// The total number of asteroids 'N'
// For each asteroid, the number of energy crystals it contains

// Output
// The total number of energy crystals collected

function main() {
    const prompt = require('prompt-sync')();

    // Getting the number of asteroids
    const n = parseInt(prompt("Enter the number of asteroids: "));

    let totalCrystals = 0; // Variable to store the total number of crystals

    // --- User Submission Area ---
    // Loop to get the number of crystals from each asteroid
    for (let i = 0; i < n; i++) {
        const crystals = parseInt(prompt(`Enter the number of crystals in asteroid ${i + 1}: `));

        // Add the number of crystals from the current asteroid to the total
        totalCrystals += crystals;
    }
    
    // Output the total number of energy crystals collected
    console.log(totalCrystals);

    // --- End of User Submission Area ---
}

main();
