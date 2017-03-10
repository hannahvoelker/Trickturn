# Trickturn
Comp 20 Spring 2017 Group Project

## Problem Statement:
Studying can be a bit of a bore, especially when it comes to memorizing information.

## Solution:
Trickturns is a trivia-based game that allows users to test their knowledge about various subjects in a fun and engaging way.
The concept of the game is as follows:
You want to make the most of your unlimited meal plan by swiping into Dewick before the dinner period starts. You accidentally lost track of time in Halligan, and now you only have a few minutes left to get to Dewick! However, as you run to Dewick, you come across your professors who have important questions about your courses before you can get past. Answer the questions and dodge obstacles (other students, cars) to navigate to the dining hall in order to successfully trickturn.

## Technologies to be used & features to be implemented
- The player will navigate through a top-down game map that roughly approximates the path from Halligan to Dewick. The main game engine will be Phaser.io
- Along the way, they will encounter two main game features:
  	-Obstacles that they must avoid, mainly in the form of cars
		   -If they collide with the obstacle, they will be bounced backwards and there will be a score penalty
	-Professors asking review questions
		    -Correct answers gain points, wrong answers take away from those gained points
		    -The time taken to answer the question does continue to run the total game clock
- There will be a leaderboard to compete for the high score
  	- This will use server side data persistance, using a server side framework of Express.js (which utilizes Node by design)
- The base of the site will use a front-end framework (likely Bootstrap)

## Data to be collected & used
We will have users input a username (possibly password as well) in order to generate a scoreboard at the completion of the game. This will allow for a competitive aspect of the game. No other data will be collected.

## Algorithms/Special Techniques
In the event that we would have many users for this game, we want the scoreboard to only render the top ten scores. Another important consideration is that we want "professors" to pop up at checkpoints with a randomly selected question.  We are also considering difficulty levels, so we could vary the rate of questions based on difficulty level.

## Mock-ups: See associated wireframes