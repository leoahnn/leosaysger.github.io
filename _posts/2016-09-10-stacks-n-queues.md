---
layout: post
title: Stacks n' Queues
date: '2016-09-10 12:00:00 -0500'
categories: blog code algorithms
---

The second half of [Viking Code School](https://www.vikingcodeschool.com) has lead us down the often confounding path of javascript. So to get more familiar with the language, I've decided to solve an algorithm using JS.

Here's the setup:
Implement a queue with two stacks (using arrays that only push and pop as stacks).


<!--more-->

Here's my implementation:

{% highlight javascript %}

function BootlegQueue() {
  var stackOne = [];
  var stackTwo = [];
  this.enqueue = function() {
    stackOne.push.apply(stackOne, arguments);
  }
  this.dequeue = function() {
    if (!stackTwo.length) {
      while(stackOne.length) {
        stackTwo.push(stackOne.pop());
      }
    }
    return stackTwo.pop();
  };
};

{% endhighlight %}

If we assume that the stack functions (push and pop) are done in O(1) time, the queue will enqueue in O(1) and dequeue in O(n) where n is the number of items in the queue.
