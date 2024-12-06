import java.util.Scanner;

class ConditionalsAnswer {
    public static void main(String args[]) {
        Scanner scanner = new Scanner(System.in);

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
        // The appropriate ship level: Low, Medium, or High

        // Getting the number of enemy ships
        int n = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        String shieldPower = "Low"; // Default shield power level

        // Loop to get the name and type of each enemy ship
        for (int i = 0; i < n; i++) {
            String shipName = scanner.nextLine();

            String shipType = scanner.nextLine();

            // --- User Submission Area ---
            // Update the shield power level based on enemy ship type
            // Feel free to modify the logic below to determine the correct shield power level
            // Answer!!
            if (shipType.equals("Destroyer")) {
                shieldPower = "High";
            } else if (shipType.equals("Fighter") && !shieldPower.equals("High")) {
                shieldPower = "Medium";
            }
        }

        
        // Output the appropriate shield power level
        System.out.println(shieldPower);
        // --- End of User Submission Area ---

        // Closing scanner
        scanner.close();
    }
}
