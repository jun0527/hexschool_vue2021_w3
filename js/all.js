const app = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
      products: [],
      isImgHidden: false,
      constraints: {
        title: {
          presence: {
            message: "必填！"
          }
        },
        category: {
          presence: {
            message: "必填！"
          }
        },
        imageUrl: {
          presence: {
            message: "必填！"
          },
          url: {
            message: "圖片網址錯誤！"
          }
        },
        description: {
          presence: {
            message: "必填！"
          }
        },
        origin_price: {
          presence: {
            message: "必填！"
          },
          numericality: {
            greaterThan: 0
          }
        },
        price: {
          presence: {
            message: "必填！"
          },
          numericality: {
            greaterThan: 0
          }
        },
        unit: {
          presence: {
            message: "必填！"
          }
        }
      },
      prompt: {
        title: "",
        category: "",
        imageUrl: "",
        description: "",
        origin_price: "",
        price: "",
        unit: "",
      },
      tempData: {
        title: "",
        category: "",
        imageUrl: "",
        description: "",
        origin_price: "",
        price: "",
        unit: "",
        is_enabled: ""
      },
      modalStatus: "",
      btnHidden: {
        addBtn: "false",
        editBtn: "false"
      },
      editId: ""
    }
  },
  methods: {
    init() {
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)signInCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      axios.get(`${this.url}api/${this.path}/admin/products`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    //互動視窗
    showAddProduct(status, id, index) {
      this.modalStatus = status;
      if (status === "editData") {
        this.btnHidden.addBtn = true;
        this.btnHidden.editBtn = false;
        this.editId = id;
        this.tempData = { ...this.products[index] };
      } else {
        this.btnHidden.addBtn = false;
        this.btnHidden.editBtn = true;
      }
      myModal.show();
    },
    closeAddProduct() {
      this.clearArrayData("tempData");
      myModal.hide();
    },
    addDataValidate(status, id) {
      const addProductFrom = document.querySelector(".addProduct");
      this.clearArrayData("prompt");
      let err = validate(addProductFrom, this.constraints);
      if (this.tempData.origin_price < this.tempData.price) {
        this.prompt.price = "售價不可小於原價！"
        return;
      }
      if (err === undefined) {
        if (status === "addData") {
          this.addProduct();
        } else {
          this.editProductData(id);
        }
        return;
      } else {
        let attribute = Object.keys(err);
        attribute.forEach((key) => {
          let message = err[key][0].split(" ").pop();
          this.prompt[key] = message;
        })
      }
    },
    addProduct() {
      if (this.tempData.is_enabled) {
        this.tempData.is_enabled = 1;
      } else {
        this.tempData.is_enabled = 0;
      }
      let obj = {
        data: { ...this.tempData }
      }
      console.log(obj);
      axios.post(`${this.url}api/${this.path}/admin/product`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("商品建立成功！");
            this.closeAddProduct();
            this.init();
          } else {
            console.log(res.data);
            alert("商品建立失敗！");
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    editProductData(id) {
      console.log("editData", id);
      let obj = {
        data: { ...this.tempData }
      }
      console.log(obj);
      axios.put(`${this.url}api/${this.path}/admin/product/${id}`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("修改商品資料成功！");
            this.closeAddProduct();
            this.init();
          } else {
            alert("修改商品資料失敗！");
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    clearArrayData(arrayName) {
      this[arrayName].title = "";
      this[arrayName].category = "";
      this[arrayName].imageUrl = "";
      this[arrayName].description = "";
      this[arrayName].origin_price = "";
      this[arrayName].price = "";
      this[arrayName].unit = "";
      if (arrayName === "tempData") {
        this.tempData.is_enabled = "";
      }
    },
    changeEnabled(id, index) {
      let obj = {
        data: { ...this.products[index] }
      };
      if (obj.data.is_enabled === 0) {
        obj.data.is_enabled = 1;
        this.isChecked = "checked";
      } else {
        obj.data.is_enabled = 0;
        this.isChecked = "disabled";
      }
      axios.put(`${this.url}api/${this.path}/admin/product/${id}`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("已更改商品啟用狀態！");
            this.init();
          } else {
            alert("更改商品啟用狀態失敗！");
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    deleteProduct(id) {
      axios.delete(`${this.url}api/${this.path}/admin/product/${id}`)
        .then((res) => {
          if (res.data.success) {
            alert("產品刪除成功！");
            this.init();
          } else {
            alert("產品刪除失敗！");
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
  },
  created() {
    this.init();
  },
  mounted() {
    const modal = document.querySelector(".productModal");
    myModal = new bootstrap.Modal(modal);
  }
}
Vue.createApp(app).mount("#app");