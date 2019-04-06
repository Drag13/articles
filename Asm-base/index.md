# How to get javascript bytecode from V8 and others in 2019

Some times (in really rare cases) you need to explore not only performance trace from Node.Js but even bytecode it produces. The bad news is that you need to read byte codes. But good news that it is not so tricky as was before.

In Node.Js version more than 8.3 it is very simple. All you need is to use --print-bytecode flag, just like here:

```cmd
node --print-bytecode test.js
```

Where test.js is the file with the code you want to examine.

After you execute this code you will see something like there:

```asm
Parameter count 2
Register count 3
Frame size 24
   12 E> 000002252055F082 @    0 : a5                StackCheck
   33 S> 000002252055F083 @    1 : 0b                LdaZero
         000002252055F084 @    2 : 26 fb             Star r0
```

> If you couries what is it and how to read this - this is a good [place to start](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775).

But only with this flag you will get the really big file with dozen of code. Luckily, we have one more flag to filter bytecode by function's name:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js
```

Also, we can dump the results into to the file, using the pipe operator (for powershell) and the final result can looks like this:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js > result.txt
```

And that's it - really simple I would say! But... Sometimes this is not enough and there are two reasons for this:

First one is that guys from Node.Js did a really awesome job and they split Node.js and the engine. This means that in real life, your Node.Js can use Chakra or SpiderMonkey instead of V8 or any other engine.

Another thing is that when you use Node.Js, you always use production build which is reasonable. But in the release version, some interesting flags are hidden from us. For example, you can't get AST tree, you got shorter (yes, it can be even more detailed) version of the bytecode. So, if you want to get all the power, you will need to get debug version for Node.Js.

For quite a lot of time, to achieve this, you need to download all related source code for the engine you want, compile itself and this was a real pain especially for Windows users. But, times changed and thanks to the [jsvu](https://github.com/GoogleChromeLabs/jsvu) team, we got a really simple way to get any engine we need, even debug version for V8. Thanks, guys, you are really awesome!

So, let's say you want to get V8 debug version. All you need is to run this simple command:

```cmd
npx jsvu
```

And that's all! You will be prompted for a few questions (about OS, engines you want to get, etc) and then you will get all already builed and ready cores you want! Isn't this awesome?

## More Usefull flags

* --print-ast will print Abstract Syntax Tree for your code (v8-debug only)
* --print-opt-code/--print-opt-code-filter will show optimizations  (node, v8-debug)
* --trace-turbo/--trace-turbo-filter - will show optimization for TurboFan compiler (any)
* --print-code --print-code-verbose will print even more information for the code (any) but has no filter for function name

If you want to see all flags available for [v8](https://gist.github.com/Drag13/345136498ee2f2605f188f22d2258af0) and [v8-debug](https://gist.github.com/Drag13/92089a081a0056dd6872b77c2af88d94), just check links above. (Applicable for  V8 v7.5.203)

## Useful links

[Understanding bytecode from V8](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)

That's it guys, thanks for your time, hope you found this fun.