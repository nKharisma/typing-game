import java.util.ArrayList;
import java.util.Scanner;

// The Space Fleet needs your help to analyze their inventory of spare parts!
// Your task is to organize and manage an ArrayList of spare parts names.

// Instructions
// Write a program that allows the user to:
// 1. Add spare parts to the inventory.
// 2. Remove a spare part if it is no longer needed.
// 3. Display the current inventory of spare parts.

// Input
// Commands from the user: "add [part_name]", "remove [part_name]", "show", or "exit".
// Use these commands to modify the inventory ArrayList.

// Output
// The updated inventory after each operation.

public class SpaceFleetInventory {
    public static void main(String[] args) {
        ArrayList<String> inventory = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.print("Enter a command (add/remove/show/exit): ");
            String command = scanner.nextLine();

            String[] parts = command.split(" ", 2);
            String action = parts[0];
            String partName = parts.length > 1 ? parts[1] : "";

            if (action.equals("add")) {
                inventory.add(partName); // Add part to the ArrayList
                System.out.println(partName + " added to the inventory.");
            } else if (action.equals("remove")) {
                if (inventory.contains(partName)) {
                    inventory.remove(partName); // Remove part from the ArrayList
                    System.out.println(partName + " removed from the inventory.");
                } else {
                    System.out.println(partName + " not found in the inventory.");
                }
            } else if (action.equals("show")) {
                System.out.println("Current inventory: " + inventory);
            } else if (action.equals("exit")) {
                System.out.println("Exiting the program. Final inventory: " + inventory);
                break;
            } else {
                System.out.println("Invalid command. Try again.");
            }
        }

        scanner.close();
    }
}
