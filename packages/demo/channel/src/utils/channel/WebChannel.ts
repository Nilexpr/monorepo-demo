import { Deferred, Effect, Exit, Schema, Scope, Stream } from "effect";
import {
  mapSchema,
  WebChannelSymbol,
  type InputSchema,
  type WebChannel,
} from "./interfaces";
import { listenToDebugPing, scopeWithCloseable } from "./Utils";
import { encodeWithTransferables } from "./Schema";

export const shutdown = <MsgListen, MsgSend>(
  webChannel: WebChannel<MsgListen, MsgSend>
): Effect.Effect<void> => Deferred.done(webChannel.closedDeferred, Exit.void);

export const noopChannel = <MsgListen, MsgSend>(): Effect.Effect<
  WebChannel<MsgListen, MsgSend>,
  never,
  Scope.Scope
> =>
  scopeWithCloseable((scope) =>
    Effect.gen(function* () {
      return {
        [WebChannelSymbol]: WebChannelSymbol,
        send: () => Effect.void,
        listen: Stream.never,
        closedDeferred: yield* Deferred.make<void>().pipe(
          Effect.acquireRelease(Deferred.done(Exit.void))
        ),
        shutdown: Scope.close(scope, Exit.succeed("shutdown")),
        schema: {
          listen: Schema.Any,
          send: Schema.Any,
        } as any,
        supportsTransferables: false,
      };
    }).pipe(Effect.withSpan(`WebChannel:noopChannel`))
  );

export const windowChannel = <
  MsgListen,
  MsgSend,
  MsgListenEncoded,
  MsgSendEncoded,
>({
  listenWindow,
  sendWindow,
  targetOrigin = "*",
  ids,
  schema: inputSchema,
}: {
  listenWindow: Window;
  sendWindow: Window;
  targetOrigin?: string;
  ids: { own: string; other: string };
  schema: InputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>;
}) =>
  scopeWithCloseable((scope) =>
    Effect.gen(function* () {
      const schema = mapSchema(inputSchema);

      const debugInfo = {
        sendTotal: 0,
        listenTotal: 0,
        targetOrigin,
        ids,
      };

      const WindowMessageListen = Schema.Struct({
        message: schema.listen,
        from: Schema.Literal(ids.other),
        to: Schema.Literal(ids.own),
      }).annotations({ title: "webmesh.WindowMessageListen" });

      const WindowMessageSend = Schema.Struct({
        message: schema.send,
        from: Schema.Literal(ids.own),
        to: Schema.Literal(ids.other),
      }).annotations({ title: "webmesh.WindowMessageSend" });

      const send = (message: MsgSend) =>
        Effect.gen(function* () {
          debugInfo.sendTotal++;

          const [messageEncoded, transferables] =
            yield* encodeWithTransferables(WindowMessageSend)({
              message,
              from: ids.own,
              to: ids.other,
            });

          sendWindow.postMessage(messageEncoded, targetOrigin, transferables);
        });

      const listen = Stream.fromEventListener<MessageEvent>(
        listenWindow,
        "message"
      ).pipe(
        // Stream.tap((_) => Effect.log(`${ids.other}→${ids.own}:message`, _.data)),
        Stream.filter((_) =>
          Schema.is(Schema.encodedSchema(WindowMessageListen))(_.data)
        ),
        Stream.map((_) => {
          debugInfo.listenTotal++;
          return Schema.decodeEither(schema.listen)(_.data.message);
        }),
        listenToDebugPing("window")
      );

      const closedDeferred = yield* Deferred.make<void>().pipe(
        Effect.acquireRelease(Deferred.done(Exit.void))
      );
      const supportsTransferables = true;

      return {
        [WebChannelSymbol]: WebChannelSymbol,
        send,
        listen,
        closedDeferred,
        shutdown: Scope.close(scope, Exit.succeed("shutdown")),
        schema,
        supportsTransferables,
        debugInfo,
      };
    }).pipe(Effect.withSpan(`WebChannel:windowChannel`))
  );
