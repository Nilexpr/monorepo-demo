import { createFileRoute } from "@tanstack/solid-router";
import { InputList } from "../components/InputList";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  let iframe1Ref: HTMLIFrameElement | undefined;

  return (
    <>
      <div class="flex gap-2">
        <iframe ref={iframe1Ref} src="/iframes/inputContainer" />
        <InputList
          listenWindow={iframe1Ref?.contentWindow as Window}
          sendWindow={window}
          ownId="a"
          otherId="b"
        />
      </div>
    </>
  );
}
