import java.util.Scanner;

public class SpaceCargoCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // The space fleet is on a supply mission, and each spaceship carries cargo from various space stations.
        // Write a function to calculate the total cargo weight for a spaceship.

        // Input
        // First input: an integer representing the number of cargo weights
        // Followed by n integers representing the cargo weights from various space stations
        int n = scanner.nextInt();
        
        int[] cargoWeights = new int[n];
        for (int i = 0; i < n; i++) {
            cargoWeights[i] = scanner.nextInt();
        }

        // Call the function to calculate the total cargo weight
        int totalCargoWeight = calculateTotalCargo(cargoWeights);

        // Output the total weight of the cargo
        System.out.println(totalCargoWeight);

        // Closing scanner
        scanner.close();
    }

    // Write a function called calculateTotalCargo that takes an array of integers
    // representing the cargo weights and returns the total cargo weight.
    public static int calculateTotalCargo(int[] cargoWeights) {
    // --- User Submission Area ---


    // --- End of User Submission Area ---
    }
}
