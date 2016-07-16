---
layout: post
title:  "Lucho Con Algoritmos"
date:   2016-04-13 12:00:00 -0500
categories: blog code algorithms
---


I've been trying to crack this [problem], which on its face is relatively simple. The goal is to permutate a string and count all the premutations that do not have consecutive repeating characters. The check for consecutive repeats is a pretty easy regex comparison. The tricky part is coming up with an algorithm to permutate a string.

After mucking around for a bit, I found [Heap's algorithm], which looks to be the one of the more efficient ways to generate permutations through code.

<!--more-->
My interpretation in Javascript:

{% highlight javascript %}

function generate(n){
  if(n === 1){
    permutations.push(input.join(''));
  }else{
    for(var i = 0; i < n; i++){
      generate(n-1);
      if(n % 2 === 0){
        swap(i, n-1);
      }
      else{
        swap(0, n-1);
      }
    }
  }
}

function swap(one, two){
  var hold = input[one];
  input[one] = input[two];
  input[two] = hold;
}
{% endhighlight %}

Even after getting the code to do what I wanted it to do, it took a little while before the nature of the algorithm clicked in my head. There's something about recursion that throws my mind for a loop (cue rimshot), so I'm going to write out what I think is happening for my own edification.

So lets say we're given the string "abc". The generate function will kick down in a branch where n = 3 and i = 0, until n = 1. When n = 1, the first string, "abc", is pushed into the permutations array. After storing the first item, the function will resolve and continue the if statement in the for-loop with n = 2 and i = 0 (still on the n = 3 / i = 0 branch).

{% highlight javascript %}
for(var i = 0; i < n; i++){
  generate(n-1);
  if(n % 2 === 0){
    swap(i, n-1);
  }
  else{
    swap(0, n-1);
  }
}
{% endhighlight %}

Because n is even, the first if statement will trigger and swap the first (i = 0) and the second (n-1 = 1) items, giving "bac". The for-loop will count up and trigger another generate(1), which adds "bac" to the permutations array. The function resolves and we return to the for-loop with n = 2 and i = 1, which effectively does nothing. Now resolving to n = 3, we swap for an odd n, get "cab" and increment i by 1. The function gets kicked down to n = 1 to add the item to the array and back up to n = 2 to get "acb". The same pattern occurs in the last increment of the n = 3 for-loop, giving "bca", then "cba".

Actually not too bad once you write it out.


[problem]:https://www.freecodecamp.com/challenges/no-repeats-please
[Heap's algorithm]:https://en.wikipedia.org/wiki/Heap%27s_algorithm
