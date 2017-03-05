# Trickturns
Comp 20 Spring 2017 Group Project

## Problem Statement:
Studying can be a bit of a bore, especially when it comes to memorizing information.

## Solution:
Trickturns is a trivia-based game that allows users to test their knowledge about various subjects in a fun and engaging way.
The concept of the game is as follows:
You want to make the most of your unlimited meal plan by making a swipe at the Kosher Deli and then swiping into Dewick within 15 minutes for a free meal. However, you come across your professors who have important questions about your courses before you can get past. Answer the questions and dodge obstacles (other students, cars) to navigate to the dining hall in order to successfully trickturn.

## Features to be implemented
- Server side framework of Express.js (which utilizes Node by design) 
- Front-end framework (likely will be Bootstrap)
- JavaScript Framework for games 
- Server side data persistance (in order to generate leaderboard)

## Data to be collected & used
We will have users input a username (possibly password as well) in order to generate a scoreboard at the completion of the game. This will allow for a competitive aspect of the game.

## Algorithms/Special Techniques
In the event that we would have many users for this game, we want the scoreboard to only render the top ten scores. Another important consideration is that we want "professors" to randomly pop up (but spaced out to some extent), with a randomly selected question.  We are also considering difficulty levels, so we could vary the rate of questions based on difficulty level.

## Mock-ups
