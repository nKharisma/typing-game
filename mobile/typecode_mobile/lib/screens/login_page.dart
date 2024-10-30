// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last

import 'package:flutter/material.dart';
import 'package:typecode_mobile/screens/profile_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
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
            SizedBox(
              height: 100,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Row(
                children: [
                  Text(
                    'Login',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.left,
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 50,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1),
              child: Row(
                children: [
                  Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.grey,
                  ),
                  Expanded(
                    child: TextFormField(
                      style: TextStyle(
                        color: Colors.white,
                      ),
                      decoration: InputDecoration(
                        prefixIcon: Icon(
                          Icons.person_outline,
                          color: Colors.grey,
                        ),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                        hintText: 'Enter your username',
                        hintStyle: TextStyle(
                          color: Colors.white,
                        ),
                        
                        /*labelText: 'Username',
                        labelStyle: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.white,
                        ),*/
                      ),
                      keyboardType: TextInputType.text,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 50,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1),
              child: Row(
                children: [
                  Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.grey,
                  ),
                  Expanded(
                    child: TextFormField(
                      style: TextStyle(
                        color: Colors.white,
                      ),
                      decoration: InputDecoration(
                        prefixIcon: Icon(
                          Icons.lock_outline,
                          color: Colors.grey,
                        ),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                        hintText: 'Enter your password',
                        hintStyle: TextStyle(
                          color: Colors.white,
                        ),
                        
                        /*labelText: 'Username',
                        labelStyle: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.white,
                        ),*/
                      ),
                      keyboardType: TextInputType.text,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 50,
            ),
            BottomButton(
            buttonTitle: 'Login', 
            onTap: () {
              
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfilePage(),
                )
              );
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

