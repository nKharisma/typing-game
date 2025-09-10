import java.util.Scanner;

public class StringsAnswer {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Your spaceship has intercepted a distress signal.
        // The signal is encrypted and each character in the message has been duplicated multiple times.
        // Your task is to decode the message by removing all consecutive duplicate characters.

        // Input
        // A single string 'message', which represents the intercepted distress signal
        String message = scanner.nextLine();

        // Initialize a StringBuilder to store the decoded message
        StringBuilder decodedMessage = new StringBuilder();

        // --- User Submission Area ---
        // Modify the code below to remove consecutive duplicate characters from the message


        // --- End of User Submission Area ---

        // Output the decoded message
        System.out.println(decodedMessage.toString());

        // Closing scanner
        scanner.close();
    }
}