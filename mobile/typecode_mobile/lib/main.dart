import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.blue[900],
        appBar: AppBar(
          title: Center(
            child: Text(
              'I LOVE COP4331'
            )
          ),
          backgroundColor: Colors.blue,
        ),
        body: Center(
          child: Text(
            'TYPE CODE', 
            style: TextStyle(
              color: Colors.white
            ),
          ),
        ),
      ),
    );

  }
}

