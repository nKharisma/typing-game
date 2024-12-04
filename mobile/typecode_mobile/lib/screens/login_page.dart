// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last, library_private_types_in_public_api, prefer_const_constructors_in_immutables, use_key_in_widget_constructors, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:typecode_mobile/screens/home_page.dart';
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
  final TextEditingController emailController = TextEditingController();
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
                      controller: emailController, // Attach the controller
                      style: TextStyle(color: Colors.white, fontFamily: 'VCR', fontSize: 14,),
                      decoration: InputDecoration(
                        prefixIcon:
                            Icon(Icons.person_outline, color: Colors.grey),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                        hintText: 'Enter your email',
                        hintStyle: TextStyle(color: Colors.white, fontFamily: 'VCR', fontSize: 14,),
                      ),
                      keyboardType: TextInputType.text,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 50),
            PasswordField(passwordController: passwordController),
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
                  builder: (context) => MainAppPage(userId: '5'),
                )
              );
              },*/

              onTap: () async {
                print(emailController.text);
                print(passwordController.text);
                final response = await http.post(
                  Uri.parse(
                      'https://typecode.app/api/v1/user/login'), // replace with your API URL
                  headers: <String, String>{
                    'Content-Type': 'application/json',
                  },
                  body: jsonEncode(<String, String>{
                    'email':
                        emailController.text.trim(), // Use the input value
                    'password':
                        passwordController.text.trim() // Use the input value
                  }),
                );

                if (response.statusCode == 200) {
                  final user = jsonDecode(response.body);
                  print(user);
                  String userId = user['id'];
                  // Login successful, navigate to the main app page
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MainAppPage(userId: userId),
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
              fontFamily: 'VCR',
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

class PasswordField extends StatefulWidget {
  final TextEditingController passwordController;

  const PasswordField({Key? key, required this.passwordController})
      : super(key: key);

  @override
  _PasswordFieldState createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool isPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 1),
      child: Row(
        children: [
          const Icon(Icons.arrow_forward_ios, color: Colors.grey),
          Expanded(
            child: TextFormField(
              controller: widget.passwordController, // Attach the controller
              style: const TextStyle(
                color: Colors.white,
                fontFamily: 'VCR',
                fontSize: 14,
              ),
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.lock_outline, color: Colors.grey),
                suffixIcon: IconButton(
                  icon: Icon(
                    isPasswordVisible
                        ? Icons.visibility
                        : Icons.visibility_off,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    setState(() {
                      isPasswordVisible = !isPasswordVisible;
                    });
                  },
                ),
                enabledBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey),
                ),
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white),
                ),
                hintText: 'Enter your password',
                hintStyle: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'VCR',
                  fontSize: 14,
                ),
              ),
              obscureText: !isPasswordVisible, // Toggle masking
              keyboardType: TextInputType.text,
              autovalidateMode: AutovalidateMode.onUserInteraction,
            ),
          ),
        ],
      ),
    );
  }
}


/*labelText: 'Username',
                        labelStyle: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.white,
                        ),*/

