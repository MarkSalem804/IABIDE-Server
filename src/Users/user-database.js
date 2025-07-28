const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function findUserByEmail(email) {
  try {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    }
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
}

async function createUser(data) {
  try {
    // Validate required fields
    if (!data.username || !data.password || !data.email || !data.contactNo) {
      throw new Error(
        "Missing required fields: username, password, email, and contactNo are required"
      );
    }

    // Check if user already exists with the same email or username
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
          { contactNo: data.contactNo },
        ],
      },
    });

    if (existingUser) {
      throw new Error(
        "User already exists with the same email, username, or contact number"
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Prepare user data
    const userData = {
      username: data.username,
      password: hashedPassword,
      email: data.email,
      contactNo: data.contactNo,
      role: data.role || "user",
      firstName: data.firstName || null,
      middleName: data.middleName || null,
      lastName: data.lastName || null,
      position: data.position || null,
      status: data.status !== undefined ? data.status : true,
      isPasswordChanged: data.isPasswordChanged || false,
      twoFactorEnabled: data.twoFactorEnabled || false,
    };

    // Create the user
    const newUser = await prisma.users.create({
      data: userData,
    });

    // Return user data without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

module.exports = {
  findUserByEmail,
  createUser,
};
