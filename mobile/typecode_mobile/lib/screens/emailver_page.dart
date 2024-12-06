// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, library_private_types_in_public_api, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'login_page.dart';

String useremail = 'testing';

class EmailverPage extends StatefulWidget {
  EmailverPage({super.key, required String email}) {
    useremail = email;
  }

  @override
  _EmailverPageState createState() => _EmailverPageState();
}

class _EmailverPageState extends State<EmailverPage> {
  final TextEditingController _codeController = TextEditingController();
  bool isLoading = false;
  String? errorMessage;

  void initState() {
    super.initState();
    _sendVerificationCode(forceResend: false);
  }

  Future<void> _sendVerificationCode({required bool forceResend}) async {
    print(useremail);
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final url =
        Uri.parse('https://typecode.app/api/v1/user/send-verification-code');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': useremail, 'forceResend': forceResend}),
    );

    setState(() {
      isLoading = false;
    });

    print('Response body: ${response.body}'); // Add this line

    if (response.statusCode == 201) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Verification code sent successfully.'),
            backgroundColor: Colors.red),
      );
    } else if (response.statusCode == 500) {
      print('bruh');
    } else {
      print('response code is ${response.statusCode}');
      try {
        final error = jsonDecode(response
            .body); // This line may fail if the response body is not JSON
        setState(() {
          errorMessage =
              error['message'] ?? 'Failed to send verification code.';
        });
      } catch (e) {
        print('Error decoding JSON: $e'); // Add logging for the decoding error
        setState(() {
          errorMessage = 'Unexpected response from the server.';
        });
      }
    }

    print('\n\n');
    print(errorMessage ?? 'null');
    print('\n\n');
  }

  Future<void> _checkVerificationCode() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final url =
        Uri.parse('https://typecode.app/api/v1/user/check-verification-code');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': useremail, 'emailCode': _codeController.text}),
    );

    setState(() {
      isLoading = false;
    });

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LoginPage(),
          ));
      // Navigate to the next page
    } else {
      final error = jsonDecode(response.body);
      setState(() {
        errorMessage = error['message'] ?? 'Failed to verify code.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.sizeOf(context).width;
    double percent = 0.85;
    return Scaffold(
      backgroundColor: Color(0xFF090A0F),
      body: Stack(
        children: [
          const AnimatedBackground(),
          SafeArea(
            child: Column(children: [
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
              SizedBox(
                height: 80,
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'A verification code has been sent to ${useremail}.',
                            style: TextStyle(
                                color: Colors.white,
                                fontFamily: 'VCR',
                                fontSize: 14),
                          ),
                          if (errorMessage != null)
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 8.0),
                              child: Text(
                                errorMessage!,
                                style: const TextStyle(color: Colors.red),
                              ),
                            ),
                          const SizedBox(height: 20),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 1),
                            child: Row(
                              children: [
                                Icon(Icons.arrow_forward_ios,
                                    color: Colors.grey),
                                SizedBox(
                                  width: width * percent,
                                  child: TextFormField(
                                    controller:
                                        _codeController, // Attach the controller
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontFamily: 'VCR',
                                      fontSize: 14,
                                    ),
                                    decoration: InputDecoration(
                                      prefixIcon: Icon(Icons.lock_outlined,
                                          color: Colors.grey),
                                      enabledBorder: UnderlineInputBorder(
                                        borderSide:
                                            BorderSide(color: Colors.grey),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderSide:
                                            BorderSide(color: Colors.white),
                                      ),
                                      hintText: 'Enter your verification code',
                                      hintStyle: TextStyle(
                                        color: Colors.white,
                                        fontFamily: 'VCR',
                                      ),
                                    ),
                                    //obscureText: true, // Mask the password input
                                    keyboardType: TextInputType.text,
                                    autovalidateMode:
                                        AutovalidateMode.onUserInteraction,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: _checkVerificationCode,
                            child: const Text(
                              'Verify',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                  fontSize: 14),
                            ),
                          ),
                          TextButton(
                            onPressed: () =>
                                _sendVerificationCode(forceResend: true),
                            child: const Text(
                              'Resend Code',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'VCR',
                                  fontSize: 14),
                            ),
                          ),
                        ],
                      ),
              ),
            ]),
          ),
        ],
      ),
    );
  }
}
