// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

String user = 'haha';

class MainAppPage extends StatelessWidget {
  MainAppPage({super.key, required String userId}){
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

  @override
  void initState() {
    super.initState();
    fetchUserStats();
  }
  
  Future<void> fetchUserStats() async {
    try {
      final response = await http.post(
        Uri.parse('https://typecode.app/api/getPlayerData'),
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
                SizedBox(height: 150,),
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
                SizedBox(height: 50,),
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
                ? Center(child: Text(errorMessage!))
                : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Score: ${userStats!['score']}', style: TextStyle(color: Colors.white),),
                      Text('Highscore: ${userStats!['highscore']}', style: TextStyle(color: Colors.white),),
                      Text('Words Per Minute: ${userStats!['wordsPerMinute']}', style: TextStyle(color: Colors.white),),
                      Text('Total Words Typed: ${userStats!['totalWordsTyped']}', style: TextStyle(color: Colors.white),),
                      Text('Accuracy: ${userStats!['accuracy']}%', style: TextStyle(color: Colors.white),),
                      Text('Levels Completed: ${userStats!['levelsCompleted']}', style: TextStyle(color: Colors.white),),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        /// Leaderboard page
        Container(
          color: Colors.black,
          child: SafeArea(
            child: Column(
              children: [
                
              ]
            ),
          ),
        ),

        // Settings page
        ListView.builder(
          reverse: true,
          itemCount: 2,
          itemBuilder: (BuildContext context, int index) {
            if (index == 0) {
              return Align(
                alignment: Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.all(8.0),
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Text(
                    'Hello',
                    style: theme.textTheme.bodyLarge!
                        .copyWith(color: theme.colorScheme.onPrimary),
                  ),
                ),
              );
            }
            return Align(
              alignment: Alignment.centerLeft,
              child: Container(
                margin: const EdgeInsets.all(8.0),
                padding: const EdgeInsets.all(8.0),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: Text(
                  'Hi!',
                  style: theme.textTheme.bodyLarge!
                      .copyWith(color: theme.colorScheme.onPrimary),
                ),
              ),
            );
          },
        ),
      ][currentPageIndex],
    );
  }
}
