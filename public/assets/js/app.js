const app = {

  base_url: 'http://54.234.220.175:3000',

  init: function () {
    console.log('app.init !');
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);
    listModule.getListsFromAPI();
    app.addListenerToActions();

  },

  addListenerToActions() {

    document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);
    document.getElementById('deleteAllListsButton').addEventListener('click', listModule.showDeleteAllListsModal);

    const closeBackgrounds = document.querySelectorAll('.modal-background');
    for (const closeBackground of closeBackgrounds) {
      closeBackground.addEventListener('click', app.hideModals);
    }

    const closeModalElms = document.querySelectorAll('.modal .close');
    for (const closeModalElm of closeModalElms) {
      closeModalElm.addEventListener('click', app.hideModals);
    }

    document.getElementById('addTagButton').addEventListener('click', tagModule.showAddTagModal);
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
    document.querySelector('#addTagModal form').addEventListener('submit', app.handleAddTagForm);

    const btnAddCardElms = document.querySelectorAll('.btn-add-card');
    for (const btnAddCardElm of btnAddCardElms) {
      btnAddCardElm.addEventListener('click', cardModule.showAddCardModal);
    }
  },

  deleteModal(event) {
    document.querySelector('#deleteCard').classList.add('is-active');
    const inputValue = event.target.closest('.box').getAttribute('data-card-id');
    const cardInput = document.querySelector('#deleteCard')
    cardInput.querySelector('#deleteCardInput').value = `${inputValue}`;
    cardInput.querySelector('.is-danger').addEventListener('click', cardModule.deleteCard);
  },

  deleteModalList(event) {
    document.querySelector('#deleteList').classList.add('is-active');
    const inputValue = event.target.closest('.is-one-quarter').getAttribute('data-list-id');
    const listInput = document.querySelector('#deleteList');
    listInput.querySelector('#deleteListInput').value = `${inputValue}`;
    listInput.querySelector('.is-danger').addEventListener('click', listModule.deleteList);

  },

  cardId: null,
  tagId: null,

  deleteModalTag(event) {
    document.querySelector('#deleteTag').classList.add('is-active');
    app.tagId = event.target.closest('.desoleeQuentin').querySelector('.tag.name').getAttribute('data-tag-id');
    app.cardId = event.target.closest('.desoleeQuentin').closest('.box').getAttribute('data-card-id');
    const tagInput = document.querySelector('#deleteTag');
    tagInput.querySelector('.is-danger').addEventListener('click', tagModule.deleteTag);

  },

  handleAddListForm(event) {
    event.preventDefault();
    listModule.handleAddListForm(event);
    app.hideModals();
  },

  handleModifyListForm(currentList, event) {
    event.preventDefault();
    currentList.querySelector('.list-title').nextElementSibling.classList.add('is-hidden');
    currentList.querySelector('.list-title').classList.remove('is-hidden');
    listModule.handleModifyListForm(currentList, event);

  },

  handleAddCardForm(event) {
    event.preventDefault();
    cardModule.handleAddCardForm(event);
    app.hideModals();
  },


  handleModifyCardForm(currentCard, event) {
    event.preventDefault();
    currentCard.querySelector('.card-title').nextElementSibling.classList.add('is-hidden');
    currentCard.querySelector('.card-title').classList.remove('is-hidden');
    cardModule.handleModifyCardForm(currentCard, event);
  },

  handleAddTagForm(event) {
    event.preventDefault();
    tagModule.handleAddTagForm(event);
    app.hideModals();
  },

  handleModifyTagForm(currentTag, event) {
    event.preventDefault();
    currentTag.querySelector('.tag-form').classList.add('is-hidden');
    currentTag.querySelector('.edittag').classList.remove('is-hidden');
    currentTag.querySelector('.deletetag').classList.remove('is-hidden');
    tagModule.handleModifyTagForm(currentTag, event);
  },

  hideModals() {
    const modalElms = document.querySelectorAll('.modal');
    for (const modalElm of modalElms) {
      modalElm.classList.remove('is-active');
    }
  },
};

document.addEventListener('DOMContentLoaded', app.init);
