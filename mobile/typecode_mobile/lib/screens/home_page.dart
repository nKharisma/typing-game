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
            selectedIcon: Icon(Icons.settings),
            icon: Icon(Icons.settings_outlined),
            label: 'Settings',
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
                  CircleAvatar(
                    radius: 50,
                    foregroundImage: AssetImage('fonts/tile022_scaled.png'),
                  ),
                  SizedBox(
                    height: 50,
                  ),
                  Text(
                    'my_stats.tsx',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontFamily: 'VCR',
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
                                alignment: Alignment.centerLeft,
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
                    SizedBox(height: 10,),
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
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white, fontFamily: 'VCR'),
        ),
        SizedBox(height: 20),
        Expanded(
          child: ListView.builder(
            itemCount: topics.length,
            itemBuilder: (context, index) {
              final topic = topics[index];
              return Card(
                child: ListTile(
                  title: Text(topic["title"]!),
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
      "explanation":
          "Variables in Java are used to store data values. Each variable has a specific data type.",
      "example": "int age = 25;\nString name = \"John\";"
    },
    "JavaScript": {
      "explanation":
          "Variables in JavaScript are containers for storing data values. You can use `var`, `let`, or `const`.",
      "example": "let age = 25;\nconst name = \"John\";"
    },
    "Python": {
      "explanation":
          "Variables in Python are dynamically typed, meaning you don’t need to declare their type.",
      "example": "age = 25\nname = \"John\""
    },
  },
  "conditionals": {
    "Java": {
      "explanation":
          "Conditional statements in Java allow you to execute different blocks of code based on conditions.",
      "example":
          "if (age > 18) {\n  System.out.println(\"Adult\");\n} else {\n  System.out.println(\"Minor\");\n}"
    },
    "JavaScript": {
      "explanation":
          "Conditional statements in JavaScript include `if`, `else`, and `else if`.",
      "example":
          "if (age > 18) {\n  console.log(\"Adult\");\n} else {\n  console.log(\"Minor\");\n}"
    },
    "Python": {
      "explanation":
          "Python uses indentation to define blocks of code for conditionals.",
      "example": "if age > 18:\n  print(\"Adult\")\nelse:\n  print(\"Minor\")"
    },
  },
  "loops": {
    "Java": {
      "explanation":
          "Loops in Java allow you to execute a block of code multiple times. Common loops are `for`, `while`, and `do-while`.",
      "example":
          "for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}\n\nint i = 0;\nwhile (i < 5) {\n  System.out.println(i);\n  i++;\n}"
    },
    "JavaScript": {
      "explanation":
          "JavaScript loops include `for`, `while`, and `do...while`. There are also enhanced loops like `for...of` and `for...in`.",
      "example":
          "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}"
    },
    "Python": {
      "explanation":
          "Python loops include `for` and `while`. The `range()` function is commonly used in `for` loops.",
      "example":
          "for i in range(5):\n  print(i)\n\ni = 0\nwhile i < 5:\n  print(i)\n  i += 1"
    },
  },
  "strings": {
    "Java": {
      "explanation":
          "Strings in Java are objects that represent a sequence of characters. They are immutable.",
      "example":
          "String message = \"Hello, World!\";\nSystem.out.println(message.toUpperCase());"
    },
    "JavaScript": {
      "explanation":
          "Strings in JavaScript are used to store text and can be manipulated using various methods.",
      "example":
          "let message = \"Hello, World!\";\nconsole.log(message.toUpperCase());"
    },
    "Python": {
      "explanation":
          "Strings in Python are sequences of characters and support many built-in methods.",
      "example": "message = \"Hello, World!\"\nprint(message.upper())"
    },
  },
  "arrays": {
    "Java": {
      "explanation":
          "Arrays in Java are used to store multiple values of the same type in a single variable.",
      "example":
          "int[] numbers = {1, 2, 3, 4, 5};\nSystem.out.println(numbers[0]);"
    },
    "JavaScript": {
      "explanation":
          "Arrays in JavaScript are dynamic and can hold values of different types.",
      "example": "let numbers = [1, 2, 3, 4, 5];\nconsole.log(numbers[0]);"
    },
    "Python": {
      "explanation":
          "Lists in Python are used as arrays and can store values of different types.",
      "example": "numbers = [1, 2, 3, 4, 5]\nprint(numbers[0])"
    },
  },
  "functions": {
    "Java": {
      "explanation":
          "Functions (methods) in Java are blocks of code that perform specific tasks and can return values.",
      "example":
          "public static int add(int a, int b) {\n  return a + b;\n}\n\nSystem.out.println(add(3, 5));"
    },
    "JavaScript": {
      "explanation":
          "Functions in JavaScript are blocks of reusable code that perform a specific task.",
      "example":
          "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(3, 5));"
    },
    "Python": {
      "explanation":
          "Functions in Python are defined using the `def` keyword and can return values.",
      "example": "def add(a, b):\n  return a + b\n\nprint(add(3, 5))"
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
      appBar: AppBar(
        foregroundColor: Colors.white,
        backgroundColor: Colors.transparent,
      ),
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Ensure this renders and animates correctly
          const AnimatedBackground(),

          // SafeArea to avoid overlaps with system UI
          SafeArea(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: ListView(
                shrinkWrap: true, // Ensure ListView only takes necessary space
                physics: BouncingScrollPhysics(), // Add smooth scrolling
                children: resource!.entries.map((entry) {
                  final language = entry.key;
                  final content = entry.value;
              
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '** $language **',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Explanation:',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Text(content["explanation"]!, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),),
                      SizedBox(height: 10),
                      Text(
                        'Example:',
                        style: TextStyle(fontWeight: FontWeight.normal, color: Colors.white),
                      ),
                      Container(
                        padding: EdgeInsets.all(10),
                        margin: EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Text(
                          content["example"]!,
                          style: TextStyle(fontFamily: 'monospace'),
                        ),
                      ),
                      Divider(),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
