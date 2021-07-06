const cardModule = {
  base_url: null,

  setBaseUrl(url) {
    cardModule.base_url = `${url}/cards`;
  },

  showAddCardModal(event) {
    const modal = document.getElementById('addCardModal');
    modal.classList.add('is-active');
    const listId = event.target.closest('[data-list-id]').getAttribute('data-list-id');
    modal.querySelector('[name="list_id"]').value = listId;
  },

  async handleAddCardForm(event) {
    const formData = new FormData(event.target);

    try {
      const response = await fetch(cardModule.base_url, {
        method: 'POST',
        body: formData
      });

      if(!response.ok) {
        throw new Error(response.status);
      }
      const card = await response.json();
      cardModule.makeCardInDOM(card);
      
    } catch (error) {
      alert(error);
    }
  },

  async handleModifyCardForm(currentCard, event) {
    const formData = new FormData(event.target);
    const id = currentCard.dataset.cardId;
    try {
      const response = await fetch(cardModule.base_url + `/${id}`, {
        method: 'PATCH',
        body: formData
      });

      if(!response.ok) {
        throw new Error(response.status);
      }
      const card = await response.json();

      currentCard.querySelector('.card-title').textContent = card.title;
      currentCard.style.backgroundColor = card.color;
      
    } catch (error) {
      alert(error);
    }
  },

  async deleteCard(event) {
    const cardToDelete = event.target.closest('.modal').querySelector('input').value;
    try {
      const response = await fetch(cardModule.base_url + `/${cardToDelete}`, {
        method: 'DELETE',
      });

      if(!response.ok) {
        throw new Error(response.status);
      }
      cardModule.removeCardFromDOM(cardToDelete);

    } catch (error) {
      alert(error);
    }
  },

  async removeCardFromDOM(id) {
    const cardToDelete = document.querySelector(`[data-card-id="${id}"]`);
    cardToDelete.remove();
    document.querySelector('#deleteCard').classList.remove('is-active');
  },


  makeCardInDOM(card) {
    const template = document.getElementById('cardTemplate');
    const cardElm = document.importNode(template.content, true);
    cardElm.querySelector('.card-title').textContent = card.title;
    const trueBox = cardElm.querySelector('.box');
    trueBox.style.backgroundColor = card.color;
    trueBox.setAttribute('data-listidfromcard', card.list_id)
    cardElm.querySelector('[data-card-id]').setAttribute('data-card-id', card.id);
    cardElm.querySelector('#editcard').addEventListener('click', cardModule.showFormEditCard);
    cardElm.querySelector('#deletecard').addEventListener('click', app.deleteModal);
    const btnEditTagElms = document.querySelectorAll('.edittag');

    for (const btnEditTagElm of btnEditTagElms) {
      btnEditTagElm.addEventListener('click', tagModule.showFormEditTag);
    }


    const btnAddTagElms = document.querySelectorAll('.btn-associate-tag');

    for(const btnAddTagElm of btnAddTagElms) {
      btnAddTagElm.addEventListener('click', tagModule.showAssociateCardTagModal);
    }

    document.querySelector(`[data-list-id="${card.list_id}"] .panel-block`).append(cardElm);

  },

  showFormEditCard(event) {
    const currentList = event.target.closest('.panel');
    const currentCard = event.target.closest('.box');
    currentCard.querySelector('.card-title').nextElementSibling.classList.remove('is-hidden');
    currentCard.querySelector('.card-title').classList.add('is-hidden');

    currentCard.querySelector('input[type="hidden"]').value = currentList.dataset.listId;
    currentCard.querySelector('form').addEventListener('submit', (event) => (app.handleModifyCardForm(currentCard, event)))
    
    currentCard.querySelector('.close').addEventListener('click', () => { 
      currentCard.querySelector('.card-title').nextElementSibling.classList.add('is-hidden');
      currentCard.querySelector('.card-title').classList.remove('is-hidden');
    })
  },

  // drag and drop des cartes, sauvegarde en BDD
  handleDropCard(event) {

    // grâce à event.from, je récupère l'id de la liste dont ma carte est partie
    const formerListId = event.from.closest('[data-list-id]').getAttribute('data-list-id');
    // ... event.to : l'id de la liste d'arrivée de ma carte
    const currentListId = event.to.closest('[data-list-id]').getAttribute('data-list-id');

    // maintenant, la carte contient l'id de la liste d'où elle vient
    // je la recherche dans sa nouvelle liste (avec le data-list-id) grâce à l'id de son ancienne liste (data-listidfromcard..formerListId) parce que c'est la seule à avoir une list_id différente dans la nouvelle liste
    let foundCard = event.to.closest('[data-list-id').querySelector(`[data-listidfromcard="${formerListId}"]`);
    
    // à ce niveau-là, je donne l'id de la liste d'arrivée à ma carte
    foundCard.setAttribute('data-listidfromcard', currentListId)

    // je récupère l'id de ma carte
    const cardId = foundCard.getAttribute('data-card-id');

    // je vais update la list_id de la carte pour l'envoyer en BDD
    const formData = new FormData();
    // mon list_id est égal au currentListId que j'ai trouvé au-dessus
    formData.set('list_id', currentListId);

    fetch(`${cardModule.base_url}/${cardId}`, {
      method: 'PATCH',
      body: formData
    })

    // ici, je récupère toutes les listes (grâce à leur attribut)
    const listElms = document.querySelectorAll('[data-list-id]');

    // je boucle (car querySelectorAll)
    for (const listElm of listElms) {
      // je récupère mes cartes dans la liste actuelle dans l'itération
      const cardElms = listElm.querySelectorAll('[data-card-id]')

      // je re-boucle (pour la même raison)
      // on déstructure le tableau cardElms pour récupérer son index dans position et la carte dans cardElm. le .entries permet la déstructuration
      for (const [position, cardElm] of cardElms.entries()) {
        const cardId = cardElm.getAttribute('data-card-id');
        const formData = new FormData();
        // je modifie la position
        formData.set('position', position);
        
        fetch(`${cardModule.base_url}/${cardId}`, {
          method: 'PATCH',
          body: formData
        });

      }
      // autre solution, le forEach permet de récupérer l'index (en 2e paramètre)

      // cardElms.forEach((cardElm, position) => {
      //   const cardId = cardElm.getAttribute('data-card-id');
      //   const formData = new FormData();
  
      //   formData.set('position', position);
        
      //   fetch(`${cardModule.base_url}/${cardId}`, {
      //     method: 'PATCH',
      //     body: formData
      //   });
      // })
      
    }
  }
}
