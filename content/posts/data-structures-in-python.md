---
title: "Data Structures in Python"
date: 2023-03-06T19:49:30+03:30
tags: ["python", "data-structures"]
description: "A brief explanation of some data structures in Python besides list, dict, and tuple that you should know when coding in Python."
---

When we code in Python usually there are multiple data structures such as `list`, `tuple`, `set`, and `dict` that we mostly use. But besides these four, Python has other data structures that each of them like those four has some strengths and weaknesses based on their implementation and structure that we can use, and it's better to know them because sometimes it might help and have a better performance and features based on your problem than `list`, `tuple`, `set`, and `dict`.

![Data structures in Python overview image](/images/posts/python-data-structures.svg)

Notes:
- **Cotainer Sequences** are sequences that can hold different types and can be nested.
- **Flat Sequences** are sequences that only can hold one simple type.

I'll try to explain the above diagram from left to right. Also, I'm not going through some data structures that you are already familiar with them.
# collections.deque
A List in Python is a dynamic array that can contain multiple data types and, you can easily use a Python list as a stack using `.append()` and `.pop()` methods and have a good performance. But, when it comes to `.insert()` (add an item to the beginning of a list) or `.pop()` from the beginning of a list, it's not efficient because all other items should be shifted by one.
So, it's recommended to use `collections.deque` for a First-in, First-out queue.
```python
from collections import deque

queue = deque([1, 2, 3]) # queue = [1, 2, 3]
queue.append(4) # queue = [1, 2, 3, 4]
queue.popleft() # queue = [2, 3, 4]
```
# array.array
Python's `array` type is a sequence type that only can hold basic types like characters, integers, and float, and it's very efficient when you hold a large number of items in it.
`array` has other methods like `.frombytes` and `.tofile` besides `.append`, `.pop`, and `.extend` that you have in `list`.
```python
from array import array
numbers = array('l', [1, 2, 3, 4, 5]) # creating an array of 5 [type] items
```
See Python documentation: [array](https://docs.python.org/3/library/array.html).
# set and frozenset
`set` is an **unordered** data structure in Python that can hold **non-duplicate** **hashable** items.
Hashable are types or classes that implemented the `__hash__` method.
```python
from collections import abc
# Test hashable
issubclass(int, abc.Hashable) # True
issubclass(list, abc.Hashable) # False

# define set using set() and {}
cities = set(['Berlin', 'Amsterdam', 'London', 'Amsterdam']) # {'Amsterdam', 'Berlin', 'London'}

cities = {'Berlin', 'Amsterdam', 'London', 'Amsterdam'{ # {'Amsterdam', 'Berlin', 'London'}

cities.add('London') # {'Amsterdam', 'Berlin', 'London'}
cities.add('Rome') # {'Amsterdam', 'Berlin', 'Rome', 'London'}
```
Also, there is an immutable version of set called `frozenset` that you can use.
```python

cities = frozenset(['Berlin', 'Amsterdam', 'London', 'Amsterdam']) # {'Amsterdam', 'Berlin', 'London'}
```
See Python documentation: [set and fronzenset](https://docs.python.org/3/library/stdtypes.html#set).
# collections.OrderedDict
After the release of Python 3.6 `dict` is ordered based on the insertion of items and you don't need `collections.OrderedDict` unless you want your code to be compatible with Python < 3.6!
# collections.Counter
`Counter` is a subclass of `dict` for `hashable` items in Python that you can use to count the number of items using it.
```python
from collections import Counter

repeat_count = Counter(['Berlin', 'Amsterdam', 'London', 'Amsterdam'])
# Counter({'Amsterdam': 2, 'Berlin': 1, 'London': 1})
```
See Python documentation: [Counter](https://docs.python.org/3/library/collections.html?highlight=counter#collections.Counter).
# collections.ChainMap
By using `ChainMap` you can group multiple mappings together and create an updatable view of them.
```python
from collections import ChainMap

base = {'python': '3.10', 'year': '2021'}
new_update = {'python': '3.11', 'year': '2022', 'author': 'Guido van Rossum'}

python = ChainMap(base, new_update)
# ChainMap({'python': '3.10', 'year': '2021'}, {'python': '3.11', 'year': '2022', 'author': 'Guido van Rossum'})

list(python) # ['python', 'year', 'author']
```
You can think of using `**` to join multiple `dict` together instead of using `ChainMap` but keep in mind that `ChainMap` incorporates the underlying mappings by reference so if you update your `dict`, your `ChainMap` view is getting updated too.
```python
a = {**base, **new_update} # {'python': '3.11', 'year': '2022', 'author': 'Guido van Rossum'}

new_update['python'] = '3.12'

a # {'python': '3.11', 'year': '2022', 'author': 'Guido van Rossum'}

python # ChainMap({'python': '3.10', 'year': '2021'}, {'python': '3.12', 'year': '2022', 'author': 'Guido van Rossum'})
```
See Python documentation: [ChainMap](https://docs.python.org/3/library/collections.html?highlight=chainmap#collections.ChainMap).
# Different kinds of Queue
In the `queue` library of Python, you can find multiple implementations of queue that I give you a brief explanation of them here.
## Queue
An implementation of a FIFO(first-in, first-out) queue in Python.
Queue takes a `maxsize` argument which is the size of the queue and if the number of items in the queue reaches this number, your queue is blocked until you consume items from it.
```python
from queue import Queue

q = Queue(1)
q.put('first')
q.put_nowait('second') # does not wait until get an item and raise an error if queue is full, which in this case queue is full and raise error
q.get() # 'first'
```
## LifoQueue
`LifoQueue` is a subclass of `Queue` that implements a LIFO(last-in, first-out) queue.
## PriorityQueue
PriorityQueue is a subclass of Queue that returns items in the queue based on a Priority of smallest to largest.
```python
from queue import PriorityQueue

q = PriorityQueue(3)
q.put(30)
q.put(14)
q.put(21)
q.get() # 14
q.get() # 21
q.get() # 30
```
## SimpleQueue
`SimpleQueue` is an implementation of the FIFO(first-in, first-out) queue that is unbounded and added in Python 3.7.
Note that Python uses `collections.deque` under the hood in `SimpleQueue`.

See Python documentation: [queue](https://docs.python.org/3/library/queue.html?highlight=queue#module-queue).

