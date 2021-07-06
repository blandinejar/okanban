const listModule = {
  base_url: null,
  setBaseUrl(url) {
    listModule.base_url = `${url}/lists`;
  },
  async getListsFromAPI() {
    try {
      const response = await fetch(listModule.base_url);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const lists = await response.json();

      for (const list of lists) {
        listModule.makeListInDOM(list);

        for (const card of list.cards) {
          cardModule.makeCardInDOM(card);

          for (const tag of card.tags) {
            const cardId = tag.tag_belongsto_card.card_id;
            tagModule.makeTagInDOM(tag, cardId);
          }
        }
      }
      const cardListElm = document.querySelector('.card-lists');
      new Sortable(cardListElm, {
        animation: 300,
        onEnd: listModule.handleDropList
      });

      const dragElem = document.querySelectorAll('.list-drop-zone');
      for (const elem of dragElem) {
        const sortable = Sortable.create(elem, {
          animation: 150,
          swapThreshold: 1,
          // draggable: '.box',
          group: '.box',
          onEnd: cardModule.handleDropCard
        })
      }

    } catch (error) {
      alert(error);
    }
  },
  showAddListModal() {
    const modalElm = document.getElementById('addListModal');
    modalElm.classList.add('is-active');
  },

  showDeleteAllListsModal() {
    const modalElm = document.getElementById('deleteAllListsModal');
    modalElm.classList.add('is-active');
    modalElm.querySelector('.button.is-danger').addEventListener('click', listModule.deleteAllLists);
  },

  async handleAddListForm(event) {

    const formData = new FormData(event.target);

    try {

      const response = await fetch(listModule.base_url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(response.status);
      }
      const list = await response.json();

      listModule.makeListInDOM(list);

    } catch (error) {
      alert(error);
    }
  },

  async handleModifyListForm(currentList, event) {

    const formData = new FormData(event.target);
    const id = currentList.dataset.listId;

    try {
      const response = await fetch(listModule.base_url + `/${id}`, {
        method: 'PATCH',
        body: formData
      });

      if (!response.ok) {
        throw new Error(response.status);
      }
      const list = await response.json();
      currentList.querySelector('h2').textContent = list.name;
    } catch (error) {
      alert(error);
    }
  },

  async deleteList(event) {
    console.log('test')
    const listToDelete = event.target.closest('.modal').querySelector('input').value;
    try {
      const response = await fetch(listModule.base_url + `/${listToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      listModule.removeListFromDOM(listToDelete);
    } catch (error) {
      alert(error);
    }
  },

  async removeListFromDOM(id) {
    const listToDelete = document.querySelector(`[data-list-id="${id}"]`);
    listToDelete.remove();
    document.querySelector('#deleteList').classList.remove('is-active');
  },

  async deleteAllLists() {
    app.hideModals();
    try {
      const response = await fetch(listModule.base_url, {
        method: 'DELETE',
      });

      document.querySelector('.card-lists').textContent = "";
      if (!response.ok) {
        throw new Error(response.status);
      }

    } catch (error) {
      alert(error);
    }
  },


  makeListInDOM(list) {
    const template = document.getElementById('listTemplate');
    const listElm = document.importNode(template.content, true);
    listElm.querySelector('.list-title').textContent = list.name;
    listElm.querySelector('[data-list-id]').setAttribute('data-list-id', list.id);
    listElm.querySelector('.btn-add-card').addEventListener('click', cardModule.showAddCardModal);
    listElm.querySelector('.list-title').addEventListener('dblclick', listModule.showFormEditList);
    listElm.querySelector('#deletelist').addEventListener('click', app.deleteModalList);
    document.querySelector('.card-lists').append(listElm);
  },

  showFormEditList(event) {
    const currentList = event.target.closest('.panel');
    console.log(event.target);
    currentList.querySelector('.list-title').nextElementSibling.classList.remove('is-hidden');
    currentList.querySelector('.list-title').classList.add('is-hidden');

    currentList.querySelector('form').addEventListener('submit', (event) => { app.handleModifyListForm(currentList, event) });

  },

  handleDropList(event) {
    const listElms = event.target.querySelectorAll('[data-list-id]');

    for (const [position, listElm] of listElms.entries()) {
      const listId = listElm.getAttribute('data-list-id');
      const formData = new FormData();

      formData.set('position', position);

      fetch(`${listModule.base_url}/${listId}`, {
        method: 'PATCH',
        body: formData
      });

      // const cardElms = document.querySelectorAll('[data-card-id');
      // console.log(cardElms)

      // for (const [position, cardElm] of cardElms.entries()) {
      //   const cardId = cardElm.getAttribute('data-card-id');
      // const formData = new FormData();

      // formData.set('position', position);

      // fetch(`${cardModule.base_url}/${cardId}`, {
      //   method: 'PATCH',
      //   body: formData
      // });
      // }
    }
  }
}
