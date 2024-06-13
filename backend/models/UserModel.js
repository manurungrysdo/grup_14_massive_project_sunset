import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import bcrypt from "bcryptjs";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default User;

(async () => {
  await db.sync();
})();
