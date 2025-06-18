import { createSignal, type Component } from "solid-js";

const Sub: Component<{
  data: any;
}> = (props) => {
  return <div>{props.data}</div>;
};

const JsonViewer = () => {
  const [data, setData] = createSignal<any>(null);

  return (
    <div>
      <input
        type="text"
        value={data()}
        onChange={(e) => setData(e.target.value)}
      />
      <Sub data={data} />
    </div>
  );
};

export default JsonViewer;
