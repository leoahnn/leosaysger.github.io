---
layout: post
title:  "Count and Say"
date:   2016-07-18 09:00:00 -0500
categories: blog code algorithms
---

1, 11, 21, 1211, _____

What comes next?

I was first shown this sequence in 5th grade with a "no homework pass" prize to anyone who could figure out the next number in the sequence.

None of us got out of homework that day, but I thought it would be interesting to revisit this problem with the help of algorithms.

<!--more-->
<br>
The sequence is a "count and say" sequence, where each number is a tally of the immediately previous term, i.e. 11 => 21 (two ones) => 1211 (one two, one one).

I was interested to see if there was an efficient way of finding the N-th term of a "count and say" sequence.

The first method that came to mind was to generate each string one by one and form the next term by looking through each character in the previous term. Big O would be equal to O(n*m), where m is the length of the longest string generated. Note that the value of m is exponentially linked to n ( m = AB<sup>n</sup>, where A and B are constants ), which makes big O exponential.

{% highlight ruby %}

def count_and_say(n)
  # n = 1 case
  str = "1";
  #loop for nth case
  (n-1).times do
    temp = ""  
    previous = nil
    count = 0
    str.chars.each do |c|
      # increase count if current char is first or equal to previous char
      if c == previous or previous.nil?
        count += 1
      else
      # if current char is different from previous, add count and num to temp
        temp += (count.to_s + previous);
        count = 1
      end
      previous = c
    end
    # add last count and num to temp then set to str for the next loop
    temp += (count.to_s + previous)
    str = temp
  end
  str
end

{% endhighlight %}

<br>
However, there is some optimization that can be done using regex. If we break up each string into sections with contiguously repeating numbers, we can use captures to modify sections at a time. This method would reduce the size of the 'm' in the O(n*m) time.
<br>

{% highlight ruby %}

def look_and_say(n)
  str = "1"
  (n-1).times do
    str = str.gsub(/(.)\1*/){|s| "#{s.size}#{s[0,1]}"}
  end
  str
end

{% endhighlight %}

<br>
And finally, we can use a hash to store previously found contiguously repeating sections. This will allow each repeating sections to be converted into a "count and say" term using a hash lookup versus finding the size and number each time.
<br>
{% highlight ruby %}

def look_store_say(n)
  str = "1"
  store = {}
  (n-1).times do
    str = str.gsub(/(.)\1*/) do |s|
      store.include?(s) ? store[s] : store[s]="#{s.size}#{s[0,1]}"
    end
  end
  str
end

{% endhighlight %}
<br>
Reducing the size of m yields drastic performance gains:
<br>
{% highlight ruby %}

Benchmark.bmbm do |x|
  x.report("count_and_say") { count_and_say(50) }   #=> 79.761677(sec)
  x.report("look_and_say")  { look_and_say(50)  }   #=> 1.336348(sec)
  x.report("look_store_say") { look_store_say(50) } #=> 0.927730(sec)
end

{% endhighlight %}
<br>
However, because the 'm' of each method is tied to the length of each term, the overall big O remains exponential. Increasing n quickly becomes unwieldy:
<br>
{% highlight ruby %}

Benchmark.bmbm do |x|
  x.report("count_and_say") { count_and_say(75) }   #=> a long time
  x.report("look_and_say")  { look_and_say(75)  }   #=> 1042.213011(sec)
  x.report("look_store_say") { look_store_say(75) } #=> 686.264388(sec)
end

{% endhighlight %}
