const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminUserRoutes = require("./routes/adminUser.routes");
const courseCategoryRoutes = require("./routes/courseCategory.routes");
const courseRoutes = require("./routes/course.routes");
const testRoutes = require("./routes/test.routes");
const courseBatchRoutes = require("./routes/courseBatch.routes");
const courseInstructorRoutes = require("./routes/courseInstructor.routes");
const courseStudentRoutes = require("./routes/courseStudent.routes");
const courseModuleRoutes = require("./routes/courseModule.routes");
const lectureRoutes = require("./routes/lecture.routes");
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NSI IT LMS API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use(
  "/api/admin/course-categories",
  courseCategoryRoutes
);

app.use("/api/admin/courses", courseRoutes);

app.use("/api/test", testRoutes);
app.use("/api/admin", courseBatchRoutes);
app.use("/api/admin", courseInstructorRoutes);
app.use("/api/admin", courseStudentRoutes);
app.use("/api", courseModuleRoutes);
app.use("/api", lectureRoutes);
module.exports = app;