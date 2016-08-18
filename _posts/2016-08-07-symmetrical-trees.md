---
layout: post
title:  "Symmetrical Trees"
date:   2016-08-07 12:00:00 -0500
categories: blog code algorithms
---

For better or worse, flipping, sorting, frying, broiling, or otherwise poking at binary trees seem to be common fodder for coding interview questions. One simple exercise to help refresh working with binary trees is to find whether a given tree is symmetrical.

<!--more-->

Here's the code for the nodes in a tree:

{% highlight ruby%}
class Node
   attr_accessor :val, :left, :right
   def initialize(val)
       @val = val
       @left, @right = nil, nil
   end
end
{% endhighlight %}

And here is the recursive solution:

{% highlight ruby%}
def mirror_image?(root)
    return true if root.nil?
    symmetrical?(root.left, root.right)
end

def symmetrical?(a,b)
    return a == b if (a == nil || b == nil)
    a.val == b.val && symmetrical?(a.left, b.right) &&
    symmetrical?(a.right,b.left)
end

  root = Node.new(1)
  root.left = Node.new(2)
  root.right = Node.new(2)


{% endhighlight %}

Nice and neat.

Now let's solve without using recursion. It takes a bit more mental energy to figure out how it works, but its good to review how a queue works:

{% highlight ruby %}

def mirror_queue?(root)
  return true if root.nil?
  queue = Queue.new
  queue << root.left << root.right

  until queue.empty?
    current_left = queue.pop
    current_right = queue.pop
    next if current_left.nil? && current_right.nil?
    return false if current_left.nil? || current_right.nil?
                    || (current_left.val != current_right.val)
    queue << current_left.left << current_right.right << current_left.right <<
    current_right.left
  end
  true
end
{% endhighlight %}
