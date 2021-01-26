class CreateUser {
  modalDom = new bootstrap.Modal(document.getElementById("exampleModal"));
  confirmModalDom = new bootstrap.Modal(
    document.getElementById("confirmModal")
  );
  formConfirmDom = document.querySelector(".js_form_confirm");
  btnsRegister = document.querySelectorAll(".js_register_event_register");

  constructor() {
    this.init();
  }

  init() {
    this.getUsers();
    this.registerEventFormRegister();
    this.registerButtonsRegister();
    this.getDom().refModalRegisterEdit.addEventListener(
      "hidden.bs.modal",
      () => {
        this.getDom().formRegisterEdit.reset();
      }
    );
  }

  getUsers() {
    fetch('http://localhost:3000/mascotas')
    .then((response) => response.json())
    .then(mascotas => { this.makeCardUser(mascotas) })
  }

  registerEventFormRegister() {
    const form = this.getDom().formRegisterEdit; // atrapo formulario
    form.onsubmit = (event) => {
      event.preventDefault();
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

  registerEventFormEdit(element) {
    const form = this.getDom().formRegisterEdit;

    form.onsubmit = (event) => {
      event.preventDefault();
      this.editUserpet(this.getValuesUserEdit(), element.id);
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


  getValuesUserEdit() {
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

  makeCardUser(mascotas) {

    mascotas.forEach(element => {
      const { name, lastname, raza, phone, country, photo,id } = element;
      const card = document.createElement("article");
      card.classList.add("card");
      card.innerHTML = `
          <button type="button" class="js_edit btn-primary icon icon-left"><i class="far fa-edit"></i></button>
          <button type="button" class="js_delete btn-danger icon icon-right"><i class="fas fa-trash-alt"></i></button>
          <div id="${id}" class="replace">
              <figure><img src=${photo}/></figure>
              <div class="card-body">
                  <ul class="list-group">
                      <li class="list-group-item"><label>Nombre completo : </label> ${name} ${lastname}</li>
                      <li class="list-group-item"><label>Raza : </label> ${raza}</li>
                      <li class="list-group-item"><label>Telefono : </label> ${phone}</li>
                      <li class="list-group-item"><label>Pais : </label> ${country}</li>
                  </ul>
              </div>
          </div>
      `;
  
      card.querySelector(".js_edit").onclick = () => {
        this.editUser(element);
      };
  
      card.querySelector(".js_delete").onclick = () => {
        this.confirmModalDom.show();
        this.formConfirmDom.onsubmit = (event) => {
          event.preventDefault();
          this.deleteUser(element.id);
          this.confirmModalDom.hide();
          this.toggleAdd(mascotas);
        };
      };
      
      this.toggleAdd(mascotas);

      this.addCardinDom(card); 
      return card;

    });
  }

  saveUser(values){
    fetch('http://localhost:3000/mascotas',
      {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
      .then((response) => response.json());
  }

  editUserpet(values, id){
    console.log(values.name);
    fetch(`http://localhost:3000/mascotas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          name: values.name,
      lastname: values.lastname,
          raza: values.raza,
         phone: values.phone,
       country: values.country,
        photo: values.photo,
            id: id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  }
  
  editUser(element) {
    this.registerEventFormEdit(element);
    const valueUser = element;

    for (const elementForm in this.getDom().form) {
      this.getDom().form[elementForm].value = valueUser[elementForm];
    }

    this.modalDom.show();
  }

  deleteUser(id) {
    fetch(`http://localhost:3000/mascotas/${id}`,
        {
            method: 'DELETE'
        })
        .then((response) => response.json())
  }

  addCardinDom(card) {
    const app = document.getElementById("app");
    app.appendChild(card);
  }

  toggleAdd(mascotas) {
    const btnAdd = document.querySelector(".js_add");
    const btnAddHeader = document.querySelector(".js_add_header");

    if (mascotas.length > 0) {
      btnAdd.classList.add("d-none");
      btnAddHeader.classList.remove("d-none");
    } else {
      btnAdd.classList.remove("d-none");
      btnAddHeader.classList.add("d-none");
    }
  }
}

new CreateUser();