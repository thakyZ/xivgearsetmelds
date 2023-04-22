$(document).ready(() => {
  let popoverTriggerList = [].slice.call($('[data-bs-toggle="popover"]'))
  let popoverList = popoverTriggerList.map(popoverTriggerEl => {
    return new bootstrap.Popover(popoverTriggerEl);
  });
});