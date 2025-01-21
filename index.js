const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const port = 8000;

app.use(express.urlencoded({extended:false}));

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const name = `<ul>
    ${users
      .map((user) => `<li>${user.first_name + " " + user.last_name}</li>`)
      .join("")} </ul>`;
  return res.send(name);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log(body);
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save user data" });
    }
    return res.json({ status: "success", id: users.length });
  });
});


app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
  
    users[userIndex] = { ...users[userIndex], ...req.body };
  
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user data" });
      }
      return res.json({ status: "success", user: users[userIndex] });
    });
  });
  
//    delete user by id

app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
  
    const deletedUser = users.splice(userIndex, 1)[0];
  
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete user data" });
      }
      return res.json({ status: "success", user: deletedUser });
    });
  });

app.listen(port, () => console.log(`server is running on port ${port}`));
