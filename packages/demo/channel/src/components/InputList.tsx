import { Effect, Schema, Stream } from "effect";
import { createSignal, onMount, type Component } from "solid-js";
import { windowChannel } from "../utils/channel/WebChannel";

export const InputList: Component<{
  listenWindow?: Window;
  sendWindow?: Window;
  ownId: string;
  otherId: string;
}> = (props) => {
  const [input, setInput] = createSignal<string>("");
  const [received, setReceived] = createSignal<string>();

  const getChannel = Effect.gen(function* () {
    console.log("getChannel", {
      listenWindow: props.listenWindow,
      sendWindow: props.sendWindow,
    });

    return yield* windowChannel({
      listenWindow: props.listenWindow as Window,
      sendWindow: props.sendWindow as Window,
      ids: { own: props.ownId, other: props.otherId },
      schema: Schema.String,
    });
  });

  const sendMessage = Effect.gen(function* () {
    const channel = yield* getChannel;

    yield* channel.send(input());

    console.log("sendMessage", input());
  });

  const listenMessage = Effect.gen(function* () {
    const channel = yield* getChannel;

    // 持续监听消息流
    const msgFromAFiber = yield* channel.listen.pipe(
      Stream.flatten(),
      Stream.runHead,
      Effect.flatten,
      Effect.fork
    );

    const msg = yield* msgFromAFiber;
    setReceived(msg);

    console.log("msg", {
      msg,
      self: containerRef,
    });
  });

  onMount(() => {
    // 监听接收到的消息
    window.addEventListener("message", (event) => {
      console.log("📨 接收到消息:", {
        data: event.data,
        origin: event.origin,
        source: event.source,
        lastEventId: event.lastEventId,
        self: containerRef,
      });
    });

    // 启动监听消息的 fiber
    const listenFiber = Effect.runFork(Effect.scoped(listenMessage));
  });

  let containerRef: HTMLDivElement | undefined;

  return (
    <div
      class="flex flex-col gap-2 border-2 border-gray-300 p-2"
      ref={containerRef}
    >
      <div>
        <span>Input:</span>
        <input
          value={input()}
          oninput={(e) => {
            setInput(e.target.value);
          }}
        />
      </div>
      <div class="flex  gap-2">
        <div>Received: </div>
        <div>{received()}</div>
      </div>
      <button
        class="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        onclick={() => {
          Effect.runPromise(Effect.scoped(sendMessage));
        }}
      >
        Send
      </button>
    </div>
  );
};
