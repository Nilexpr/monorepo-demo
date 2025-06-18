import dts from "vite-plugin-dts";

export const MonorepoViteConfig = () => {
  return {
    plugins: [dts(
      { rollupTypes: true }
    )],
  };
};
