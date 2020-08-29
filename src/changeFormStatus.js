export default (form, isFormBlocked) => {
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  input.disabled = isFormBlocked;
  button.disabled = isFormBlocked;
};
