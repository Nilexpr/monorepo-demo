import {
  Predicate,
  Schema,
  type Deferred,
  type Effect,
  type Either,
  type ParseResult,
  type Stream,
} from "effect";

export const WebChannelSymbol = Symbol("WebChannel");
export type WebChannelSymbol = typeof WebChannelSymbol;

export interface WebChannel<MsgListen, MsgSend, E = never> {
  readonly [WebChannelSymbol]: unknown;
  send: (a: MsgSend) => Effect.Effect<void, ParseResult.ParseError | E>;
  listen: Stream.Stream<Either.Either<MsgListen, ParseResult.ParseError>, E>;
  supportsTransferables: boolean;
  closedDeferred: Deferred.Deferred<void>;
  shutdown: Effect.Effect<void>;
  schema: {
    listen: Schema.Schema<MsgListen, any>;
    send: Schema.Schema<MsgSend, any>;
  };
  debugInfo?: Record<string, any>;
}

export const isWebChannel = <MsgListen, MsgSend>(
  value: unknown
): value is WebChannel<MsgListen, MsgSend> =>
  typeof value === "object" &&
  value !== null &&
  Predicate.hasProperty(value, WebChannelSymbol);

export const DebugPingMessage = Schema.TaggedStruct("WebChannel.DebugPing", {
  message: Schema.String,
  payload: Schema.optional(Schema.String),
});

export const WebChannelPing = Schema.TaggedStruct("WebChannel.Ping", {
  requestId: Schema.String,
});

export const WebChannelPong = Schema.TaggedStruct("WebChannel.Pong", {
  requestId: Schema.String,
});

export const WebChannelHeartbeat = Schema.Union(WebChannelPing, WebChannelPong);

type WebChannelMessages =
  | typeof DebugPingMessage.Type
  | typeof WebChannelPing.Type
  | typeof WebChannelPong.Type;

export type InputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded> =
  | Schema.Schema<MsgListen | MsgSend, MsgListenEncoded | MsgSendEncoded>
  | OutputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>;

export type OutputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded> =
  {
    listen: Schema.Schema<MsgListen, MsgListenEncoded>;
    send: Schema.Schema<MsgSend, MsgSendEncoded>;
  };

export const schemaWithWebChannelMessages = <MsgListen, MsgSend>(
  schema: OutputSchema<MsgListen, MsgSend, any, any>
): OutputSchema<
  MsgListen | WebChannelMessages,
  MsgSend | WebChannelMessages,
  any,
  any
> => ({
  send: Schema.Union(
    schema.send,
    DebugPingMessage,
    WebChannelPing,
    WebChannelPong
  ),
  listen: Schema.Union(
    schema.listen,
    DebugPingMessage,
    WebChannelPing,
    WebChannelPong
  ),
});

export const mapSchema = <MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>(
  schema: InputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>
): OutputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded> =>
  Predicate.hasProperty(schema, "send") &&
  Predicate.hasProperty(schema, "listen")
    ? (schemaWithWebChannelMessages(schema) as any)
    : (schemaWithWebChannelMessages({ send: schema, listen: schema }) as any);
