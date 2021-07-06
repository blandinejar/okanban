const tagModule = {
  base_url: null,

  setBaseUrl(url) {
    tagModule.base_url = `${url}`;
  },

  showAddTagModal() {
    const modalElm = document.getElementById('addTagModal');
    modalElm.classList.add('is-active');
  },

  showDeleteTagModal() {
    const modalElm = document.getElementById('deleteTag');
    modalElm.classList.add('is-active');
    modalElm.querySelector('.button.is-danger').addEventListener('click', tagModule.deleteTag);
  },

  makeTagInDOM(tag, cardId) {

    const template = document.getElementById('tagTemplate');
    const tagElm = document.importNode(template.content, true);
    tagElm.querySelector('.close').addEventListener('click', (event) => {

      event.target.closest('.tag-form').classList.add('is-hidden');
      event.target.closest('.desoleeQuentin').querySelector('.edittag').classList.remove('is-hidden');
      event.target.closest('.desoleeQuentin').querySelector('.deletetag').classList.remove('is-hidden');

    })

    tagElm.querySelector('[data-tag-id]').setAttribute('data-tag-id', tag.id);
    tagElm.querySelector('.name').textContent = tag.name;
    tagElm.querySelector('.name').style.backgroundColor = tag.color;

    const addTagBtns = tagElm.querySelectorAll('.edittag');
    for (addTagBtn of addTagBtns) {
      addTagBtn.addEventListener('click', tagModule.showFormEditCard);

    }

    tagElm.querySelector('.deletetag').addEventListener('click', app.deleteModalTag);
    const tagsListElm = document.querySelector(`[data-card-id="${cardId}"]`);

    if (tagsListElm.querySelector(`[data-tag-id="${tag.id}"]`)) {
      return;
    }

    tagsListElm.append(tagElm);
  },

  showFormEditTag(event) {
    const currentCard = event.target.closest('.desoleeQuentin');
    currentCard.querySelector('.name').nextElementSibling.classList.remove('is-hidden');
    currentCard.querySelector('.edittag').classList.add('is-hidden');
    currentCard.querySelector('.deletetag').classList.add('is-hidden');

    const currentTag = currentCard.querySelector('[data-tag-id]')
    currentCard.querySelector('input[name="tag_id"]').value = currentTag.dataset.tagId;

    currentCard.querySelector('.tag-form').addEventListener('submit', (event) => (app.handleModifyTagForm(currentCard, event)))

  },

  async handleAddTagForm(event) {
    const formData = new FormData(event.target);
    try {

      const response = await fetch(tagModule.base_url + `/tags`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Le tag existe déjà !');
      }
      const tag = await response.json();

    } catch (error) {
      alert(error);
    }

  },

  async handleModifyTagForm(currentTag, event) {
    const formData = new FormData(event.target);
    const id = formData.get('tag_id');
    try {
      const response = await fetch(tagModule.base_url + `/tags/${id}`, {
        method: 'PATCH',
        body: formData
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const tag = await response.json();
      console.log(currentTag)
      currentTag.querySelector('.name').textContent = tag.name;
      currentTag.querySelector('.tag.name').style.backgroundColor = tag.color;


    } catch (error) {
      alert(error);
    }
  },

  async deleteTag(event) {

    try {
      const response = await fetch(`http://localhost:3000/cards/${app.cardId}/tag/${app.tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const currentTag = document.querySelector(`[data-tag-id="${app.tagId}"]`)
      const editTag = currentTag.closest('.desoleeQuentin');
      editTag.querySelector('.edittag').classList.add('is-hidden');
      editTag.querySelector('.deletetag').classList.add('is-hidden');

      tagModule.removeTagFromDOM(currentTag);

      app.hideModals();

    } catch (error) {
      alert(error);
    }
  },

  async removeTagFromDOM() {
    const tagToDelete = document.querySelector(`[data-tag-id="${app.tagId}"]`);
    tagToDelete.remove();
    document.querySelector('#deleteCard').classList.remove('is-active');
  },

  async showAssociateCardTagModal(event) {
    const cardId = event.target
      .closest('[data-card-id]')
      .getAttribute('data-card-id');
    const modalElm = document.getElementById('modalAssociateTags');

    modalElm
      .classList
      .add('is-active');

    try {
      const response = await fetch(`${tagModule.base_url}/tags`);

      if (!response.ok) {
        throw new Error(response.status);
      }

      const tags = await response.json();
      const tagListElm = modalElm.querySelector('.tags-list');
      tagListElm.setAttribute('data-card-id-mod', cardId);
      tagListElm.textContent = '';

      for (const tag of tags) {
        const tagElm = document.createElement('span');
        tagElm.setAttribute('data-tag-id', tag.id);
        tagElm.textContent = tag.name;
        tagElm.style.backgroundColor = tag.color;
        tagElm.classList.add('class-for-tags')
        tagElm.addEventListener('click', tagModule.handleAssociateTagToCard)
        tagListElm.append(tagElm);
      }
    } catch (e) {
      alert(e);
    }
  },

  async handleAssociateTagToCard(event) {
    const tagElm = event.currentTarget;
    const tagId = tagElm.getAttribute('data-tag-id');
    const cardId = tagElm.closest('[data-card-id-mod]').getAttribute('data-card-id-mod');
    console.log(tagId, "tagid")
    console.log(cardId, "cardid")

    try {
      const formData = new FormData();
      formData.set('tag_id', tagId);
      console.log(formData.get('tag_id'))
      const response = await fetch(`${tagModule.base_url}/cards/${cardId}/tag`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const responseGetTag = await fetch(`${tagModule.base_url}/tags/${tagId}`);
      if (!responseGetTag.ok) {
        throw new Error(responseGetTag.status);
      }

      const tag = await responseGetTag.json();
      tagModule.makeTagInDOM(tag, cardId);
    } catch (e) {
      alert(e);
    }
  },

}

