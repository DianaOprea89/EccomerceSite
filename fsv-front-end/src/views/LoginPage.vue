<template>
  <div id="page-wrap">
    <div>
      <h3 class="centered-content">Existing client? </h3>
    </div>
    <div class="input-elements">
      <label for ="email" >Email:  </label>
      <input v-model="email" type="email" name="email" id="email" placeholder="email">
    </div>
   <div class="input-elements">
     <label for ="password" >Password:  </label>
     <input v-model="password"  type="password" name="password" id="password" placeholder="password">
   </div>
    <div class="centered-content">
      <button @click="login"> Login </button>
    </div>
    <div class="password-recovery">
      <p>Forgot your password?</p>
    </div>

    <h1 class="centered-content">Not registerd?</h1>
    <div class="centered-content">
      <button class="register-btn" @click="goToRegister"> Register now! </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        console.log("Trying to login with", { email: this.email, password: this.password });

        const response = await fetch("http://localhost:8006/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        console.log("Got response", response);

        if (response.ok) {
          const data = await response.json();

          console.log("Login data received", data);



          data.user.password = this.password

          this.$store.commit("setUser", data.user);
          this.$router.push("/products/");
        } else {
          console.error("Failed to login");
        }
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },

    goToRegister() {
      this.$router.push('/register');
    }
  },
};
</script>



<style scoped>
#page-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: auto;
  margin-top: 50px;
  max-width: 500px;
  min-height: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
}

.input-elements {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 20px;
  width: 100%;
}

.input-elements label {
  width: 100px;
}

.input-elements input {
  flex: 1;
  margin-left: 10px;
  background-color: #e9e9e9;
  border: 1px solid #ccc;
  padding: 5px;
}


button {
  margin-top: 20px;
}

p {
  font-size: 12px;
  color: #a5a5a5;
  text-align: left;
  margin-top: 20px;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

.password-recovery p {
  font-size: 12px;
  color: #a5a5a5;
  text-align: left;
  margin-top: 20px;
}
h1 {
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin: 10px 0;
}

h1:before, h1:after{
  content: "";
  flex: 1 1;
  border-bottom: 1px solid;
  margin: auto;
}
h1:before {
  margin-right: 10px
}
h1:after {
  margin-left: 10px
}
.register-btn {
  margin-top: 20px;
  padding: 6px 12px;
  border: none;
  background-color: #a5a5a5;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-btn:hover {
  background-color: #7d7d7d;
}
.centered-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>





