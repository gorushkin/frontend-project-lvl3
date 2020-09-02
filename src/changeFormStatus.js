/* eslint no-param-reassign: "error" */

export default (input, button, status) => {
  const isFormBlocked = status === 'loading';
  input.disabled = isFormBlocked;
  button.disabled = isFormBlocked;
};
