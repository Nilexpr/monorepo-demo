import { createSignal, type Component } from "solid-js";
import { createTreeFromJson } from "@repo/headless-tree";

const Sub: Component<{
  data: any;
}> = (props) => {
  return <div>{props.data}</div>;
};

export const JsonViewer: Component<{ name?: string }> = (props) => {
  const [data, setData] = createSignal<any>(null);

  const tree = createTreeFromJson([
    {
      a: 123,
      b: "123",
      c: {
        d: 456,
        e: "456",
      },
    },
  ]);

  console.log(tree);

  return (
    <div class="bg-background">
      {props.name}
      <input
        type="text"
        value={data()}
        onChange={(e) => setData(e.target.value)}
      />
      <Sub data={data} />
    </div>
  );
};
