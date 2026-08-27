const app = require("./app");
const sequelize = require("./config/database");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "MySQL database connected successfully."
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Unable to connect to MySQL:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

startServer();