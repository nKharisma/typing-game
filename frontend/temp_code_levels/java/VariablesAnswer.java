import java.util.Scanner;

class VariablesAnswer {
    public static void main(String args[]) {
        Scanner scanner = new Scanner(System.in);
        
        // Your spaceship's radar system has detected multiple enemy ships approaching.
        // To maximize your defense, you must destroy the closest enemy ship!

        // Instructions
        // Modify this program to calculate the distance of each enemy ship from your spaceship.
        // Identify and shoot the closest enemy ship by outputting its name.

        // Input
        // The total number of enemy ships 'N'
        // A list of ship names and their respective distances from your spaceship

        // Getting the number of enemy ships
        int n = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        String closestShipName = "";
        int closestDistance = Integer.MAX_VALUE;

        // Loop to get the name and distance of each enemy ship
        for (int i = 0; i < n; i++) {
            String shipName = scanner.nextLine();
            
            int distance = scanner.nextInt();
            scanner.nextLine(); // Consume the newline character

            // --- User Submission Area ---
            // Update the closest ship if the current one is closer
            // Feel free to modify the logic below to determine the closest ship

            // ANSWER!
            if (distance < closestDistance) {
                closestDistance = distance;
                closestShipName = shipName;
            }
        }

        
        // Output the name of the closest enemy ship
        System.out.println(closestShipName);
        
        // --- End of User Submission Area ---
        
        // Closing scanner
        scanner.close();
    }
}
