/* @refresh reload */
import { render } from "solid-js/web";
import { JsonViewer as App } from "./App.tsx";
import "./global.css";

const root = document.getElementById("root");

render(() => <App />, root!);
