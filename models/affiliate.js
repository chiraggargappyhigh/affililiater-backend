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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    promotion_link: { type: String },
    promotion_code: { type: String },
    app: {
      id: {
        type: String,
      },
      name: { type: String },
      description: { type: String },
      logo: { type: String },
    },
    earnings: Number,
    referrals: Number,
    sales: Number,
    config: {
      coupon_discount: Number,
      comission: {
        type: Map,
        of: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const affiliate = mongoose.model("affiliate", schema);
module.exports = affiliate;
