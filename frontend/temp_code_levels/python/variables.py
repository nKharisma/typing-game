# Your spaceship's radar system has detected multiple enemy ships approaching.
# To maximize your defense, you must destroy the closest enemy ship!

# Instructions
# Modify this program to calculate the distance of each enemy ship from your spaceship.
# Identify and shoot the closest enemy ship by outputting its name.

# Input
# The total number of enemy ships 'N'
# A list of ship names and their respective distances from your spaceship

# Output
# The name of the closest ship

def main():
    # Getting the number of enemy ships
    n = int(input("Enter the number of enemy ships: "))

    closest_ship_name = ""
    closest_distance = float('inf')

    # Loop to get the name and distance of each enemy ship
    for i in range(n):
        ship_name = input(f"Enter the name of enemy ship {i + 1}: ")
        distance = int(input(f"Enter the distance of {ship_name} from your spaceship: "))

        # --- User Submission Area ---
        # Update the closest ship if the current one is closer
        # Feel free to modify the logic below to determine the closest ship



    # --- End of User Submission Area ---

if __name__ == "__main__":
    main()
