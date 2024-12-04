// ignore_for_file: library_private_types_in_public_api, prefer_const_constructors, prefer_const_literals_to_create_immutables, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:typecode_mobile/screens/login_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  @override
  Widget build(BuildContext context) {
    final TextEditingController firstnameController = TextEditingController();
    final TextEditingController lastnameController = TextEditingController();
    final TextEditingController emailController = TextEditingController();
    final TextEditingController usernameController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();

    double width = MediaQuery.sizeOf(context).width;
    double percent = 0.85;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
      ),
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(children: [
          CircleAvatar(
            radius: 50,
            foregroundImage: NetworkImage(
              'https://lh3.googleusercontent.com/pw/AP1GczOcQAD9wLyYBAEt9cr-1tcNmki2EsNQj54oDdrukKsl0c44yFXx-uO-PvxT59fq1ZjZcOBanU8TZJHFzW-gesgIQj2cwwIne1WKPH74Zi09ur6HBqGa-AXmwz3U9hCiEQFQ6NcyFR-vsrXs39MAhiHaNA=w962-h1277-s-no-gm?authuser=0',
            ),
          ),
          SizedBox(
            height: 80,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 1),
            child: Row(
              children: [
                Icon(Icons.arrow_forward_ios, color: Colors.grey),
                SizedBox(
                  width: width * percent,
                  child: TextFormField(
                    controller: firstnameController, // Attach the controller
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'VCR',
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      prefixIcon:
                          Icon(Icons.person_4_outlined, color: Colors.grey),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      hintText: 'Enter your first name',
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
                SizedBox(
                  width: width * percent,
                  child: TextFormField(
                    controller: lastnameController, // Attach the controller
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'VCR',
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      prefixIcon:
                          Icon(Icons.person_4_outlined, color: Colors.grey),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      hintText: 'Enter your last name',
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
          SizedBox(height: 50),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 1),
            child: Row(
              children: [
                Icon(Icons.arrow_forward_ios, color: Colors.grey),
                SizedBox(
                  width: width * percent,
                  child: TextFormField(
                    controller: emailController, // Attach the controller
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'VCR',
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.mail_outline, color: Colors.grey),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      hintText: 'Enter your email',
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
                SizedBox(
                  width: width * percent,
                  child: TextFormField(
                    controller: usernameController, // Attach the controller
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'VCR',
                      fontSize: 14,
                    ),
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
                    //obscureText: true, // Mask the password input
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
                SizedBox(
                  width: width * percent,
                  child: TextFormField(
                    controller: passwordController, // Attach the controller
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'VCR',
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.lock_outline, color: Colors.grey),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      hintText: 'Enter your password',
                      hintStyle: TextStyle(color: Colors.white),
                    ),
                    keyboardType: TextInputType.text,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 15,
          ),
          BottomButton(
            buttonTitle: 'Register',
            onTap: () async {
              try {
                final response = await http.post(
                  Uri.parse(
                      'https://typecode.app/api/signup'), // replace with your API URL
                  headers: <String, String>{
                    'Content-Type': 'application/json',
                  },
                  body: jsonEncode(<String, String>{
                    'firstName': firstnameController.text.trim(),
                    'lastName': lastnameController.text.trim(),
                    'email': emailController.text.trim(),
                    'login': usernameController.text.trim(),
                    'password': passwordController.text.trim(),
                  }),
                );

                if (response.statusCode == 200) {
                  final user = jsonDecode(response.body);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => LoginPage(),
                    ),
                  );
                } else {
                  // Handle failure
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text('Signup Failed'),
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
              } catch (e) {
                // Show error dialog for network issues or unexpected exceptions
                showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: Text('Error'),
                      content: Text('An unexpected error occurred: $e'),
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
        ]),
      ),
    );

    //throw UnimplementedError();
  }
}
