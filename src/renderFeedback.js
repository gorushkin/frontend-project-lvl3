/* eslint no-param-reassign: "error" */

export default (message, status, feedback, input) => {
  if (status === 'error') {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  }
  feedback.innerHTML = message;
};
