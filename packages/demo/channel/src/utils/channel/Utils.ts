import { Effect, Either, ParseResult, Schema, Scope, Stream } from "effect";
import { DebugPingMessage } from "./interfaces";

/** Same as `Effect.scopeWith` but with a `CloseableScope` instead of a `Scope`. */
export const scopeWithCloseable = <R, E, A>(
  fn: (scope: Scope.CloseableScope) => Effect.Effect<A, E, R | Scope.Scope>
): Effect.Effect<A, E, R | Scope.Scope> =>
  Effect.gen(function* () {
    // const parentScope = yield* Scope.Scope
    // const scope = yield* Scope.fork(parentScope, ExecutionStrategy.sequential)
    const scope = yield* Scope.make();
    yield* Effect.addFinalizer((exit) => Scope.close(scope, exit));
    return yield* fn(scope).pipe(Scope.extend(scope));
  });

export const listenToDebugPing =
  (channelName: string) =>
  <MsgListen>(
    stream: Stream.Stream<
      Either.Either<MsgListen, ParseResult.ParseError>,
      never
    >
  ): Stream.Stream<Either.Either<MsgListen, ParseResult.ParseError>, never> =>
    stream.pipe(
      Stream.filterEffect(
        Effect.fn(function* (msg) {
          if (msg._tag === "Right" && Schema.is(DebugPingMessage)(msg.right)) {
            yield* Effect.logDebug(
              `WebChannel:ping [${channelName}] ${msg.right.message}`,
              msg.right.payload
            );
            return false;
          }
          return true;
        })
      )
    );
