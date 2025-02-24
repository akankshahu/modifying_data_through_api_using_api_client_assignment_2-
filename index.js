const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const app = express();
const port = 3010;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/menu")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

// Create a new menu item
app.post("/menu-items", async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).send(menuItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all menu items
app.get("/menu-items", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).send(menuItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a menu item by ID
app.put("/menu-items/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!menuItem) {
      return res.status(404).send();
    }
    res.send(menuItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a menu item by ID
app.delete("/menu-items/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).send();
    }
    res.send(menuItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
