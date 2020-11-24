module.exports = (eleventyConfig) => {
  return {
    dir: {
      input: "{{ dir.input }}",
      output: "{{ dir.output }}"
    }
  };
};
