# FCC React Calculator

This repository contains the code for a working solution to the Free Code Camp React Calculator challenge.

The files in this respository were originally coded on Code Pen using:

1. HTML
2. CSS, and
3. React JS

## Notes

The core logic of the calculator is that we pass a string containing a mathematical equation to `eval()` which then interprets it and gives the answer.
This method means that we are computing the whole equation at once rather than one step at a time.
Thus "3 + 5 \* 6 - 2 / 4" = 32.5 rather than 11.5. It would obviously be a lot easier to handle smaller chunks of the equation at a time using the other method!
Using `eval()` has security concerns, but in a sense the data being inputted to it is 'sanitised' here, because it is restricted to what can be entered on the calculator, which doesn't include the ability for users to pass dangerous JS syntax to `eval()`.
One could potentially make it even safer by sanitising the data passed to `eval()` with a regex in the immediate vicinity of the `eval()` execution environment.
