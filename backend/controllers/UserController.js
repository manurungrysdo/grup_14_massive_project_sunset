import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mendapatkan semua pengguna
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Mendapatkan pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Membuat pengguna baru
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Periksa apakah user dengan email sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    // Hash password sebelum menyimpannya
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke dalam database
    await User.create({
      name,
      email,
      password: hashedPassword, // Simpan password yang sudah di-hash
    });

    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Memperbarui pengguna
export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Menghapus pengguna
export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login pengguna
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Periksa apakah email dan password disediakan
    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan password diperlukan" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    // Periksa apakah password cocok (tanpa hashing)
    if (user.password !== password) {
      return res.status(400).json({ msg: "Password salah" });
    }

    // Buat token JWT untuk autentikasi
    const token = jwt.sign({ userId: user.id }, "secretkey", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk registrasi pengguna
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Cek apakah email sudah digunakan
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke dalam database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "Pengguna berhasil terdaftar", user: newUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan saat registrasi pengguna" });
  }
};
