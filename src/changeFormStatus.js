/* eslint no-param-reassign: "error" */

export const block = (input, button) => {
  input.disabled = true;
  button.disabled = true;
};

export const unblock = (input, button) => {
  input.disabled = false;
  button.disabled = false;
};
