const { User, UserRole } = require("../models");
const { comparePassword } = require("../utils/password");

const loginUser = async (username, password) => {
  const user = await User.findOne({
    where: {
      username,
    },
    include: [
      {
        model: UserRole,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active");
  }

  const validPassword = await comparePassword(
    password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("Invalid username or password");
  }

  return user;
};

module.exports = {
  loginUser,
};