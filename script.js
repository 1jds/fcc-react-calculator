/** CORE LOGIC is that we pass a string containing a mathematical equation to eval which then interprets it and gives the answer.
 * This method means that we are computing the whole thing at once rather than one step at a time. Thus "3 + 5 * 6 - 2 / 4" = 32.5 rather than 11.5. It would obviously be a lot easier to handle smaller chunks of the equation at a time using the other method!
 *Eval has security concerns, but in a sense the data being inputted to eval is 'sanitised' here, because it is restricted to what can be entered on the calculator, which doesn't include the ability to pass dangerous JS syntax to eval. One could potentially make it even safer by sanitising the data passed to eval with a regex in the immediate vicinity of the eval execution environment.
 **/

function App() {
  // APP STATE
  const [result, setResult] = React.useState("0");
  const [isDecimalAllowed, setIsDecimalAllowed] = React.useState(true);
  const [prevInput, setPrevInput] = React.useState("0");
  const [isParensClosed, setIsParensClosed] = React.useState(true);
  // console.log("result is:", result);
  // console.log(isDecimalAllowed);
  // console.log("prev input is:", prevInput);
  // console.log(isParensClosed);
  // END OF APP STATE
  const operatorsArr = ["+", "-", "*", "/"];
  const integersArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  function addToSum(arg) {
    if (result === "invalid entry") {
      setResult("0");
    } else if (/odd|even/.test(result)) {
      setResult("0");
    }
    if (arg === "C") {
      setResult("0");
      setIsDecimalAllowed(true);
      setPrevInput("0");
      setIsParensClosed(true);
    } else if (integersArr.some((item) => item === arg)) {
      setResult((prevState) => {
        if (prevState === "0") {
          return arg;
        } else if (
          operatorsArr.some(
            (item) => item === prevState.charAt(prevState.length - 2)
          ) &&
          prevState.charAt(prevState.length - 1) === "0"
        ) {
          return arg === "0" ? prevState + "" : prevState + arg;
        } else {
          return prevState + arg;
        }
      });
    } else if (operatorsArr.some((item) => item === arg)) {
      setIsDecimalAllowed(true);
      setResult((prevState) => {
        if (
          operatorsArr.some(
            (item) => item === prevState.charAt(prevState.length - 1)
          ) &&
          operatorsArr.some(
            (item) => item === prevState.charAt(prevState.length - 2)
          )
        ) {
          return prevState.slice(0, -2) + arg;
        } else if (arg !== "-") {
          return operatorsArr.some(
            (item) => item === prevState.charAt(prevState.length - 1)
          )
            ? prevState.slice(0, -1) + arg
            : prevState + arg;
        } else if (arg === "-") {
          return prevState + arg;
        }
      });
    } else if (arg === ".") {
      isDecimalAllowed &&
        setResult((prevState) => {
          setIsDecimalAllowed(false);
          return prevState + arg;
        });
    } else if (arg === "(") {
      setResult((prevState) => {
        if (prevState === "0") {
          return arg;
        } else if (
          integersArr.some(
            (item) => item === prevState.charAt(prevState.length - 1)
          )
        ) {
          return prevState;
        } else if (
          operatorsArr.some(
            (item) => item === prevState.charAt(prevState.length - 1)
          )
        ) {
          return prevState + arg;
        } else if (prevState.charAt(prevState.length - 1) === "(") {
          return prevState;
        } else {
          return prevState + arg;
        }
      });
      setIsParensClosed(false);
    } else if (arg === ")") {
      setResult((prevState) => {
        if (!/\(/.test(prevState)) {
          return prevState;
        } else if (prevState.charAt(prevState.length - 1) === "(") {
          return prevState;
        } else if (prevState.charAt(prevState.length - 1) === ")") {
          return prevState;
        } else {
          return prevState + arg;
        }
      });
      setIsParensClosed(true);
    }
  }

  function removeOddEven(stateType) {
    if (stateType === "result") {
      const numsAtStartRegexOfStr = /^[-0-9.]*/;
      return result.match(numsAtStartRegexOfStr).toString();
    } else {
      if (/odd|even/.test(result)) {
        setResult((prevState) => {
          const numsAtStartRegexOfStr = /^[-0-9.]*/;
          return prevState.match(numsAtStartRegexOfStr).toString();
        });
      }
    }
  }

  function sumEquals(callingFunc) {
    setResult((prevState) => {
      if (!isParensClosed) {
        return "invalid entry";
      } else if (
        operatorsArr.some(
          (item) => item === prevState.charAt(prevState.length - 1)
        )
      ) {
        return "invalid entry";
      } else if (/--/.test(prevState)) {
        return eval(prevState.replace("--", "+")) + "";
      } else if (/odd|even/.test(prevState)) {
        removeOddEven();
        return prevState;
      } else if (prevState === "invalid entry") {
        return "0";
      } else if (!isParensClosed) {
        return "invalid entry";
      } else {
        return eval(prevState) + "";
      }
    });
    //Set or update the prevInput field
    if (callingFunc === "flip") {
      if (/odd|even/.test(result)) {
        setPrevInput(() => {
          return "\u00B1" + removeOddEven("result");
        });
      } else {
        setPrevInput("\u00B1" + result);
      }
    } else if (callingFunc === "remain") {
      setPrevInput("\u0025" + result);
    } else if (callingFunc === "sqrR") {
      if (/odd|even/.test(result)) {
        setPrevInput(() => {
          return "\u221A" + removeOddEven("result");
        });
      } else {
        setPrevInput("\u221A" + result);
      }
    } else if (callingFunc === "sqr") {
      if (/odd|even/.test(result)) {
        setPrevInput(() => {
          return removeOddEven("result") + "\u00B2";
        });
      } else {
        setPrevInput(result + "\u00B2");
      }
    } else if (callingFunc === "recip") {
      if (/odd|even/.test(result)) {
        setPrevInput(() => {
          return "1/" + removeOddEven("result");
        });
      } else {
        setPrevInput("1/" + result);
      }
    } else {
      setPrevInput(result);
    }
  }

  function flipSum() {
    removeOddEven();
    sumEquals(
      "flip"
    ); /*To avoid duplication of code, sumEquals() is called first; obviously there are different ways that changing a value from negative to positive and vice versa could be handled, the Microsoft Windows 10 Calculator provides an alternative.*/
    setResult((prevState) => {
      if (prevState === "invalid entry") {
        return prevState;
      } else {
        return eval(prevState) * -1 + "";
      }
    });
  }

  function remainder() {
    sumEquals("remain");
    setResult((prevState) => {
      if (prevState === "invalid entry") {
        return prevStat;
      } else if (/odd|even/.test(prevState)) {
        return prevState;
      } else {
        return prevState % 2 === 0
          ? `${prevState} is even`
          : `${prevState} is odd`;
      }
    });
  }

  function squareRoot() {
    removeOddEven();
    sumEquals("sqrR");
    setResult((prevState) => {
      if (prevState.startsWith("-")) {
        return "invalid entry";
      } else if (prevState === "invalid entry") {
        return prevState;
      } else {
        return Math.sqrt(prevState) + "";
      }
    });
  }

  function square() {
    removeOddEven();
    sumEquals("sqr");
    setResult((prevState) => {
      if (prevState === "invalid entry") {
        return prevState;
      } else {
        return prevState * prevState + "";
      }
    });
  }

  function reciprocal() {
    removeOddEven();
    sumEquals("recip");
    setResult((prevState) => {
      if (prevState === "invalid entry") {
        return prevState;
      } else {
        return 1 / prevState + "";
      }
    });
  }

  // ADDING KEYPAD/KEYBOARD FUNCTIONALITY FOR CALCULATOR
  React.useEffect(() => {
    function keyDownHandler(event) {
      switch (event.key) {
        case "0":
          event.preventDefault();
          addToSum("0");
          break;
        case "1":
          event.preventDefault();
          addToSum("1");
          break;
        case "2":
          event.preventDefault();
          addToSum("2");
          break;
        case "3":
          event.preventDefault();
          addToSum("3");
          break;
        case "4":
          event.preventDefault();
          addToSum("4");
          break;
        case "5":
          event.preventDefault();
          addToSum("5");
          break;
        case "6":
          event.preventDefault();
          addToSum("6");
          break;
        case "7":
          event.preventDefault();
          addToSum("7");
          break;
        case "8":
          event.preventDefault();
          addToSum("8");
          break;
        case "9":
          event.preventDefault();
          addToSum("9");
          break;
        case ".":
          event.preventDefault();
          addToSum(".");
          break;
        case "+":
          event.preventDefault();
          addToSum("+");
          break;
        case "-":
          event.preventDefault();
          addToSum("-");
          break;
        case "*":
          event.preventDefault();
          addToSum("*");
          break;
        case "/":
          event.preventDefault();
          addToSum("/");
          break;
        case "Enter":
          event.preventDefault();
          sumEquals();
          break;
        case "%":
          event.preventDefault();
          remainder();
          break;
        case "(":
          event.preventDefault();
          addToSum("(");
          break;
        case ")":
          event.preventDefault();
          addToSum(")");
          break;
        case "c":
          event.preventDefault();
          addToSum("C");
          break;
      }
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [result]);

  // JSX TO BE RENDERED
  return /*#__PURE__*/ React.createElement(
    "div",
    { class: "outer-container" } /*#__PURE__*/,
    React.createElement(
      "div",
      { id: "prev-input", className: "prev-input" },
      "Prev input: ",
      prevInput
    ) /*#__PURE__*/,
    React.createElement(
      "div",
      { id: "display", className: "display-area" },
      result
    ) /*#__PURE__*/,
    React.createElement(
      "div",
      { className: "container" } /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "clear",
          className: "item lighter-bg",
          onClick: () => addToSum("C"),
        },
        "C"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "open-parens",
          className: "item lighter-bg",
          onClick: () => addToSum("("),
        },
        "("
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "close-parens",
          className: "item lighter-bg",
          onClick: () => addToSum(")"),
        },
        ")"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "remainder", className: "item  lighter-bg", onClick: remainder },
        "%"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "reciprocal",
          className: "item chi-btn lighter-bg",
          onClick: reciprocal,
        },
        "1",
        /*#__PURE__*/ React.createElement(
          "span",
          { className: "italics" },
          "/\u03C7"
        )
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "square", className: "item chi-btn lighter-bg", onClick: square },
        /*#__PURE__*/ React.createElement(
          "span",
          { className: "italics" },
          "\u03C7"
        ),
        "\xB2"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "square-root",
          className: "item lighter-bg",
          onClick: squareRoot,
        },
        "\u221A"
      ) /*#__PURE__*/,

      React.createElement(
        "div",
        {
          id: "divide",
          className: "item operator-sign lighter-bg",
          onClick: () => addToSum("/"),
        },
        "\xF7"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "seven", className: "item", onClick: () => addToSum("7") },
        "7"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "eight", className: "item", onClick: () => addToSum("8") },
        "8"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "nine", className: "item", onClick: () => addToSum("9") },
        "9"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "multiply",
          className: "item operator-sign lighter-bg",
          onClick: () => addToSum("*"),
        },
        "\xD7"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "four", className: "item", onClick: () => addToSum("4") },
        "4"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "five", className: "item", onClick: () => addToSum("5") },
        "5"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "six", className: "item", onClick: () => addToSum("6") },
        "6"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "subtract",
          className: "item operator-sign lighter-bg",
          onClick: () => addToSum("-"),
        },
        "\u2212"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "one", className: "item", onClick: () => addToSum("1") },
        "1"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "two", className: "item", onClick: () => addToSum("2") },
        "2"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "three", className: "item", onClick: () => addToSum("3") },
        "3"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        {
          id: "add",
          className: "item operator-sign lighter-bg",
          onClick: () => addToSum("+"),
        },
        "+"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "plus-minus-flip", className: "item", onClick: flipSum },
        "\xB1"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "zero", className: "item", onClick: () => addToSum("0") },
        "0"
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "decimal", className: "item", onClick: () => addToSum(".") },
        "."
      ) /*#__PURE__*/,
      React.createElement(
        "div",
        { id: "equals", className: "item operator-sign", onClick: sumEquals },
        "="
      )
    )
  );
}

// RENDER
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/ React.createElement(App, null));
