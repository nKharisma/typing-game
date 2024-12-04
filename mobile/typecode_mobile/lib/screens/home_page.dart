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
        Container(
          color: Colors.black,
          child: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(
                  height: 150,
                ),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      foregroundImage: NetworkImage(
                        'https://lh3.googleusercontent.com/pw/AP1GczOcQAD9wLyYBAEt9cr-1tcNmki2EsNQj54oDdrukKsl0c44yFXx-uO-PvxT59fq1ZjZcOBanU8TZJHFzW-gesgIQj2cwwIne1WKPH74Zi09ur6HBqGa-AXmwz3U9hCiEQFQ6NcyFR-vsrXs39MAhiHaNA=w962-h1277-s-no-gm?authuser=0',
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          'Username will go here soon',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Level will go here soon',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Level progress bar will go here soon',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(
                  height: 50,
                ),
                Text(
                  'my_stats.tsx',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
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
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Score: ${userStats!['score']}',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Text(
                                  'Highscore: ${userStats!['highscore']}',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Text(
                                  'Words Per Minute: ${userStats!['wordsPerMinute']}',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Text(
                                  'Total Words Typed: ${userStats!['totalWordsTyped']}',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Text(
                                  'Accuracy: ${userStats!['accuracy']}%',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Text(
                                  'Levels Completed: ${userStats!['levelsCompleted']}',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ],
                            ),
                          ),
              ],
            ),
          ),
        ),

        /// Leaderboard page
        Container(
  color: Colors.black, // Background color for the entire screen
  child: SafeArea(
    child: Column(
      children: [
        const SizedBox(height: 20),
        const Text(
          'Leaderboard',
          style: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'VCR'),
        ),
        const SizedBox(height: 10),
        DropdownButton<String>(
          value: selectedSortBy,
          dropdownColor: Colors.grey[800],
          icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
          underline: Container(height: 1, color: Colors.white),
          style: const TextStyle(color: Colors.white, fontFamily: 'VCR'),
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
                        return Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8.0, // Add vertical spacing
                            horizontal: 8.0, // Add horizontal spacing
                          ),
                          child: Material(
                            color: Colors.white, // Background color for the tile
                            borderRadius: BorderRadius.circular(8.0), // Optional: rounded corners
                            elevation: 2.0, // Optional: adds shadow for a card effect
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              title: Text(
                                '#$rank: ${entry['name']}',
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontFamily: 'VCR',
                                ),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 4),
                                  Text(
                                    'High Score: ${entry['playerdata']['highScore']}\n'
                                    'Words Per Minute: ${entry['playerdata']['wordsPerMinute']}\n'
                                    'Total Words Typed: ${entry['playerdata']['totalWordsTyped']}\n'
                                    'Accuracy: ${entry['playerdata']['accuracy']}\n'
                                    'Levels Completed: ${entry['playerdata']['levelsCompleted']}',
                                    style: const TextStyle(
                                      color: Colors.black,
                                      fontFamily: 'VCR',
                                    ),
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
),

Container(
  color: Colors.black,
  child: SafeArea(
    child: Column(
      children: [
        SizedBox(height: 100,),
        BottomButton(
          onTap:() {
                Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => LoginPage(),
                )
              );
          },
        buttonTitle: 'LOGOUT')
      ],
    ) 
  ),
),


      ][currentPageIndex],
    );
  }
}
