// ignore_for_file: use_build_context_synchronously, prefer_const_constructors

import 'dart:math';
import 'package:flutter/material.dart';
import 'package:typecode_mobile/screens/home_page.dart';
import 'package:typecode_mobile/screens/signup_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF090A0F),
      body: Stack(
        children: [
          const AnimatedBackground(),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'fonts/tile022_scaled.png',
                    width: 100, // Optional: Set width
                    height: 100, // Optional: Set height
                    fit: BoxFit
                        .cover, // Adjust how the image is fitted in its box
                  ),
                  const SizedBox(height: 50),
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
                  SizedBox(
                    height: 50,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 1),
                    child: Row(
                      children: [
                        Icon(Icons.arrow_forward_ios, color: Colors.grey),
                        Expanded(
                          child: TextFormField(
                            controller:
                                emailController, // Attach the controller
                            style: TextStyle(
                              color: Colors.white,
                              fontFamily: 'VCR',
                              fontSize: 14,
                            ),
                            decoration: InputDecoration(
                              prefixIcon: Icon(Icons.person_outline,
                                  color: Colors.grey),
                              enabledBorder: UnderlineInputBorder(
                                borderSide: BorderSide(color: Colors.grey),
                              ),
                              focusedBorder: UnderlineInputBorder(
                                borderSide: BorderSide(color: Colors.white),
                              ),
                              hintText: 'Enter your email',
                              hintStyle: TextStyle(
                                color: Colors.white,
                                fontFamily: 'VCR',
                                fontSize: 14,
                              ),
                            ),
                            keyboardType: TextInputType.text,
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  PasswordField(passwordController: passwordController),
                  SizedBox(
                    height: 30,
                  ),
                  Row(
                    children: [
                      SizedBox(
                        width: 27,
                      ),
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
                  const SizedBox(height: 10),
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
                        try {
                          print(emailController.text);
                          print(passwordController.text);

                          final response = await http.post(
                            Uri.parse(
                                'https://typecode.app/api/v1/user/login'), // replace with your API URL
                            headers: <String, String>{
                              'Content-Type': 'application/json',
                            },
                            body: jsonEncode(<String, String>{
                              'email': emailController.text.trim(),
                              'password': passwordController.text.trim(),
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
                                builder: (context) =>
                                    MainAppPage(userId: userId),
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
                                  content:
                                      Text(jsonDecode(response.body)['error']),
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
                          print('Error: $e');
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text('An error occurred'),
                                content: Text('Something went wrong: $e'),
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
                      }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class AnimatedBackground extends StatefulWidget {
  const AnimatedBackground({super.key});

  @override
  _AnimatedBackgroundState createState() => _AnimatedBackgroundState();
}

class _AnimatedBackgroundState extends State<AnimatedBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Offset> _stars;
  final int _starCount = 100;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
    _stars = [];
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final size = MediaQuery.of(context).size;
    _generateStars(size);
  }

  void _generateStars(Size size) {
    setState(() {
      _stars = List.generate(_starCount, (_) {
        return Offset(
          Random().nextDouble() * size.width,
          Random().nextDouble() * size.height,
        );
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: MediaQuery.of(context).size,
          painter: StarPainter(_stars, _controller.value),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

class StarPainter extends CustomPainter {
  final List<Offset> stars;
  final double animationValue;

  StarPainter(this.stars, this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    for (int i = 0; i < stars.length; i++) {
      final star = stars[i];
      // Move the star upward
      final dy = star.dy - animationValue * size.height;
      final adjustedDy =
          dy < 0 ? dy + size.height : dy; // Wrap around to bottom
      canvas.drawCircle(Offset(star.dx, adjustedDy), 2, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
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
                    isPasswordVisible ? Icons.visibility : Icons.visibility_off,
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
