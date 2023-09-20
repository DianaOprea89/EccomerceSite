<template>
  <div id="page-wrap">
    <div class="input-elements">
      <label for="name">Name: </label>
      <input type="text" name="name" id="name" placeholder="name" v-model="name">
    </div>
    <div class="input-elements">
      <label for="email">Email: </label>
      <input type="email" name="email" id="email" placeholder="email" v-model="email">
    </div>
    <div class="input-elements">
      <label for="password">Password: </label>
      <input type="password" name="password" id="password" placeholder="password" v-model="password">
    </div>
    <div class="input-elements">
      <label for="confirmPassword">Confirm Password: </label>
      <input type="password" name="password" id="confirmPassword" placeholder="confirm your password" v-model="passwordConfirm">
    </div>
    <div>
      <button @click="register">Register</button>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'; // Import the v4 method to generate a UUID
export default {
  name: "RegisterPage",
  data() {
    return {
      id:"",
      name: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
  },
  methods: {
    async register() {
      try {
        const generatedId = uuidv4();
        const response = await fetch("http://localhost:8004/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: generatedId,
            name: this.name,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to register");
        }


        localStorage.setItem("user", JSON.stringify(data.user));


        this.$router.push({
          name: 'CartPage',
          params: { userId: generatedId }, // Pass the user ID as a parameter
        });



      } catch (error) {
        console.error("Error registering:", error.message);

      }
    },
  }
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


</style>