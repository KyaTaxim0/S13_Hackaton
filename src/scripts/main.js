class CreateUser {
    users = [];
    modalDom = new bootstrap.Modal(document.getElementById("exampleModal"));
    confirmModalDom = new bootstrap.Modal(
      document.getElementById("confirmModal")
    );
    formConfirmDom = document.querySelector(".js_form_confirm");
    btnsRegister = document.querySelectorAll(".js_register_event_register");
  
    constructor() {
      // se ejecuta el constructor
      this.init();
    }
  
    init() {
      this.getUser();
      this.registerEventFormRegister();
      this.registerButtonsRegister();
      this.getDom().refModalRegisterEdit.addEventListener(
        "hidden.bs.modal",
        () => {
          this.getDom().formRegisterEdit.reset();
        }
      );
    }
  
    getUser(){
        let petArr = fetch('http://localhost:3000/pets');
        petArr.then(response => response.json())
        // .then((pets)=>{
        //     console.log('pets',pets)
        // }) 
    }


    registerEventFormRegister() {
      const form = this.getDom().formRegisterEdit; // atrapo formulario
      form.onsubmit = (event) => {
        // registro evento en el formulario
        event.preventDefault();
        this.addCardinDom(this.makeCardUser(this.getValuesUser())); // obtener valores del formulario
        this.modalDom.hide();
        form.reset();
      };
    }
  
    registerButtonsRegister() {
      this.btnsRegister.forEach((btn) => {
        btn.onclick = () => {
          this.registerEventFormRegister();
        };
      });
    }
  
    editDomCard(values, idNode) {
      const card = document.getElementById(idNode);
      const { name, lastname, raza, phone, country, photo } = values;
  
      card.querySelector(".replace").innerHTML = `
          <div class="replace">
              <figure><img src=${photo}  class="card-img-top"/></figure>
              <div class="card-body">
                  <ul class="list-group">
                      <li class="list-group-item"><label>Nombre completo:</label>${name} ${lastname}</li>
                      <li class="list-group-item"><label>Raza:</label>${raza}</li>
                      <li class="list-group-item"><label>Telefono:</label>${phone}</li>
                      <li class="list-group-item"><label>Pais:</label>${country}</li>
                  </ul>
              </div>
          </div>
      `;
    }
  
    registerEventFormEdit(idDom) {
      const form = this.getDom().formRegisterEdit;
      const positionUser = this.users.findIndex((user) => user.id === idDom);
  
      form.onsubmit = (event) => {
        event.preventDefault();
        this.editDomCard(this.getValuesUser(), idDom);
  
        this.users[positionUser] = Object.assign({}, this.users[positionUser], {
          ...this.getValuesUser(),
        });
        this.modalDom.hide();
      };
    }
  
    getDom() {
      const form = {
        name: document.querySelector(".js_name"),
        lastname: document.querySelector(".js_lastname"),
        raza: document.querySelector(".js_raza"),
        phone: document.querySelector(".js_phone"),
        country: document.querySelector(".js_country"),
        photo: document.querySelector(".js_photo"),
      };
  
      const formRegisterEdit = document.querySelector(".js_form");
      const refModalRegisterEdit = document.getElementById("exampleModal");
  
      return {
        form,
        formRegisterEdit,
        refModalRegisterEdit,
      };
    }
  
    getValuesUser() {
      const valuesUser = {
        name: this.getDom().form.name.value,
        lastname: this.getDom().form.lastname.value,
        raza: this.getDom().form.raza.value,
        phone: this.getDom().form.phone.value,
        country: this.getDom().form.country.value,
        photo: this.getDom().form.photo.value,
      };
  
      return valuesUser;
    }
  
    saveUser(values){
        fetch('http://localhost:3000/pets',{
            method: 'POST',
            headers:{
                "Content-type": "application/json charset=UTF-8"
            },
            body: JSON.stringify(values)
        })
    }


    makeCardUser(values) {
      const { name, lastname, raza, phone, country, photo } = values;
      const card = document.createElement("article");
      const idUnique = this.unitId();
      card.classList.add("card");
      card.id = idUnique;
      card.innerHTML = `
          <button type="button" class="js_edit btn-primary icon icon-left"><i class="far fa-edit"></i></button>
          <button type="button" class="js_delete btn-danger icon icon-right"><i class="fas fa-trash-alt"></i></button>
          <div class="replace">
              <figure><img src=${photo}  class="card-img-top"/></figure>
              <div class="card-body">
                  <ul class="list-group">
                      <li class="list-group-item"><label>Nombre completo:</label>${name} ${lastname}</li>
                      <li class="list-group-item"><label>Raza:</label>${raza}</li>
                      <li class="list-group-item"><label>Telefono:</label>${phone}</li>
                      <li class="list-group-item"><label>Pais:</label>${country}</li>
                  </ul>
              </div>
          </div>
      `;
  
      card.querySelector(".js_edit").onclick = () => {
        this.editUser(idUnique);
      };
  
      card.querySelector(".js_delete").onclick = () => {
        this.confirmModalDom.show();
        this.formConfirmDom.onsubmit = (event) => {
          event.preventDefault();
          this.deleteUser(card, idUnique);
          this.confirmModalDom.hide();
          this.toggleAdd();
        };
      };
  
        this.users.push(
        Object.assign({}, values, {
          id: idUnique,
        })
        );
      
  
      this.toggleAdd();
  
      return card;
    }

    editUser(idUser) {
      this.registerEventFormEdit(idUser);
      const valueUser = this.users.filter((user) => user.id == idUser)[0];
  
      for (const elementForm in this.getDom().form) {
        this.getDom().form[elementForm].value = valueUser[elementForm];
      }
  
      this.modalDom.show();
    }
  
    deleteUser(user, id) {
      user.remove();
      this.users = this.users.filter((user) => user.id !== id);
    }
  
    unitId() {
      return Math.floor(Math.random() * 100);
    }
  
    addCardinDom(node) {
      const app = document.getElementById("app");
      app.appendChild(node);
    }
  
    toggleAdd() {
      const btnAdd = document.querySelector(".js_add");
      const btnAddHeader = document.querySelector(".js_add_header");
  
      if (this.users.length > 0) {
        btnAdd.classList.add("d-none");
        btnAddHeader.classList.remove("d-none");
      } else {
        btnAdd.classList.remove("d-none");
        btnAddHeader.classList.add("d-none");
      }
    }
  }
  
  new CreateUser();

  /*

  getUser() -- para el init()
  saveUser() -- Grabar el usuario
        makeCard() -> push()
  deleteUser() -- borrar
  putUser() -- modificar
        editUser() -> invocar al PUT

  TODO CON FETCH
  */