import { createFileRoute } from "@tanstack/solid-router";
import { type Component } from "solid-js";
import { InputList } from "../../components/InputList";

export const InputContainer: Component = () => {
  return (
    <InputList
      listenWindow={window.top as Window}
      sendWindow={window}
      ownId="b"
      otherId="a"
    />
  );
};

export const Route = createFileRoute("/iframes/inputContainer")({
  component: InputContainer,
});
