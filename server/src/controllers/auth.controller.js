const { loginUser } = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await loginUser(username, password);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,

        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          username: user.username,
          role_id: user.role_id,
          role: user.role.name,
          device_code: user.device_code,
          profile_photo: user.profile_photo,
          status: user.status,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};