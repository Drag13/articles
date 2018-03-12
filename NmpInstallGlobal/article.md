# Is npm install -g evil one

This header is quite provocative but let me explain.  In short term, global installation makes us live easier. One installation – lots of usage. And usage of this become very simple. Just use *ng* or *tsc* or whatever and magic will happen. But if you try to go deeper, you will find reasons to avoid this.

* Local repository conflict. Let’s say I have two repositories with typescript projects and typescript installed globally. Time flows and I decide to update my tsc to get all the best from the new version. And what do I see? My second repo is broken. Now I must fix it (but this isn’t I want to do right now) or rollback to the oldest tsc. Global dependencies make our code dependent and not flexible.

* Team conflict. I work with EsLint version 1.5 and my college Yevgen works with EsLint 1.9. For both of us linter works just fine. Until we want to commit the code. And then the problem rises. There is no guarantee that my code working fine on my machine will be also fine at Yevgen’s machine. It is like very bad ping-pong game. I commit – he fixes. He commits – me fix. Ping -pong, yeah?

* And the biggest one. Build machine conflict. Sooner or later we will go to the production. May be even with continues integration. Let’s imagine that our global dependencies are different with dependencies on build machine. What does this mean? This mean that behavior of our code becomes non-deterministic. Not predictable. Locally all is working fine. But fails on the production.  This will be very non-trivial task to find the problem.

So, is global flag is absolutely evil? No. It works pretty fine with fire and forget approach – like generators. When you need to do something only once like create basic project or something else – global flag is perfect. But it will be not fair not to say a few words when using -g flag is ok. Generators or anything else that will work only once is ok. So, do yourself and your teammates a favor. 

Use -g wisely.