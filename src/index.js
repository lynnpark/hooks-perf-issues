import React from "react";
import ReactDOM from "react-dom";

import AppHooks from "./App.hooks";
import AppClass from "./App.class";
import AppHooksOptimized from "./App.hooks.optimised";

const App = {
  "0": AppClass,
  "1": AppHooks,
  "2": AppHooksOptimized
}[process.env.REACT_APP_HOOKS];

ReactDOM.render(<App />, document.getElementById("root"));
