# Your spaceship's radar has detected multiple enemy ships approaching.
# To maximize your defense, you must allocate appropriate shield power
# based on the threat levels of the approaching enemy ships!

# Instructions
# Modify this program to determine the correct shield power level
# based on enemy ship types. You need to allocate the shield power accordingly.

# Input
# The total number of enemy ships 'N'
# A list of ship names and their respective types ('Scout', 'Fighter', 'Destroyer')

# Output
# The appropriate shield level: Low, Medium, or High

def main():
    # Getting the number of enemy ships
    n = int(input("Enter the number of enemy ships: "))

    shield_power = "Low"  # Default shield power level

    # Loop to get the name and type of each enemy ship
    for i in range(n):
        ship_name = input(f"Enter the name of enemy ship {i + 1}: ")
        ship_type = input(f"Enter the type of {ship_name} (Scout/Fighter/Destroyer): ")

        # --- User Submission Area ---


    # --- End of User Submission Area ---

if __name__ == "__main__":
    main()
