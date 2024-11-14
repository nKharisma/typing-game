// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last, library_private_types_in_public_api, prefer_const_constructors_in_immutables, use_key_in_widget_constructors, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:typecode_mobile/screens/profile_page.dart';
import 'package:typecode_mobile/screens/signup_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Create TextEditingController instances
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              foregroundImage: NetworkImage(
                'https://lh3.googleusercontent.com/pw/AP1GczOcQAD9wLyYBAEt9cr-1tcNmki2EsNQj54oDdrukKsl0c44yFXx-uO-PvxT59fq1ZjZcOBanU8TZJHFzW-gesgIQj2cwwIne1WKPH74Zi09ur6HBqGa-AXmwz3U9hCiEQFQ6NcyFR-vsrXs39MAhiHaNA=w962-h1277-s-no-gm?authuser=0',
              ),
            ),
            SizedBox(height: 100),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Row(
                children: [
                  Text(
                    'Login',
                    style: TextStyle(
                      fontFamily: 'VCR',
                      color: Colors.white,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.left,
                  ),
                ],
              ),
            ),
            SizedBox(height: 50),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1),
              child: Row(
                children: [
                  Icon(Icons.arrow_forward_ios, color: Colors.grey),
                  Expanded(
                    child: TextFormField(
                      controller: usernameController, // Attach the controller
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        prefixIcon:
                            Icon(Icons.person_outline, color: Colors.grey),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                        hintText: 'Enter your username',
                        hintStyle: TextStyle(color: Colors.white),
                      ),
                      keyboardType: TextInputType.text,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 50),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1),
              child: Row(
                children: [
                  Icon(Icons.arrow_forward_ios, color: Colors.grey),
                  Expanded(
                    child: TextFormField(
                      controller: passwordController, // Attach the controller
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        prefixIcon:
                            Icon(Icons.lock_outline, color: Colors.grey),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                        hintText: 'Enter your password',
                        hintStyle: TextStyle(color: Colors.white),
                      ),
                      //obscureText: true, // Mask the password input
                      keyboardType: TextInputType.text,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 30),
            Row(
              children: [
                SizedBox(width: 27,),
                Text(
                  "Don't have an account? ",
                  style: TextStyle(
                    color: Colors.white,
                    //decoration: TextDecoration.underline,
                  ),
                ),
                InkWell(
                    child: Text(
                      'Register here',
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SignupPage(),
                          ));
                    }),
              ],
            ),
            SizedBox(height: 15,),
            BottomButton(
              buttonTitle: 'Login',
              /*onTap:() {
                Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MainAppPage(),
                )
              );
              },*/

              onTap: () async {
                print(usernameController.text);
                print(passwordController.text);
                final response = await http.post(
                  Uri.parse(
                      'https://typecode.app/api/login'), // replace with your API URL
                  headers: <String, String>{
                    'Content-Type': 'application/json',
                  },
                  body: jsonEncode(<String, String>{
                    'login':
                        usernameController.text.trim(), // Use the input value
                    'password':
                        passwordController.text.trim() // Use the input value
                  }),
                );

                if (response.statusCode == 200) {
                  final user = jsonDecode(response.body);
                  // Login successful, navigate to the main app page
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MainAppPage(),
                    ),
                  );
                } else {
                  // Handle login failure by showing an alert dialog
                  print(response.statusCode);
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text('Login Failed'),
                        content: Text(jsonDecode(response.body)['error']),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

class BottomButton extends StatelessWidget {
  BottomButton({required this.onTap, required this.buttonTitle});

  final String buttonTitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        child: Center(
          child: Text(
            buttonTitle,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24), // Adds rounded edges
        ),
        margin: EdgeInsets.only(top: 20, left: 25, right: 25),
        padding: EdgeInsets.symmetric(vertical: 20),
        width: double.infinity,
        height: 80,
      ),
    );
  }
}

/*labelText: 'Username',
                        labelStyle: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.white,
                        ),*/

