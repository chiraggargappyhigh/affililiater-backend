const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let idValidator = require("mongoose-id-validator");
const bcrypt = require("bcrypt");
const {
  TYPE_USER,
  PROFESSION,
  LOGIN_PLATFORM,
  LOGIN_TYPE,
} = require("../constants/auth");

const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    app: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    promotion_code: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    salesCurrency: { type: String, required: true },
    saleAmount: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    earningDate: { type: Date, default: Date.now },
    comission: {
      inCurrency: Number,
      inUSD: Number,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.pre("insertMany", async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const pay = mongoose.model("pay", schema);
module.exports = pay;
