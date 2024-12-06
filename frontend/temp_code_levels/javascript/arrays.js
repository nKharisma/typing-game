// The Space Fleet needs your help to analyze their inventory of spare parts!
// Your task is to organize and manage an array of spare parts names.

// Instructions
// Write a program that allows the user to:
// 1. Add spare parts to the inventory.
// 2. Remove a spare part if it is no longer needed.
// 3. Display the current inventory of spare parts.

// Input
// Commands from the user: "add [part_name]", "remove [part_name]", "show", or "exit".
// Use these commands to modify the inventory array.

// Output
// The updated inventory after each operation.

function main() {
    const prompt = require('prompt-sync')();

    let inventory = []; // Array to store spare parts

    while (true) {
        const command = prompt("Enter a command (add/remove/show/exit): ");

        // Split the command to separate the action and the part name
        const parts = command.split(" ");
        const action = parts[0];
        const partName = parts.slice(1).join(" ");

        if (action === "add") {
            // --- User Submission Area ---


        } else if (action === "remove") {
            const index = inventory.indexOf(partName);
            if (index !== -1) {
                // --- User Submission Area ---


            } else {
                // --- User Submission Area ---


            }
        } else if (action === "show") {
            // --- User Submission Area ---


        } else if (action === "exit") {
            console.log("Exiting the program. Final inventory:", inventory);
            break;
        } else {
            console.log("Invalid command. Try again.");
        }
    }
}

main();
