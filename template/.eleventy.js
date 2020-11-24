module.exports = (eleventyConfig) => {
  return {
    dir: {
      input: "{{ cfg.dir.input }}",
      output: "{{ cfg.dir.output }}"
    }
  };
};
