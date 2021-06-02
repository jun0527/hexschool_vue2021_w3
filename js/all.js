let productModal = {};
let deleteModal = {};
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
      showStatus: {
        addData: true,
        editData: false
      },
      id: {
        editId: "",
        deleteId: ""
      }
    }
  },
  methods: {
    init() {
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
    showModal(modal, status, id, index) {
      console.log(modal);
      this.modalStatus = status;
      if (status === "editData") {
        this.showStatus.addData = false;
        this.showStatus.editData = true;
        this.id.editId = id;
        this.tempData = { ...this.products[index] };
      } else if (status === "editData") {
        this.showStatus.editData = false;
        this.showStatus.addData = true;
      } else {
        this.id.deleteId = id;
      }
      if (modal === "productModal") {
        productModal.show();
      } else {
        deleteModal.show();
      }
    },
    closeModal(modal) {
      if (modal === "productModal") {
        this.clearArrayData("tempData");
        productModal.hide();
      } else {
        deleteModal.hide();
      }

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
            this.closeAddProduct('productModal');
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
            this.closeAddProduct('productModal');
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
            this.closeAddProduct('deleteModal');
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
  mounted() {
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)signInCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.init();
    const productModalArea = document.querySelector(".productModal");
    const deleteModalArea = document.querySelector(".deleteModal");
    productModal = new bootstrap.Modal(productModalArea);
    deleteModal = new bootstrap.Modal(deleteModalArea);
  }
}
Vue.createApp(app).mount("#app");