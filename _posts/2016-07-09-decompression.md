---
layout: post
title:  "Decompression"
date:   2016-07-09 09:00:00 -0500
categories: blog code
---
Week One is done! Here's what I've done/learned in the past four days:

  - Thinking modularly and pseudo-coding well will save your butt down the line.   
  - Pair programming provides ample motivation in the form of "man, I have to catch up" or "whoa, I didn't know you could do that".
  - My terminal and text-editor prowess has improved but there's still a long way to go.
  - A.I. is hard
  - Buy more snacks

<!--more-->
<br>

During the first week, we spent the majority of our time, working on command line games. One thing I've had to think about every time we build a new game is what kind of data structure would best fit. For games like Mastermind, the board and pieces are relatively simple to map out and subsequently render.

For projects like Connect Four and Tetris, things get a little more interesting. In Connect Four, we decided that an array of arrays was the simplest way to proceed. In the process of determining horizontal and diagonal wins, I wondered if a piece (or square) that is 'aware' of its surroundings might be more efficient. But considering you only have to consider win conditions for the last piece that was played, this might be a little overkill. Looking ahead, this type of association might be useful in a game like Minesweeper or any game that requires semi-real-time awareness.  

All in all, week one has been extremely productive. I've learned a lot about the meta of object oriented programming and begun the process of understanding TDD. I'm hoping the next week is just as educational.

See you on the other side!
