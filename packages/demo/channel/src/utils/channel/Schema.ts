import { Effect, Schema } from "effect";
import type { ParseError } from "effect/ParseResult";
import type { ParseOptions } from "effect/SchemaAST";
import { Transferable } from "@effect/platform";

export const encodeWithTransferables =
  <A, I, R>(
    schema: Schema.Schema<A, I, R>,
    options?: ParseOptions | undefined
  ) =>
  (
    a: A,
    overrideOptions?: ParseOptions | undefined
  ): Effect.Effect<[I, Transferable[]], ParseError, R> =>
    Effect.gen(function* () {
      const collector = yield* Transferable.makeCollector;

      const encoded: I = yield* Schema.encode(schema, options)(
        a,
        overrideOptions
      ).pipe(Effect.provideService(Transferable.Collector, collector));

      return [encoded, collector.unsafeRead() as Transferable[]];
    });
