// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'login_page.dart';

String user = 'haha';

class MainAppPage extends StatelessWidget {
  MainAppPage({super.key, required String userId}) {
    user = userId;
    print(userId);
    print(user);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: const MainAppNavigation(),
    );
  }
}

class MainAppNavigation extends StatefulWidget {
  const MainAppNavigation({super.key});

  @override
  State<MainAppNavigation> createState() => _MainAppNavigationState();
}

class _MainAppNavigationState extends State<MainAppNavigation> {
  int currentPageIndex = 0;

  Map<String, dynamic>? userStats;
  bool isLoading = true;
  String? errorMessage;

  List<dynamic>? leaderboardData;
  bool isLeaderboardLoading = true;
  String? leaderboardErrorMessage;

  String selectedSortBy = 'highScore';
  final List<String> sortByOptions = [
    'highScore',
    'wordsPerMinute',
    'totalWordsTyped',
    'accuracy',
    'levelsCompleted',
  ];

  @override
  void initState() {
    super.initState();
    fetchUserStats();
    fetchLeaderboard();
  }

  Future<void> fetchUserStats() async {
    try {
      final response = await http.post(
        Uri.parse('https://typecode.app/api/v1/user/get-player-data'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'id': user // Pass the user ID in the request body
        }),
      );

      if (response.statusCode == 200) {
        print(jsonDecode(response.body));
        setState(() {
          userStats = jsonDecode(response.body); // Parse the JSON response
          isLoading = false;
        });
      } else {
        // Handle errors, e.g., user not found
        setState(() {
          errorMessage = jsonDecode(response.body)['error'];
          isLoading = false;
        });
      }
    } catch (e) {
      // Handle connection or parsing errors
      setState(() {
        errorMessage = 'An error occurred: $e';
        isLoading = false;
      });
    }
  }

  Future<void> fetchLeaderboard() async {
    setState(() {
      isLeaderboardLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('https://typecode.app/api/v1/user/get-leaderboard'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'sortBy': selectedSortBy, // Adjust as needed
          'limit': 100, // Adjust the limit as needed
        }),
      );

      if (response.statusCode == 200) {
        print('Response body: ${response.body}');
        setState(() {
          leaderboardData = jsonDecode(response.body)['leaderboard'];
          isLeaderboardLoading = false;
        });
      } else {
        setState(() {
          leaderboardErrorMessage = jsonDecode(response.body)['error'];
          isLeaderboardLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        leaderboardErrorMessage = 'An error occurred: $e';
        isLeaderboardLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.black,
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
        },
        //indicatorColor: Colors.black,
        backgroundColor: Colors.white,
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(Icons.person),
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
          NavigationDestination(
            selectedIcon: Icon(Icons.people),
            icon: Icon(Icons.people_outline),
            label: 'Leaderboard',
          ),
          NavigationDestination(
            selectedIcon: Icon(Icons.document_scanner),
            icon: Icon(Icons.document_scanner_outlined),
            label: 'Resources',
          ),
        ],
      ),
      body: <Widget>[
        // Profile page
        Stack(
          children: [
            const AnimatedBackground(),
            SafeArea(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 150,
                  ),
                  SizedBox(
                    height: 50,
                  ),
                  Align(
                    alignment: Alignment.center,
                    child: Text(
                      'my_stats.tsx',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontFamily: 'VCR',
                      ),
                    ),
                  ),
                  isLoading
                      ? Center(child: CircularProgressIndicator())
                      : errorMessage != null
                          ? Center(
                              child: Text(
                              errorMessage!,
                              style: TextStyle(color: Colors.white),
                            ))
                          : Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Align(
                                alignment: Alignment.center,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Score: ${userStats!['score']}',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      'Highscore: ${userStats!['highScore']}',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      'Words Per Minute: ${userStats!['wordsPerMinute']}',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      'Total Words Typed: ${userStats!['totalWordsTyped']}',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      'Accuracy: ${userStats!['accuracy']}%',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      'Levels Completed: ${userStats!['levelsCompleted']}',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'VCR'),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                  SizedBox(
                    height: 50,
                  ),
                  Image.asset(
                    'fonts/tile022_scaled.png',
                    width: 100, // Optional: Set width
                    height: 100, // Optional: Set height
                    fit: BoxFit
                        .cover, // Adjust how the image is fitted in its box
                  ),
                ],
              ),
            ),
          ],
        ),

        /// Leaderboard page
        Stack(
          children: [
            const AnimatedBackground(),
            SafeArea(
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  const Text(
                    'Leaderboard',
                    style: TextStyle(
                        color: Colors.white, fontSize: 24, fontFamily: 'VCR'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButton<String>(
                    value: selectedSortBy,
                    dropdownColor: Colors.grey[800],
                    icon:
                        const Icon(Icons.arrow_drop_down, color: Colors.white),
                    underline: Container(height: 1, color: Colors.white),
                    style:
                        const TextStyle(color: Colors.white, fontFamily: 'VCR'),
                    items: sortByOptions.map((String option) {
                      return DropdownMenuItem<String>(
                        value: option,
                        child: Text(option),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          selectedSortBy = newValue;
                        });
                        fetchLeaderboard();
                      }
                    },
                  ),
                  const SizedBox(height: 20),
                  isLeaderboardLoading
                      ? const Center(child: CircularProgressIndicator())
                      : leaderboardErrorMessage != null
                          ? Center(
                              child: Text(
                                leaderboardErrorMessage!,
                                style: const TextStyle(color: Colors.red),
                              ),
                            )
                          : Expanded(
                              child: ListView.builder(
                                itemCount: leaderboardData!.length,
                                itemBuilder: (context, index) {
                                  final entry = leaderboardData![index];
                                  final rank = index + 1; // Calculate rank

                                  // Define styles for the top 3
                                  Color backgroundColor;
                                  Color textColor;
                                  String? badgeIcon;

                                  if (rank == 1) {
                                    backgroundColor = Colors.amber[700]!;
                                    textColor = Colors.white;
                                    badgeIcon = '🥇';
                                  } else if (rank == 2) {
                                    backgroundColor = Colors.grey[500]!;
                                    textColor = Colors.white;
                                    badgeIcon = '🥈';
                                  } else if (rank == 3) {
                                    backgroundColor = Colors.brown[400]!;
                                    textColor = Colors.white;
                                    badgeIcon = '🥉';
                                  } else {
                                    backgroundColor = Colors.white;
                                    textColor = Colors.black;
                                  }

                                  return Padding(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 8.0,
                                      horizontal: 8.0,
                                    ),
                                    child: Material(
                                      color: backgroundColor,
                                      borderRadius: BorderRadius.circular(8.0),
                                      elevation: rank <= 3 ? 4.0 : 2.0,
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            // Rank and username at the top
                                            Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              children: [
                                                if (badgeIcon != null) ...[
                                                  Text(
                                                    badgeIcon,
                                                    style: const TextStyle(
                                                        fontSize: 24),
                                                  ),
                                                  const SizedBox(width: 8),
                                                ],
                                                Flexible(
                                                  child: Text(
                                                    '#$rank: ${entry['name']}',
                                                    style: TextStyle(
                                                      color: textColor,
                                                      fontFamily: 'VCR',
                                                      fontWeight: rank <= 3
                                                          ? FontWeight.bold
                                                          : FontWeight.normal,
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 12),
                                            // Profile picture and stats in one row
                                            Row(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                // Stats aligned with profile picture
                                                Expanded(
                                                  child: Text(
                                                    'High Score: ${entry['playerdata']['highScore']}\n'
                                                    'Words Per Minute: ${entry['playerdata']['wordsPerMinute']}\n'
                                                    'Total Words Typed: ${entry['playerdata']['totalWordsTyped']}\n'
                                                    'Accuracy: ${entry['playerdata']['accuracy']}\n'
                                                    'Levels Completed: ${entry['playerdata']['levelsCompleted']}',
                                                    style: TextStyle(
                                                      color: textColor,
                                                      fontFamily: 'VCR',
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                ),
                                                CircleAvatar(
                                                  radius:
                                                      50, // Adjust size as needed
                                                  foregroundImage: NetworkImage(
                                                    'https://lh3.googleusercontent.com/pw/AP1GczOcQAD9wLyYBAEt9cr-1tcNmki2EsNQj54oDdrukKsl0c44yFXx-uO-PvxT59fq1ZjZcOBanU8TZJHFzW-gesgIQj2cwwIne1WKPH74Zi09ur6HBqGa-AXmwz3U9hCiEQFQ6NcyFR-vsrXs39MAhiHaNA=w962-h1277-s-no-gm?authuser=0',
                                                  ),
                                                  backgroundColor: Colors.grey[
                                                      300], // Placeholder background
                                                ),
                                                const SizedBox(width: 16),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                ],
              ),
            ),
          ],
        ),

        Stack(
          children: [
            const AnimatedBackground(),
            SafeArea(
                child: Column(
              children: [
                SizedBox(
                  height: 100,
                ),
                Expanded(child: ResourcesPage()),
                BottomButton(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LoginPage(),
                          ));
                    },
                    buttonTitle: 'LOGOUT'),
                SizedBox(
                  height: 10,
                ),
              ],
            )),
          ],
        ),
      ][currentPageIndex],
    );
  }
}

class ResourcesPage extends StatelessWidget {
  final List<Map<String, String>> topics = [
    {"title": "Variables", "page": "variables"},
    {"title": "Conditionals", "page": "conditionals"},
    {"title": "Loops", "page": "loops"},
    {"title": "Strings", "page": "strings"},
    {"title": "Arrays", "page": "arrays"},
    {"title": "Functions", "page": "functions"},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Coding Resources',
          style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontFamily: 'VCR'),
        ),
        SizedBox(height: 20),
        Expanded(
          child: ListView.builder(
            itemCount: topics.length,
            itemBuilder: (context, index) {
              final topic = topics[index];
              return Card(
                child: ListTile(
                  title: Text(
                    topic["title"]!,
                    style: TextStyle(
                      fontFamily: 'VCR',
                    ),
                  ),
                  trailing: Icon(Icons.arrow_forward),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ResourceDetailPage(topic: topic),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

final Map<String, Map<String, Map<String, String>>> resources = {
  "variables": {
    "Java": {
      "explanation": """
Variables in Java are used to store data. Each variable has a specific data type, such as int, double, or String. 

Types of variables:
1. Local: Declared inside methods and accessible only within their scope.
2. Instance: Declared in a class and tied to an object.
3. Static: Declared with the static keyword and shared across all objects of a class.
    """,
      "example": """
// Local variable
void displayAge() {
    int age = 25;
    System.out.println("Age: " + age);
}

// Instance variable
class Person {
    String name;
    int age;
}

// Static variable
class Counter {
    static int count = 0;
}
    """
    },
  },
  "conditionals": {
    "Java": {
      "explanation": """
Conditional statements allow the execution of specific blocks of code based on conditions. Java supports several conditional constructs:
1. if-else: Executes a block of code if a condition is true; otherwise, executes another block.
2. switch: Evaluates a variable against multiple possible values (cases).
3. Ternary Operator: A concise way to write simple conditional logic.

Conditionals are essential for decision-making in programs.
      """,
      "example": """
// if-else
if (age > 18) {
    System.out.println("Adult");
} else if (age == 18) {
    System.out.println("Just turned adult");
} else {
    System.out.println("Minor");
}

// switch
String grade = "A";
switch (grade) {
    case "A":
        System.out.println("Excellent");
        break;
    case "B":
        System.out.println("Good");
        break;
    default:
        System.out.println("Needs Improvement");
}
      """
    },
  },
  "loops": {
    "Java": {
      "explanation": """
Loops are constructs that allow the execution of a block of code repeatedly. Java offers three primary looping constructs:
1. for: Ideal for when the number of iterations is known.
2. while: Executes as long as the condition remains true.
3. do-while: Similar to while, but guarantees the loop body executes at least once.

Loops often involve counters or conditions that determine when to stop the iteration.
      """,
      "example": """
// for loop
for (int i = 0; i < 5; i++) {
    System.out.println("Iteration: " + i);
}

// while loop
int i = 0;
while (i < 5) {
    System.out.println("Iteration: " + i);
    i++;
}

// do-while loop
int j = 0;
do {
    System.out.println("Iteration: " + j);
    j++;
} while (j < 5);
      """
    },
  },
  "strings": {
    "Java": {
      "explanation": """
Strings in Java are sequences of characters enclosed in double quotes. They are immutable, meaning their content cannot be changed once created. Modifying a string creates a new object.

Strings offer rich methods for manipulation:
1. Concatenation: Joining strings using + or concat().
2. Transformation: Changing case, trimming spaces, replacing characters.
3. Analysis: Checking length, comparing strings, finding substrings.
      """,
      "example": """
String greeting = "Hello, ";
String name = "John";
String fullGreeting = greeting + name;

System.out.println(fullGreeting); // Outputs "Hello, John"
System.out.println(fullGreeting.length()); // Outputs 11
System.out.println(fullGreeting.toUpperCase()); // Outputs "HELLO, JOHN"
System.out.println(fullGreeting.contains("John")); // Outputs true
      """
    },
  },
  "arrays": {
    "Java": {
      "explanation": """
An array is a collection of elements of the same data type stored in contiguous memory. Arrays have a fixed size, which must be specified when creating them.

Key operations include:
1. Accessing elements: Using an index (starting at 0).
2. Iterating through elements: Using loops.
3. Manipulating elements: Updating values.
      """,
      "example": """
int[] numbers = {1, 2, 3, 4, 5}; // Declare and initialize
System.out.println(numbers[0]); // Access the first element

// Loop through array
for (int num : numbers) {
    System.out.println(num);
}

// Update an element
numbers[2] = 10; // Update the third element
System.out.println(numbers[2]); // Outputs 10
      """
    },
  },
  "functions": {
    "Java": {
      "explanation": """
Functions, or methods, in Java encapsulate reusable blocks of code. A method can have parameters, return a value, or perform specific tasks.

Types of methods:
1. Static Methods: Called on the class itself without creating an object.
2. Instance Methods: Require an object to invoke.
3. Main Method: The entry point for every Java program.
      """,
      "example": """
// Static method
public static int add(int a, int b) {
    return a + b;
}

// Instance method
class Calculator {
    public int multiply(int a, int b) {
        return a * b;
    }
}

public static void main(String[] args) {
    System.out.println(add(3, 5)); // Static method call

    Calculator calc = new Calculator(); // Create an object
    System.out.println(calc.multiply(3, 5)); // Instance method call
}
      """
    },
  },
};

class ResourceDetailPage extends StatelessWidget {
  final Map<String, String> topic;

  ResourceDetailPage({required this.topic});

  @override
  Widget build(BuildContext context) {
    final topicName = topic["page"]!;
    final resource = resources[topicName];

    return Scaffold(
      extendBodyBehindAppBar:
          true, // Allow the body to extend behind the AppBar
      appBar: AppBar(
        foregroundColor: Colors.white,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      backgroundColor:
          Color(0xFF090A0F), // Set background color of Scaffold to avoid purple
      body: Stack(
        children: [
          // Animated background
          const AnimatedBackground(),

          // Content using CustomScrollView for better control
          SafeArea(
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Topic name as title
                        Align(
                          alignment: Alignment.topCenter,
                          child: Text(
                            topicName.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'VCR',
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // ListView for resource content
                        ...resource!.entries.map((entry) {
                          final language = entry.key;
                          final content = entry.value;

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '** $language **',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                ),
                              ),
                              const SizedBox(height: 10),
                              const Text(
                                'Explanation:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                  fontSize: 16,
                                ),
                              ),
                              SizedBox(height: 10),
                              Text(
                                content["explanation"]!,
                                style: const TextStyle(
                                  fontWeight: FontWeight.normal,
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                ),
                              ),
                              const SizedBox(height: 10),
                              const Text(
                                'Example:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(10),
                                margin:
                                    const EdgeInsets.symmetric(vertical: 10),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade200.withOpacity(0.9),
                                  borderRadius: BorderRadius.circular(5),
                                ),
                                child: Text(
                                  content["example"]!,
                                  style:
                                      const TextStyle(fontFamily: 'monospace'),
                                ),
                              ),
                              const Divider(),
                            ],
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
