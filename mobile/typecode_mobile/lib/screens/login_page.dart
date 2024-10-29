import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget{

  Widget build(BuildContext context){

    return Scaffold(
      appBar: AppBar(
        title: Text('TYPE CODE'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Container(
              padding: EdgeInsets.all(15.0,),
              alignment: Alignment.bottomLeft,
              child: Text(
                'Your Result',
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );

  }

}