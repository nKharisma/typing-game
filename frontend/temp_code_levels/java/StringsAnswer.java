import java.util.Scanner;

public class StringsAns {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Your spaceship has intercepted a distress signal.
        // The signal is encrypted and each character in the message has been duplicated multiple times.
        // Your task is to decode the message by removing all consecutive duplicate characters.

        // Input
        // A single string 'message', which represents the intercepted distress signal
        String message = scanner.nextLine().trim(); // Trim any unnecessary whitespace or newlines

        // Initialize a StringBuilder to store the decoded message
        StringBuilder decodedMessage = new StringBuilder();

        // --- User Submission Area ---
        // Modify the code below to remove consecutive duplicate characters from the message

        if (message.length() > 0) {
            // Add the first character to the decoded message
            decodedMessage.append(message.charAt(0));

            // Loop through the rest of the characters
            for (int i = 1; i < message.length(); i++) {
                // Add the character only if it is different from the previous one
                if (message.charAt(i) != message.charAt(i - 1)) {
                    decodedMessage.append(message.charAt(i));
                }
            }
        }

        // --- End of User Submission Area ---

        // Output the decoded message
        String finalMessage = decodedMessage.toString().trim();
        System.out.print(finalMessage);

        // Closing scanner
        scanner.close();
    }
}
