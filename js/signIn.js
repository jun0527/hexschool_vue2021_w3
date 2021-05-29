const app = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
      user: {
        username: "",
        password: ""
      },
      token: "",
      expired: "",
      constraints: {
        email: {
          presence: {
            message: "必填"
          },
          email: {
            message: "格式錯誤"
          }
        },
        password: {
          presence: {
            message: "必填"
          }
        }
      },
      prompt: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    validate() {
      this.prompt.email = "";
      this.prompt.password = "";
      const signInForm = document.querySelector(".js-signIn");
      let error = validate(signInForm, this.constraints);
      if (error !== undefined) {
        let attribute = Object.keys(error);
        attribute.forEach((key) => {
          let message = error[key][0].split(" ").pop();
          this.prompt[key] = message;
        })
        return;
      }
      this.signIn()
    },
    signIn() {
      axios.post(`${this.url}admin/signin`, this.user)
        .then((res) => {
          if (res.data.success) {
            this.token = res.data.token;
            this.expired = new Date(res.data.expired);
            document.cookie = `signInCookie=${this.token}; expires=${this.expired}`;
            alert("登入成功！");
            window.location = "products.html";
          } else {
            alert("登入失敗，請確認帳號密碼是否正確！");
            this.user.password = "";
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    }
  }
};
Vue.createApp(app).mount("#app");