// Your spaceship's radar has detected multiple enemy ships approaching.
// To maximize your defense, you must allocate appropriate shield power
// based on the threat levels of the approaching enemy ships!

// Instructions
// Modify this program to determine the correct shield power level
// based on enemy ship types. You need to allocate the shield power accordingly.

// Input
// The total number of enemy ships 'N'
// A list of ship names and their respective types ('Scout', 'Fighter', 'Destroyer')

// Output
// The appropriate shield level: Low, Medium, or High

function main() {
    const prompt = require('prompt-sync')();

    // Getting the number of enemy ships
    const n = parseInt(prompt("Enter the number of enemy ships: "));

    let shieldPower = "Low"; // Default shield power level

    // Loop to get the name and type of each enemy ship
    for (let i = 0; i < n; i++) {
        const shipName = prompt(`Enter the name of enemy ship ${i + 1}: `);
        const shipType = prompt(`Enter the type of ${shipName} (Scout/Fighter/Destroyer): `);

        // --- User Submission Area ---
        // Update the shield power level based on enemy ship type
        // Feel free to modify the logic below to determine the correct shield power level
        // Answer!!
        if (shipType === "Destroyer") {
            shieldPower = "High";
        } else if (shipType === "Fighter" && shieldPower !== "High") {
            shieldPower = "Medium";
        }
    }

    // --- End of User Submission Area ---

    // Output the appropriate shield power level
    console.log(`The appropriate shield power level is: ${shieldPower}`);
}

main();
