[lambda]: img/lambda.png
<!-- TOC -->

- [Functions](#functions)
  - [Functions as first-class citizens](#functions-as-first-class-citizens)
- [Recursion](#recursion)
- [Tail call optimization](#tail-call-optimization)
- [Guards in functions](#guards-in-functions)
- [λ (lambda) functions](#λ-lambda-functions)
- [Functions as function parameters](#functions-as-function-parameters)
  - [Functions returning functions](#functions-returning-functions)

<!-- /TOC -->

Elixir uses the concept of modules for grouping several functions together. Functions other than anonymous functions cannot be declared outside the scope of a module. We introduce the concept of modules here very briefly and return to them when we start building something more complex.

```elixir
iex> defmodule Math do
...>  def square(a) do
...>    a * a
...>  end
...>end

iex> Math.square(2)
4
```

You can declare a module with `defmodule` using the `iex` interpreter, or by saving the contents of the module to a file with a `.ex` extension by convention. Modules declared in separate files should be compiled with the `elixirc` compiler

``` elixir
defmodule <module_name> do
  # Module body
end
```

The module definition follows the format `defmodule` `<module name>` followed by `do` ... `module body` ... `end`. Functions within a module are defined with the `def` macro and private functions visible only within the lexical scope of the module are defined using the `defp` macro.

``` elixir
defmodule Example do
  def function_name(param_a, param_b) do
    # Function body
  end
end
```

Both public and private functions follow the structure `def` fn_name(params..) `do` ... function body ... `end`

```elixir
defmodule Math do
  def square(a) do
    multiply(a, a)
  end

  defp multiply(a, b) do
    a * b
  end
end
```
```
iex(34)> Math.square(2)
4
iex> Math.multiply(2, 2)
** (UndefinedFunctionError) function Math.multiply/2 is undefined or private
    Math.multiply(2, 2)
```

Private functions defined with the `def` macro do not have a visiblity to callers outside the module context, in other words, private functions are callable only from other functions defined in the same module. Calling a private function from outside the module context will raise an error.

Private functions are typically used as helper functions for abstracting module-specific commonalities and building for composing functions from small, manageable chunks.

<div class="key-concept">
<a name="implicit_return_values"></a> <span>Implicit return values</span>
![Key concept][lambda] <p>It is also worth noticing, that the function `square/1` does not have an explicit `return` statement or similar, like imperative languages such as Java or C tend to use. </p>

<p>Implicit return values are  a common feature in functional languages. The function body is an expression, and the last evaluated value in the function body is treated as the function's return value.</p>
</div>

```elixir
defmodule Math do
  def square(a) do
    a * a
  end
end
```

Now it's time to create a new file called `math.ex` with the contents above.

```bash
$ elixirc math.ex
```

When the module is defined in it's own file, the module is compiled with the `elixirc` command followed by the filename. The bytecode resulting from the compilation of our example is found in the file `Elixir.Math.beam`

```elixir
iex> Math.square(2)
4
```

When executing the `iex` REPL in the same directory the compiled file is stored in, the module is automatically available for use with the Elixir interpreter. Automatic inclusion of modules is an easy way to gain an entry point to your code for debugging and taking your code for a test drive.

## Functions
### Functions as first-class citizens
<div class="key-concept">
 ![Key concept][lambda]<span>Functions are first-class citizens</span>
 <p>Extensive use and composition of short, single purpose functions is one of the distinguishing properties of functional programming. Functions are often rederred to as first-class citizens in functional programming: functions are acceptable parameters for functions, functions can be anonymous or named, assigned to variables, stored in data structures and functions can return functions as their return values.</p>

<p>In other words, function is a value with the type function, which when evaluated, reduces to the return value generated by the expression captured by the function. </p>
</div>

```elixir
defmodule Temperature do
  def fahrenheit_to_celsius(t) do
    (t - 32) * 5/9
  end

  def celsius_to_fahrenheit(t) do
    t * 9/5 + 32
  end

  def celsius_to_kelvin(t) do
     273.15 + t
  end

  def kelvin_to_celsius(t) do
    t + 273.15
  end

  def kelvin_to_fahrenheit(t) do
    celsius_to_fahrenheit(kelvin_to_celsius(t))
  end

  def fahrenheit_to_kelvin(t) do
    celsius_to_kelvin(fahrenheit_to_celsius(t))
  end
end
```

The above is an example of a module. The module `Temperature` consists of conversion functions between temperatures reported in celsius, kelvin and fahrenheit. None of the functions has an explicit return statement, instead the functions return the same values as the function bodies evaluate to. In these cases, the expressions of the functions evaluate to the results of the calculations declared in the function bodies.

```elixir
iex> Temperature.fahrenheit_to_kelvin(0)
255.3722222222222
```

Try saving this module to a file, compiling it with `elixirc` and start up the `iex` REPL in the same directory with the module. Try calling the module functions.

```elixir
defmodule PersonOps do
  def print_age(p) do
    IO.puts("The person's age is #{p.age}")
  end

  def print_name(p) do
    name = p.first_name <> " " <> p.last_name
    IO.puts("The person's name is #{name}")
  end
end
```

Let's declare some operations for handling people. A person in our case is represented by the map type. A person is a map with three properties: `first_name`, `last_name` and `age`.

```elixir
iex> person = %{first_name: "Esko", last_name: "Erikoinen", age: 42}
%{age: 42, first_name: "Esko", last_name: "Erikoinen"}

iex> PersonOps.print_age(person)
The person's age is 42
:ok

iex> PersonOps.print_name(person)
The person's name is Esko Erikoinen
:ok
```
You'll notice that the functions perform the actions you expected. A careful reader makes an additional note: now that the `IO.puts\1` is the last value of the expression declared in the function body, in addition to the `:stdout` output the function returns the atom `:ok` indicating a succesful I/O operation.

Repeat after me: In functional programming everything is an expression, and every expression evaluates to a value.

Unsurprisingly everything is an expression in Elixir as well.

## Recursion

<div class="key-concept">
![Key concept][lambda]<span>Recursion is looping</span>
<p>Recursion plays an important part in functional programming. Recursion is equivalent to looping, so expect to see no `for` or `while` loops when looking at functionally written code. Expect to see and use lots and lots of recursion when programming in Elixir.</p>

<p>Recursive function is a function that calculates it's final value by repeated application of the function - in other words - function calling itself over and over again. If you do not understand recursion is, read this paragraph again.</p>

<p> Playing with recursion in imperative languages feels somewhat like having a conversation with your Australian cousin. The language is fun and refreshing for a while, but you usually want to go back to speaking real English after a while. In the end, recursion is no different from using `for` or `while` loops.</p>
</div>

```java
static int factorial(int n) {
    if(n < 2) {
        return n;
    }
    int res = 1;
    while(n > 1) {
        res = n * res;
        n--;
    }
    return res;
}

```

The above is an example of an imperative approach to the commonly implemented factorial function. The function first checks if the input parameter is valid for calculating factorial and then loops the following: multiply the integer `res` with the input number `n` and decrement `n` while `n` has a value over `1`.

```elixir
defmodule MathEx do
  def fact(n) do
    if(n < 2) do
      n
    else
      n * fact(n-1)
    end
  end
end
```

The factorial function can be easily re-written to use a recursive approach. The principle of operation is the same, if `n < 2`, return `n`. Otherwise  multiply `n` with the result of the function `fact(n-1)`.

```elixir
# When called, the function expands as follows:

iex> MathEx.fact(5)
    --> 5 * fact(4)
    --> 5 * 4 * fact(3)
    --> 5 * 4 * 3 * fact(2)
    --> 5 * 4 * 3 * 2 * fact(1) # Recursion-terminating return value of fact(1)
    --> 5 * 4 * 3 * 2 * 1
120
```

It is always important to have a terminating condition for recursion (`n < 2`) otherwise the recursive function will call itself indefinitely, eventually resulting in a stack overflow.

```elixir
defmodule ListOps do
  def list_sum(list) do
    case list do
      [] -> 0
      [head | tail] -> head + list_sum(tail)
    end
  end
end

iex> ListOps.list_sum([1, 2, 3])
6
```

Recursive traversal of lists is a common scenario in functional programming. Typical approach to handling lists is to iterate through them an item at a time, first extracting the `head` element in the function body, handling it's value, and calling the current function again with the `tail` part until the function encounters an empty list.

The return value of this function is the number returned by either condition of the `case` block.

```elixir
# When called, the function expands as follows:

iex> ListOps.list_sum([1, 2, 3])
    --> 1 + list_sum([2, 3])
    --> 1 + 2 + list_sum([3])
    --> 1 + 2 + 3 + list_sum([]) # The recursion terminates and returns a zero
    --> 1 + 2 + 3 + 0
6
```

The combination of destructuring values in a match block and re-using the function logic in a recursive application might feel a little odd in the beginning, but this oddness is simply removed by repeated application of recursion.

```elixir
defmodule ListOps do
  def list_length([]) do
    0
  end

  def list_length([head|tail]) do
    1 + list_length(tail)
  end
end

iex> ListOps.list_length([1,2,3,4,5])
5
```

Many language constructs in Elixir are designed to make programming recursive functions easy. Function-level pattern matching (introduced in more detail in the next chapter) is one of these syntactic helpers.

The example above defines a module `ListOps` with a two variants of the function `list_length/1`. The first variant accepts a pattern matching to an empty list, for which it returns a zero.

The pattern for a non-empty list is declared in the function parameters with the syntax `[head|tail]`. The `[head|tail]` declaration is used to extract the head element from the tail of the list early in the function parameters, leaving the function body to be a one-line implementation with no need for logic besides simple arithmetics.

```elixir
# When called, the function expands as follows:

iex> ListOps.list_length([1, 2, 3, 4, 5])
    --> 1 + list_length([2, 3, 4, 5])
    --> 1 + 1 + list_length([3, 4, 5])
    --> 1 + 1 + 1 + list_length([4, 5])
    --> 1 + 1 + 1 + 1 + list_length([5])
    --> 1 + 1 + 1 + 1 + 1 + list_length([]) # The recursion terminates and returns a zero
    --> 1 + 1 + 1 + 1 + 1 + 0
5
```

The expansion of the `list_length/1` behaves quite similarly to the factorial function despite the fact that the last expanded value is returned from a different function body than the former ones.

```java
int[] array = {1,2,3,4,5};

static int[] squareArray(int[] array) {
    int[] result = new int[array.length];

    for(int i = 0 ; i < ; array.length ; ++i) {
        result[i] = array[i] * array[i];
    }

    return result;
}

int[] result = squareArray(array); // Yields an array of {1, 4, 9, 16, 25};

```

The Java code above represents a simple algorithm filling a result array with the squared values of the input array. Let's make a recursive rewrite of the function:

```elixir
defmodule ListOps do
  def square_list([]) do
    []
  end
  def square_list([head|tail]) do
    [head*head | square_list(tail)]
  end
end

iex> ListOps.square_list([1,2,3,4,5])
[1, 4, 9, 16, 25]
```

Defining functions with multiple patterns is common practice in Elixir programming. The idea is to rule out unapplicable cases as early as possible, in order to leave functions with less clutter, so the functions can focus on expressing their behavior instead of performing slicing of their inputs.

The latter definition of `square_list/1` multiplies the head of the list with itself, and prepends the result to the result to a tail part of a list produced by a recursive call to the same function `square_list/1`. The recursive call can now match against either of the functions by the same name.

```elixir
defmodule ListOps do
  def reverse([]) do
    []
  end

  def reverse([head|tail]) do
    reverse(tail) ++ [head]
  end
end

iex> ListOps.reverse([1,2,3,4,5])
[5, 4, 3, 2, 1]
```

The position of the recursive call sometimes has a significant effect on the result of recursion. As an example of this we define a new function `reverse/1` that accepts two patterns, either an empty list `[]` or a list with at least the `head` element present. The both the `head` and the `tail` are extracted from the pattern `[head|tail]`. The head is then prepended with the result of a recursive call to `reverse/1` applied to the lists tail. As a result the function `reverse/1` produces us a reversed copy of the list.

```elixir
iex> ListOps.reverse([1, 2, 3, 4, 5])
    --> reverse([2, 3, 4, 5]) ++ [1]
    --> reverse([3, 4, 5]) ++ [2] ++ [1]
    --> reverse([4, 5]) ++ [3] ++ [2] ++ [1]
    --> reverse([5]) ++ [4] ++ [3] ++ [2] ++ [1]
    --> reverse([]) ++ [5] ++ [4] ++ [3] ++ [2] ++ [1] # The recursion terminates and returns an empty list
    --> [] ++ [5] ++ [4] ++ [3] ++ [2] ++ [1]
[5, 4, 3, 2, 1]
```

The expansion of the `reverse/1` differs slightly from the earlier functions, but in principle works in a same way. The main difference is, that the the extracted `head` value is kept on the right-hand side of the join `++` operator. When prepended, the empty result from the call of `reverse([])` does not add in item to the front of the resulting list.

## Tail call optimization
<div class="key-concept">
![Key concept][lambda]<span>Tail call optimization</span>
<p>The function we defined does not come without problems. The Elixir compiler supports a feature called *tail call optimization* (or tail call elimination) for recursive functions. Tail call optimization refers to the elimination of the actual recursive call in favor of transforming the recursive calls in to a loop.</p>

<p>The optimization is a significant performance improvement over standard function calls generated by a compiled recursive application. After the optimizing transformation the virtual machine does not need to allocate a new call stack to the successive recursive function calls during execution, but can instead reuse the original stack created during the initial function call.</p>

<p>The condition for the tail call optimization to be applied is to formulate the recursive call so that the final, recursion-terminating call does not need any values from the previous function calls.</p>
</div>

```elixir
defmodule ArrayOps do
  def square_list(list) do
    do_squaring([], list)
  end

  defp do_squaring(acc, []) do
    acc
  end

  defp do_squaring(acc, [head|tail]) do
    do_squaring([head*head | acc], tail)
end

iex> ArrayOps.square_list [1,2,3,4,5]
[1, 4, 9, 16, 25]
```

The rewritten `square_list\1` uses a helper function to enable the elimination of the call stack creation. Creating a private helper function `do_squaring/2` within the module allows for the original call syntax for the users of the function along with a module-private, optimized implementation of the function.

`do_squaring/2` takes two parameters, an accumulator list that holds the squared values and the list with the values to be squared. The function iterates over the list element-by-element, and finally when the list runs out of elements, the `do_squaring/2` returns the accumulated value carried over by the function parameters.

```elixir
defmodule MathEx do
  def fact(n) do
    if(n < 2) do
      n
    else
      n * fact(n-1)
    end
  end
end
```

Let's visit again the earlier example of the `fact/1` function. We also showed how the calls of the function rolled out. It's important to realize, that our implementation of `fact/1` was not tail-recursive, as the expression `n * fact(n-1)` cannot release the call stack, but expects a return value from the successive call on each iteration. Let's remedy the situation.

```elixir
defmodule MathEx do
  def fact_rec(n), do: do_fact(n, n)

  defp do_fact(acc, 1) do
    acc
  end

  defp do_fact(acc, n) do
    m = n - 1
    do_fact(acc * m, m)
  end
end
```

We can achieve tail-recursiveness by implementing a helper function `do_fact/2` accepting two parameters, the accumulated state `acc` and the number `n` acting as the multiplier. The first call to `do_fact/2` assigns the initial parameter `n` as the accumulator `acc` and on each call to `do_fact/2` the `n` is subtracted by 1 to obtain a new multiplier. The recursion-terminates, when `n` reaches the number 1 and the accumulated value is returned.

```elixir
iex> MathEx.fact(5)
120

# What happens in the function is:

iex> MathEx.fact(5)
    --> do_fact(5, 5)
    --> do_fact(20, 4)
    --> do_fact(60, 3)
    --> do_fact(120, 1) # Call matches the terminating pattern
120
```

The tail-recursive variant of `fact/1` passes the state of calculation between the function calls, and the calls are optimized to an iterative loop by the compiler. The previous call stack is re-used between successive function calls.

To sum it up up: Elimination of tail-recursion is a commonly used optimization technique that allows a function to operate in constant stack space.

## Guards in functions

```elixir
defmodule MathEx do
  def fact(n) when (is_number(n) and n > -1) do
    if(n < 2) do
      n
    else
      n * fact(n-1)
    end
  end
end

iex> MathEx.fact("a")
** (FunctionClauseError) no function clause matching in MathEx.fact/1
    iex:75: MathEx.fact("a")

```

The function definitions can also be decorated with guards in order to allow the function to yield safe and predictable results. The factorial function does not work for numbers less than zero so we decorate the function definition with a guard with the `when <cond>` just before the block initiated by the `do` keyword. Our guard makes sure that the function receives a number and the function is of valid magnitude.

```
defmodule Guards do

  def hello(who) when is_bitstring(who) do
    "Hello #{who}!"
  end

end

iex> Guards.hello("you")
"Hello you!"

iex> Guards.hello(<<72, 101, 108, 108, 111, 32>>)
"Hello Hello !"
```

The guards in function parameters for standard types are not exhaustive, for example, a string-specific guard does not exist (but the `is_bitstring/1` can be used similarily, but it will accept non UTF-8 compliant sequences of bytes). The lack of exhaustiveness comes from the guard function implemenations in the underlying Erlang virtual machine, which was originally very specific to telecom applications and did not support UTF-8 at all before late 2000s.

The full list of available function guards is documented in the [Kernel module documentation](https://hexdocs.pm/elixir/guards.html).

## λ (lambda) functions
<div class="key-concept">
![Key concept][lambda]<span>Anonymous functions</span>
<p>The functional programming paradigm has its roots in lambda calculus. Functional language implementations support declaring lambda functions, often with a very efficient syntax. Lambda functions are also called anonymous functions, as they do not have a name associated with them most of the time.</p>

<p>The common use case for lambda functions is as parameters to functions accepting functions. Lambda functions are often treated as throwaway functions to complement the functionality of high order functions, which we will discuss in the next chapter.</p>
</div>

```elixir
iex> mult = fn(a,b) -> a * b end
#Function<12.54118792/2 in :erl_eval.expr/5>
iex> is_function(mult)
true
iex> mult.(3, 5)
15
```

On the first line we match an anonymous function accepting two parameters to a variable. The function just performs a multiplication for the arguments.

The function is called by applying a the parameters `(3,5)` to the variable associated with the function. Notice that the arguments are separated from the variable by a dot `.` -  which is a requirement for calling anonymous functions in the case they get assigned to a variable.

Unlike regular functions, anonymous functions can be declared outside a module.

```elixir
iex> foo = "bar"
"bar"
iex> (fn -> foo = "quux" end).()
"quux"
iex>
"bar"
```

Lambda functions are closures, and such they have a private scope that only the anonymous function can access. Any variable declared within the scope of an anonymous function does not affect the higher level environment.

Like any other function or expression, the lambda function evaluates to the value returned by that expression.

```elixir
iex> fact = fn(_, 1) -> 1
                (fun, n) -> n * fun.(fun, n-1)
              end

iex(4)> fact.(fact, 5)
120

```

Unlike recent versions of Erlang, Elixir comes with a slight caveat of not supporting named anonymous functions. This feature might be implemented in future releases. Currently, if you need recursion as a part of your function, you need to pass the function name as a parameter of the anonymous function, as the function is evaluated before the actual function is constructed.

In the example above we define a function `fact` for calculating factorials. The `fn/2` accepts two parameters, a function name `fun` to apply recursion to, and the number `n` to be calculated. The first pattern is a stop condition for when the number reaches 1, it returns the number 1 and stops recursion. The other pattern multiplies the `n` with the result of the call to the anonymous `fn/2` `fun` with `n` subtracted by 1.

This pattern, and it's use pattern is far from elegant. As the call takes the form of `fn/2.(fn/2, n)`, the function defined is hardly useful anywhere.

```elixir
iex> fact = fn n ->
    do_fact = fn(_, 0)   -> 1
                (fun, n) -> n * fun.(fun, n-1)
              end
              do_fact.(do_fact, n) end
iex> fact.(5)
```

In the opinion of the author, the recursive anonymous function would be best defined as named function in a module. If you really insist on writing a recursive anonymous function, you can wrap it inside a wrapper function that defines a recursive inner function and hides away the nasty implementation and provides a regular call pattern of `fn/1.(args)`. These technique of using an lambda-function to handle the recursion is known as the infamous Y-combinator.

## Functions as function parameters

One of the more interesting features of functional languages is the ability to use functions (typically lambda functions) as parameters to functions generalizing some sort of behavior. Let's take a look at some examples.

```elixir
iex> defmodule ListOps do
       def my_map([], _) do
         []
       end
       def my_map([head|tail], fun) do
         [fun.(head)] ++ my_map(tail, fun)
       end
     end
```

Let's use the module `ListOps` as a container for some generalized operations for lists. We start by defining a function called `my_map/2`. `my_map/2` is generalizes a behavior of iterating through a list of items, applying a function for each element and returning a new copy of a list with those items as a result.

The first parameter is a list, for which we provide two patterns for. The first pattern matches an empty list `[]` and "some value". The pattern returns an empty list `[]` and effectively ignores both parameters.

The second pattern matches a list with at least one element and applies the function `fun` received as a second parameter. It creates a new list from the `head` element of the list with the `fun` applied by calling `fun.(head)` and prepends the result to a list received by a successive call to `my_map` with the list's `tail` and `fun` as it's parameters.

```elixir
iex> ListOps.my_map([1,2,3,4,5], fn n -> n * 2 end)
[2, 4, 6, 8, 10]
iex> ListOps.my_map([1,2,3,4,5], fn n -> n * n end)
[1, 4, 9, 16, 25]
```

The function `my_map` is already proving itself really hand by allowing us to abstract away the tedious and labory iteration of lists. The anonymous function `fn/1` accepted by `my_map` is the one that is used to define the functions behavior within the iterative calls.

```elixir
iex> ListOps.my_map(["jack", "of", "all", "trades"], fn str -> String.upcase(str) end)
["JACK", "OF", "ALL", "TRADES"]
```

We did not use any function guards, so the map can be used for different kinds of lists.

```elixir
iex> ListOps.map([1,2,3,4,5], fn
  n when rem(n, 2) == 0 -> div(n, 2)
  n -> n * 2
  end)
[2, 1, 6, 2, 10]
```

As a cherry on top, Elixir also allows us to match patterns from within anonymous functions. We define two patterns for the `fn/1` which uses a guard in the first pattern the check if the remained from the `rem(n, 2)` is zero indicating the number is an even number. Those numbers are divided by two. The second pattern multiplies the odd numbers we supplied.

The possibility to accept functions as function parameters proves itself a really powerful way of creating complex abstractions with a very little code time after time. The functionality implemented here is in reality provided by the [Enum module](http://elixir-lang.org/docs/stable/elixir/Enum.html). It's an uncommon case that a recurring behavior such as the ones presented above need to implemented by the programmer.


### Functions returning functions
<div class="key-concept">
![Key concept][lambda]<span>Currying</span>
<p>Currying is an often used technique in functional programming languages for translating functions with multiple parameters (arity of n where n > 1) into a sequence of functions that accept a reduced numbers of parameters (arity of n-1).</p>

<p>The function returned from a curried function is called a *partially applied function*. A partially applied function is a function that has some of it's arguments replaced by values and is returned as a function with a smaller arity compered to the original function.</p>

<p>Currying is not built in to the Elixir core language, so we define approach the matter by defining a module for a transformational function, as in, defining a function that returns instances of a function</p>
</div>

```elixir
iex> people = [%{name: "Matti Ruohonen", born: 1949},
...> %{name: "Teppo Ruohonen", born: 1948},
...> %{name: "Seppo Räty", born: 1962}]
```

Let's define a list people represented by map objects.

```elixir
iex> names = Enum.map(people, fn(map) -> Map.get(map, :name) end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
```

The names can be fetched from the map objects by calling `Map.get(map, key)` in an anonomous function, but having to do this repeatedly can get a bit labory. The library function `Enum.map/2` is a function, that takes as it's input a sequence (Enumerable) of elements and a transformation function and returns a list of transformed elements. We will look in to the `Enum.map/2` in more detail in the next chapter.

```elixir
defmodule MapOps do
   def get_key(key) do
     fn(map) -> Map.get(map, key) end
   end
end
```

We start the currying by defining a module `MapOps` which is used to contain our function `get_key/1`. The `get_key/1` takes the key we are interested as it's parameter. The `get_key/1` function returns an anonymous `fn/1` that accepts a map as it's parameter.

```elixir
iex> get_name = MapOps.get_key(:name)
#Function<0.89557173/1 in MapOps.get/1>
iex> get_born = MapOps.get_key(:born)
#Function<0.89557173/1 in MapOps.get/1>
```

When calling the `MapOps.get_key/1` the function returns the anonymous inner function, which is now ready to accept a parameter.

```elixir
iex> names = Enum.map(people, get_name)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> ages = Enum.map(people, get_born)
[1949, 1948, 1962]
```

When working with multiple similar problems, the benefit of the curried function is clearly visible, as we reduced the amount of repeated code quite a plenty. The currying can be generalized even further, as shown [in this blog post](http://blog.patrikstorm.com/function-currying-in-elixir).

Now that we've gotten our hands dirty with functions and their behavior, let's take a look at some of the commonly used high-order functions provided by the Elixir API.
