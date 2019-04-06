# How to get javascript bytecode from V8 and others in 2019

Some times (in a really rare cases) you need to explore not only performance trace from Node.Js, but even bytecode it produces. Bad news is that you need to read byte codes. But good news that it is not so tricky as was before.

In Node.Js version more than 8.3 it is very simple. All you need is to use --print-bytecode flag, just like here:

```cmd
node --print-bytecode test.js
```

Where test.js is file with the code you want to examit.

But this will produce really big file with dozen of the code. Luckully, we have one more flag to filter bytecode by function name:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js
```

If you need, you can also put the result to the file, using pipe operator, so final result can be something like this:

```cmd
node --print-bytecode --print-bytecode-filter=func_name test.js > result.txt
```

And that's it - really simple I would say! But... Simetimes this is not enough and here is two reasons for this:

First one is that guys from Node.Js did really awesome job and they splitted node.js and the engine. This means that in real life, your Node.Js can use Chakra core instead of V8 or any other engine. But you can't just download Node.Js with Chakra engine inside.

Another thing is that when you use Node.Js, you always use production build which is reasonable. But in release version, some interesing flags are hidden from us. For an example, you can't get AST tree, you got shorter (yes, it can be even more detailed) version of the bytecode. So, if you want to get all the power, you will need to get debug version for Node.Js.

For quite lot of time, to achive this, you need download all that source code for engine you want, compile itself and this was a real pain especially for Windows users. But, times changed and thanksfully to jsvu team, we got really simple way to get any engine we need, even debug version for V8. Thanks, guys, you are really awesome!

So, lets say you want to get V8 debug version. All you need is to run this simple command

```cmd
npx jsvu
```

And that's all! You will be promted for a few question (about OS, about engines you want to get, etc) and than you will get all cores you want!

## Usefull flags

* --print-ast will show you Abstract Syntax Tree for your code (v8-debug only)
* --print-opt-code/--print-opt-code-filter flag will show ...(node, v8, v8-debug)
* --trace-turbo/--trace-turbo-filter - will show you interm
* --print-code-verbose will print even more information for the code

If you want to see all flags available for v8 and v8-debug, just check this links. (Applicable for  V8 v7.5.203)

## Usefull links

[Understanding byte code](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)
