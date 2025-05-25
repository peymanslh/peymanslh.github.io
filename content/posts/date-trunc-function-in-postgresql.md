---
title: "date_trunc function in PostgreSQL"
date: 2023-03-10T14:18:42+02:00
tags: ["sql", "postgresql"]
description: "Use date_trunc function in PostgreSQL to get a series of data based on a specific interval."
draft: false
---
Recently I needed to write a query in SQL to retrieve a bunch of data from a big table with a specific interval. And I don't know, is there any easier way in SQL to do this but I found `date_trunc` function in PostgreSQL that is an excellent solution for my problem.
# The problem with an example

Consider the following table.

|id |datetime |flight |price |
|---|---|---|---|
|1 |2023-03-07 12:45:12.231069+00 |AB12|300 |
|2 |2023-03-07 12:50:23.341069+00 |AB12|295 |
|3 |2023-03-07 13:10:19.241069+00 |AB12|295 |
|4 |2023-03-07 13:33:45.321069+00 |AB12|299 |
|6 |2023-03-07 13:51:58.311069+00 |AB12|299 |
|7 |2023-03-07 13:58:47.141069+00 |AB12|298 |
|8 |2023-03-07 14:15:19.151069+00 |AB12|286 |
|9 |2023-03-07 14:39:55.221069+00 |AB12|289 |
|10 |2023-03-07 15:48:29.111069+00 |AB12|289 |
|.. |.. |.. |.. |

And, we want to fetch one row per hour(or the last price for each hour) for flight `AB12`.
The output should be something like this.

|datetime |flight |price |
|---|---|---|
|2023-03-07 12:00:00.000000+00 |AB12|295 |
|2023-03-07 13:00:00.000000+00 |AB12|298 |
|2023-03-07 14:00:00.000000+00 |AB12|289 |
|2023-03-07 15:00:00.000000+00 |AB12|289 |

# date_trunc function

`date_trunc` function is simply truncating a `datetime` object based on an input.  
Usage:
```sql
date_trunc(_`field`_, _`source`_ [, _`time_zone`_ ])
```

`field` can be any value of the following list:
- `microseconds`
- `milliseconds`
- `second`
- `minute`
- `hour`
- `day`
- `week`
- `month`
- `quarter`
- `year`
- `decade`
- `century`
- `millennium`

And, `source` can be a column name or a value.  
Example from [PostgreSQL documentation](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-TRUNC):
```sql
SELECT date_trunc('hour', TIMESTAMP '2001-02-16 20:38:40');
-- Result: 2001-02-16 20:00:00

SELECT date_trunc('year', TIMESTAMP '2001-02-16 20:38:40');
-- Result: 2001-01-01 00:00:00

SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00');
-- Result: 2001-02-16 00:00:00-05

SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00', 'Australia/Sydney');
-- Result: 2001-02-16 08:00:00-05

SELECT date_trunc('hour', INTERVAL '3 days 02:47:33');
-- Result: 3 days 02:00:00
```
# Solution to my problem

`date_trunc` is great for working with `datetime`, but it does not end up here. We can use it in our queries to fetch data with a specific interval based on `field` argument to this function.
The following SQL query gives us the output that we expect.

```sql {linenos=table}
SELECT
  DATE_TRUNC('hour', datetime) AS datetime,
  TO_JSON(ARRAY_AGG(flight))->-1 AS flight,
  TO_JSON(ARRAY_AGG(price ORDER BY datetime ASC))->-1,
FROM
    flights
WHERE
    flight = 'AB12'
GROUP BY
    DATE_TRUNC('hour', datetime);
```

Query explanation:  
Line 2: We use `date_trunc` in the select statement to get a truncated `datetime`.  
Line 3: For each hour we have multiple rows, for example at 13:00 we have four rows of data and we need to choose one of them for output, or use an aggregate function like `count` or `avg`, but here we want the last row and we can use `to_json` and `array_agg` to get the item we want.  
Line 4: Same as the previous line, but we used sorting based on `datetime` to get the last price of each hour.  
And finally, in the last line, we use `date_trunc` in our group statement to group data based on the hour.  
Our output should be something like this:

|datetime |flight |price |
|---|---|---|
|2023-03-07 12:00:00.000000+00 |AB12|295 |
|2023-03-07 13:00:00.000000+00 |AB12|298 |
|2023-03-07 14:00:00.000000+00 |AB12|289 |
|2023-03-07 15:00:00.000000+00 |AB12|289 |
