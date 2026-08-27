const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const { User, UserRole } = require("./models");

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // ==========================================
    // GET ROLES
    // ==========================================

    const instructorRole = await UserRole.findOne({
      where: { name: "INSTRUCTOR" },
    });

    const studentRole = await UserRole.findOne({
      where: { name: "STUDENT" },
    });

    if (!instructorRole) {
      throw new Error("INSTRUCTOR role does not exist.");
    }

    if (!studentRole) {
      throw new Error("STUDENT role does not exist.");
    }

    // ==========================================
    // GET EXISTING ADMIN
    // ==========================================

    const admin = await User.findOne({
      where: {
        username: "admin",
      },
    });

    if (!admin) {
      throw new Error(
        "Admin user does not exist. Please create the admin first."
      );
    }

    console.log("Admin user found.");

    // ==========================================
    // 1. SEED INSTRUCTOR
    // ==========================================

    let instructor = await User.findOne({
      where: {
        email: "instructor@nsiit.com",
      },
    });

    if (instructor) {
      console.log("Instructor user already exists.");
    } else {
      const passwordHash = await bcrypt.hash(
        "Instructor@123",
        10
      );

      instructor = await User.create({
        first_name: "NSI",
        last_name: "Instructor",
        email: "instructor@nsiit.com",
        username: "instructor",
        password_hash: passwordHash,
        role_id: instructorRole.id,
        status: "ACTIVE",
        created_by: admin.id,
        updated_by: admin.id,
      });

      console.log("Instructor created successfully.");
    }

    // ==========================================
    // 2. SEED STUDENT
    // ==========================================

    let student = await User.findOne({
      where: {
        email: "student@nsiit.com",
      },
    });

    if (student) {
      console.log("Student user already exists.");
    } else {
      const passwordHash = await bcrypt.hash(
        "Student@123",
        10
      );

      student = await User.create({
        first_name: "NSI",
        last_name: "Student",
        email: "student@nsiit.com",
        username: "student",
        password_hash: passwordHash,
        role_id: studentRole.id,
        status: "ACTIVE",
        created_by: admin.id,
        updated_by: admin.id,
      });

      console.log("Student created successfully.");
    }

    // ==========================================
    // LOGIN DETAILS
    // ==========================================

    console.log("\n================================");
    console.log("   NSI IT LMS TEST ACCOUNTS");
    console.log("================================");

    console.log("\nINSTRUCTOR");
    console.log("Username: instructor");
    console.log("Password: Instructor@123");

    console.log("\nSTUDENT");
    console.log("Username: student");
    console.log("Password: Student@123");

    console.log("\n================================");
    console.log("Seeding completed successfully.");
    console.log("================================\n");

  } catch (error) {
    console.error("\nSeeding failed:");
    console.error(error);
  } finally {
    await sequelize.close();
  }
};

seedUsers();