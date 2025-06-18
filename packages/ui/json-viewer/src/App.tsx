import { createSignal, type Component } from "solid-js";

const Sub: Component<{
  data: any;
}> = (props) => {
  return <div>{props.data}</div>;
};

export const JsonViewer: Component<{ name?: string }> = (props) => {
  const [data, setData] = createSignal<any>(null);

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
