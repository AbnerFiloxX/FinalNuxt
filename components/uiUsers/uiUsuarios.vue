<template>
  <v-form ref="frmRegistro" v-model="frmRegistro">
    <v-app>
      <v-app-bar app color="white" dark>
        <v-toolbar-title class="black--text font-weight-bold"
          >Doctor</v-toolbar-title
        >
        <v-icon class="mr-2 grey--text"> mdi-chevron-right</v-icon>
        <v-toolbar-title class="black--text">{{ pageTitle }}</v-toolbar-title>
        <v-icon class="mr-2 green--text ml-auto"> mdi mdi-bell-badge</v-icon>
        <v-card class="pa-0.8 rounded-xl" color="green">
          <v-avatar size="38">
            <v-img :src="require('/assets/images/Dra.jpg')" alt="Foto"></v-img>
          </v-avatar>
          <span class="mr-7 white--text">Available</span>
        </v-card>
      </v-app-bar>
      <v-btn depressed color="primary" @click="openForm">
        Agregar nuevo paciente
      </v-btn>
      <v-dialog v-model="showFormDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h5"> Nuevo paciente </v-card-title>
          <v-card-text>
            <v-row align="center">
              <label for="">Nombre(s):</label>
              <v-text-field
                class="ml-3"
                type="text"
                v-model="nombre"
                placeholder="Nombre"
                :rules="[reglas.requerido]"
              />
            </v-row>
            <v-row align="center">
              <label for="">A. Paterno:</label>
              <v-text-field
                class="ml-3"
                type="text"
                v-model="apaterno"
                placeholder="Apellido Paterno"
                :rules="[reglas.requerido]"
              />
            </v-row>
            <v-row align="center">
              <label for="">A. Materno:</label>
              <v-text-field
                class="ml-3"
                type="text"
                v-model="amaterno"
                placeholder="Apellido Materno"
              />
            </v-row>
            <v-row align="center">
              <label for="">Correo Electronico:</label>
              <v-text-field
                class="ml-3"
                type="text"
                v-model="email"
                placeholder="Correo Electronico (se toma como usuario)"
                :rules="[reglas.requerido]"
              />
            </v-row>
            <v-row align="center">
              <label for="">Telefono:</label>
              <v-text-field
                class="ml-3"
                type="phone"
                v-model="telefono"
                placeholder="Telefono"
              />
            </v-row>
            <v-row align="center">
              <label for="">Fecha Nacimiento:</label>
              <v-text-field
                class="ml-3"
                v-model="fecha"
                :rules="[reglas.requerido]"
                readonly
                @click="showDatePicker = true"
              ></v-text-field>
              <v-date-picker
                v-model="fecha"
                :rules="[reglas.requerido]"
                v-if="showDatePicker"
                @input="showDatePicker = false"
              ></v-date-picker>
            </v-row>
            <v-row align="center">
              <label for=""> Tratamiento:</label>
              <v-text-field
                class="ml-3"
                type="text"
                v-model="tratamiento"
                placeholder="Escribe tu tratamiento"
              />
            </v-row>

            <v-row align="center" justify="center">
              <v-btn color="green" @click="registraUsuario"> Guardar </v-btn>
              |
              <v-btn color="red darken-1" @click="closeForm">
                Cerrar Formulario
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row>
        <v-data-table :headers="headers" :items="usuarios" elevation="2">
          <template #[`item.Acciones`]="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="red"
                  icon
                  @click="deleteUser(item.email)"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi mdi-delete-circle-outline</v-icon>
                </v-btn>
              </template>
              <span> Borrar al usuario{{ item.nombre }} </span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="blue darken-3"
                  icon
                  @click="editUser(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi mdi-pencil-circle-outline</v-icon>
                </v-btn>
              </template>
              <span> Editar al usuario{{ item.nombre }} </span>
            </v-tooltip>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="text-h5">Borrar Usuarios</v-card-title>
            <v-card-text>¿Estas seguro de lo que quieres borrar?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="borrar">
                Borrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEdit" max-width="600">
          <v-card>
            <v-card-title class="text-h5">Editar Usuario</v-card-title>
            <v-card-text>
              <v-form ref="frmRegistro" v-model="frmRegistro">
                <v-row align="center">
                  <label for="">Nombre(s):</label>
                  <v-text-field
                    class="ml-3"
                    type="text"
                    v-model="editUserData.nombre"
                    placeholder="Nombre"
                    :rules="[reglas.requerido]"
                  />
                </v-row>
                <v-row align="center">
                  <label for="">A. Paterno:</label>
                  <v-text-field
                    class="ml-3"
                    type="text"
                    v-model="editUserData.apaterno"
                    placeholder="Apellido Paterno"
                    :rules="[reglas.requerido]"
                  />
                </v-row>
                <v-row align="center">
                  <label for="">A. Materno:</label>
                  <v-text-field
                    class="ml-3"
                    type="text"
                    v-model="editUserData.amaterno"
                    placeholder="Apellido Materno"
                  />
                </v-row>
                <v-row align="center" style="display: none">
                  <label for="">Correo Electronico:</label>
                  <v-text-field
                    class="ml-3"
                    type="text"
                    v-model="editUserData.email"
                    placeholder="Correo Electronico (se toma como usuario)"
                    :rules="[reglas.requerido]"
                  />
                </v-row>
                <v-row align="center">
                  <label for="">Telefono:</label>
                  <v-text-field
                    class="ml-3"
                    type="phone"
                    v-model="editUserData.telefono"
                    placeholder="Telefono"
                  />
                </v-row>
                <v-row align="center">
                  <label for="">Fecha Nacimiento:</label>
                  <v-text-field
                    class="ml-3"
                    type="text"
                    v-model="editUserData.fechanacimiento"
                    placeholder="Fecha Nacimiento"
                    readonly
                    @click="showDatePickerEdit = true"
                  ></v-text-field>
                  <v-btn @click="showDatePickerEdit = true"
                    >Seleccionar Fecha</v-btn
                  >
                  <v-date-picker
                    v-model="editUserData.fechanacimiento"
                    v-if="showDatePickerEdit"
                    @input="showDatePickerEdit = false"
                  ></v-date-picker>
                </v-row>
                <v-row align="center">
                  <label for="">Tratamiento:</label>
                  <v-text-field
                    class="ml-3"
                    type="tratamiento"
                    v-model="editUserData.tratamiento"
                    placeholder="Tratamiento"
                  />
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogEdit = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="editar">
                Editar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-app>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Nombre", align: "center", sortable: true, value: "nombre" },
        {
          text: "A. Paterno",
          align: "center",
          sortable: true,
          value: "apaterno",
        },
        {
          text: "A. Materno",
          align: "center",
          sortable: true,
          value: "amaterno",
        },
        {
          text: "Telefono",
          align: "center",
          sortable: false,
          value: "telefono",
        },
        { text: "Email", align: "center", sortable: true, value: "email" },
        {
          text: "Fecha Nacimiento",
          align: "center",
          sortable: true,
          value: "fechanacimiento",
        },
        {
          text: "Tratamiento",
          align: "center",
          sortable: true,
          value: "tratamiento",
        },
        {
          text: "Acciones",
          align: "center",
          sortable: false,
          value: "Acciones",
        },
      ],
      usuarios: [],
      dialog: false,
      fecha: null,
      showDatePicker: false,
      showDatePickerEdit: false,
      email: null,
      editUserData: {},
      dialogEdit: false,
      reglas: {
        requerido: (value) => !!value || "Campo Requerido!!!",
        cantidad: (value) => value.length > 8 || "Minimo 9 Caractéres",
      },
      frmRegistro: false,
      showFormDialog: false, // Nueva propiedad para controlar la apertura/cierre del formulario
      nombre: "",
      apaterno: "",
      amaterno: "",
      telefono: "",
      email: "",
      fecha: "",
      tratamiento: "",
    };
  },
  computed: {
    newUser() {
      return this.$store.state.newUser;
    },
    pageTitle() {
      const currentRoute = this.$route.path;

      switch (currentRoute) {
        case "/dashboard":
          return "Dashboard";
        case "/appointment":
          return "Appointment";
        case "/patients":
          return "Patients";
        case "/schedule":
          return "Schedule";
        default:
          return "Unknown";
      }
    },
  },
  watch: {
    newUser() {
      if (this.newUser) {
        this.usuarios = [];
        this.loadUsers();
        this.$store.commit("setNewUser", false);
      }
    },
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      const usuarios = await fetch("http://localhost:5000/get-pacientes");
      const data = await usuarios.json();
      if (data.alert === "success") {
        this.usuarios = data.usuarios;
      }
      console.log("@@@ usuarios => ", usuarios, data);
    },
    deleteUser(email) {
      console.log("@@@ delete user");
      this.email = email;
      this.dialog = true;
    },
    async borrar() {
      const sendData = {
        email: this.email,
      };
      const rawResponse = await fetch("http://localhost:5000/delete-paciente", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const res = await rawResponse.json();
      if (res.alert === "success") {
        this.loadUsers();
      }
      this.dialog = false;
    },
    editUser(user) {
      console.log("@@@ user =>", user);
      this.editUserData.nombre = user.nombre;
      this.editUserData.apaterno = user.apaterno;
      this.editUserData.amaterno = user.amaterno;
      this.editUserData.telefono = user.telefono;
      this.editUserData.email = user.email;
      this.editUserData.fechanacimiento = user.fechanacimiento;
      this.editUserData.tratamiento = user.tratamiento;
      this.showDatePickerEdit = false;
      this.dialogEdit = true;
    },
    async editar() {
      const valid = this.$refs.frmRegistro.validate();
      if (valid) {
        console.log("@@@ editUserData =>", this.editUserData);
        const rawResponse = await fetch("http://localhost:5000/edit-paciente", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.editUserData),
        });
        const res = await rawResponse.json();
        this.loadUsers();
        this.dialogEdit = false;
        console.log("@@@ res =>", res);
      }
    },
    async registraUsuario() {
      this.frmRegistro = this.$refs.frmRegistro.validate();
      if (this.frmRegistro) {
        // Registro el Usuario
        const sendData = {
          nombre: this.nombre,
          apaterno: this.apaterno,
          amaterno: this.amaterno,
          email: this.email,
          telefono: this.telefono,
          fechanacimiento: this.fecha,
          tratamiento: this.tratamiento,
        };
        const rawResponse = await fetch("http://localhost:5000/new-paciente", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        });
        const content = await rawResponse.json();
        if (content.alert === "success") {
          this.nombre = "";
          this.apaterno = "";
          this.amaterno = "";
          this.telefono = "";
          this.email = "";
          this.fecha = "";
          this.tratamiento = "";
          this.$store.commit("setNewUser", true);
        } else if (content.alert === "El usuario ya existe") {
          alert('Usuario ya existe');
        }
        console.log("@@@ response =>", content);
      } else {
        alert('Error')
      }
      // Cierra la ventana del formulario
      this.showFormDialog = false;

      // Actualiza los datos de la tabla
      this.loadUsers();
    },
    openForm() {
      this.showFormDialog = true;
    },
    closeForm() {
      this.showFormDialog = false;
      this.showDatePicker = false;
      this.$refs.frmRegistro.resetValidation();
    },
  },
};
</script>