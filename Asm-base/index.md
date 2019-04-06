# How to get javascript bytecode from V8 and others in 2019

Some times (in really rare cases) you need to explore not only performance trace from Node.Js but even bytecode it produces. The bad news is that you need to read byte codes. But good news that it is not so tricky as was before.

In Node.Js version more than 8.3 it is very simple. All you need is to use --print-bytecode flag, just like here:

```cmd
node --print-bytecode test.js
```

Where test.js is the file with the code you want to examine.

But this will produce a really big file with dozen of the code. Luckily, we have one more flag to filter bytecode by function name:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js
```

If you need, you can also put the result to the file, using the pipe operator so the final result can be something like this:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js > result.txt
```

And that's it - really simple I would say! But... Sometimes this is not enough and there are two reasons for this:

First one is that guys from Node.Js did a really awesome job and they split node.js and the engine. This means that in real life, your Node.Js can use Chakra core instead of V8 or any other engine. But you can't just download Node.Js with Chakra engine inside.

Another thing is that when you use Node.Js, you always use production build which is reasonable. But in the release version, some interesting flags are hidden from us. For example, you can't get AST tree, you got shorter (yes, it can be even more detailed) version of the bytecode. So, if you want to get all the power, you will need to get debug version for Node.Js.

For quite a lot of time, to achieve this, you need to download all that source code for the engine you want, compile itself and this was a real pain especially for Windows users. But, times changed and thanks to the [jsvu](https://github.com/GoogleChromeLabs/jsvu) team, we got a really simple way to get any engine we need, even debug version for V8. Thanks, guys, you are really awesome!

So, let's say you want to get V8 debug version. All you need is to run this simple command

```cmd
npx jsvu
```

And that's all! You will be prompted for a few questions (about OS, about engines you want to get, etc) and then you will get all cores you want!

## More Usefull flags

* --print-ast will show you Abstract Syntax Tree for your code (v8-debug only)
* --print-opt-code/--print-opt-code-filter flag will show ...(node, v8, v8-debug)
* --trace-turbo/--trace-turbo-filter - will show you interm
* --print-code-verbose will print even more information for the code

If you want to see all flags available for [v8](https://gist.github.com/Drag13/345136498ee2f2605f188f22d2258af0) and [v8-debug](https://gist.github.com/Drag13/92089a081a0056dd6872b77c2af88d94), just check this links. (Applicable for  V8 v7.5.203)

## Useful links

[Understanding byte code](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)