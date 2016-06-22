// From http://stackoverflow.com/questions/8869403/drag-drop-json-into-chrome
function setupDnDFileController(selector, onDropCallback) {
  const el = document.querySelector(selector);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
    el.classList.add('dropping');
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragleave(e) {
    e.stopPropagation();
    e.preventDefault();
    // el_.classList.remove('dropping');
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    el.classList.remove('dropping');

    onDropCallback(e.dataTransfer.files, e);
  }

  el.addEventListener('dragenter', dragenter, false);
  el.addEventListener('dragover', dragover, false);
  el.addEventListener('dragleave', dragleave, false);
  el.addEventListener('drop', drop, false);
}
module.exports.setupDnDFileController = setupDnDFileController;
