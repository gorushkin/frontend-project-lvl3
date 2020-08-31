export default (elements, isFormBlocked) => {
  const { input, button } = elements;
  input.disabled = isFormBlocked;
  button.disabled = isFormBlocked;
};
