---

layout: post

title: Git Hygiene

date: '2019-01-10 12:00:00 -0500'

categories: blog code

---

- Does your Git repository take ages to clone?

- Do you think to yourself "We can use our Git repo as a database/binary store/place to store old family photos!"

- Do you light a candle at the shrine of Linus before every merge in hopes that it will be conflict-free?

![gitwow](/assets/git_hygiene/gitproguy.jpg "gitwow") 

_"Have I got something for you"_

<!--more-->

Git repos are happiest when they are doing what they were meant to do: being a distributed version control system. Git is bounds ahead in performance, security, and flexibility when compared to most other solutions, and for the most part Git repos will take whatever pushes, merges, and rebases you throw at it.

Git can also be a rabbit hole of arcane commands and hand wave-y magic. You could write a [literal textbook](https://git-scm.com/book/en/v2) on this stuff (highly recommended reading to demystify a lot of the inner-workings of Git). And for every complex system, you can count on finding ways to bring it to its knees (exhibit 1: [git-bombs](https://kate.io/blog/git-bomb/)).

There are two roughly defined areas of best practice teams should follow: How to use Git, and Why to use Git.

The 'How' is the logistics of how a given team will handle rebases vs. merges, branches vs. forks, etc...

The 'Why' is what teams are actually using the Git repo for, e.g. as a codebase (good) or an alternative to Apple's Time Machine (BAD!).

To learn more about the 'How', take a look at any of the myriad of resources from [Atlassian](https://www.atlassian.com/git/tutorials), [ProGit](https://git-scm.com/book/en/v2), etc.. Or just Google a question and you're bound to find pages upon pages of Stack Overflow queries. I'll be digging into the 'Why' below.

So you might be thinking, "I just figured out how to fsck/merge-octopus/quiltimport, now I have to worry about what I put in my repos?!"  Yes, yes you do (and yes those are all real git commands). As part of a larger enterprise, we all have to do our part in being good stewards of a shared resource i.e. Github.

<br>

# Rules of thumb when using Git and Github

> Happy Git repositories are all alike; every unhappy Git repository is unhappy in its own way. —Linus Tolstoy

- Avoid storing generated files (JARs, executables), large media files, or file archives (tarballs, ZIPs) in Git. Use .gitignore to avoid storing those files. Or if you have to store those things use S3/Dropbox or something else meant to store large files.

- Avoid storing many versions of large text files (large XMLs, logs) in Git. Consider a logging solution or a dedicated database.

- Avoid having too many extraneous branches & tags (esp if your automation creates/utilizes these).

- Don't store passwords, tokens, keys, etc.. in Git. Git repos are designed to be distributed!

So, how would you know if your git repo is feeling a little under the weather? Github released a nifty tool called [`git-sizer`](https://github.com/github/git-sizer), a Go based executable that will compute metrics about a given Git repo and flag anything that looks unreasonable. Check out their [readme](https://github.com/github/git-sizer/blob/master/README.md) for more in-depth descriptions of what to look out for and why certain things can bloat your Git repo.

There are no hard & fast rules about using a repo, and the some of the above 'rules' can be bent if necessary. But if you feel like your Git repo is less a distributed version control system and more like a "hey GitHub would be a really accessible and convenient (something that's not a VCS)", please tread lightly. We have a whole host of different enterprise tools designed to do specific things well, chances are there is something out there that fits differing use cases.

# Cleaning up

So you accidentally added `~/Desktop/Cherished_Memories` to your GitHub Repo. Or you unknowingly pushed your AWS keys 20 commits ago and you're lying awake worrying that someone found them and is spinning up bitcoin miners at your expense. What to do?

If you're new to Git, simply deleting the offending files might be your first reaction. However, Git being version controlled, your entire history of commits lives on in the .git file. So even if the current HEAD (or current commit your repo is pointing at) is clean, those videos of Timmy's first steps will linger in the history and bloat your repo every time someone tries to clone it down.

Luckily, accidental commits are a common enough occurrence that there are various tools to help scrub a Git repo.

I would recommend using a tool like [BFG Repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or if you need a little more fine-grained control, the git native [git-filter-branch](http://git-scm.com/docs/git-filter-branch)

BFG makes it simple to strip your repo of giant files or sensitive passwords. A few simple commands can strip out files that exceed a certain size or redact passwords in one pass.

## **Example**

Looking at a sample repo, the size of all files is pretty small:

![initsmall](/assets/git_hygiene/small.png "small"){:height="200px"}

However, looking at the size of the repo including the .git file, the size balloons to 24MB

![actuallybig](/assets/git_hygiene/large.png "hefty"){:height="50px"}

This is a telltale sign of a big something(s) being committed to the repo in the past and not properly cleaned.

Lets try running the git sizer on the repo:

![sizer](/assets/git_hygiene/sizer.png "sized")

Running the sizer outputs any suspicious metrics on a given repo. It will also spit out SHAs and filenames so you can pinpoint where the bad eggs are located.  In my sample repo, it looks like a plugin in a dot file was included in a commit, inflating what should be a pretty svelte repo.

After downloading and running the BFG Repo-Cleaner to clean out any files >1MB, here's the new size:

![actually_small](/assets/git_hygiene/small-again.png "actually_small")

and the git-sizer output is clean:

![clean_sizer](/assets/git_hygiene/clean-sizer.png "clean_sizer")

This reduces the git clone time from ~45 seconds to less than 2 seconds.

![timing](/assets/git_hygiene/timing.png "timing")

# TLDR

- Use Git as a distributed version control system. Not as a binary bucket or media backup.

- Use [git-sizer](https://github.com/github/git-sizer) if you suspect your repo is bloated or unhealthy

- If you commit sensitive data, it will linger in the Git history

- If necessary, consider using [BFG Repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or [git-filter-branch](http://git-scm.com/docs/git-filter-branch)

- If you're using Git, take some time to [learn about it](https://git-scm.com/book/en/v2). It will help you make better Git decisions. And learning how the sausage is made is actually pretty cool.