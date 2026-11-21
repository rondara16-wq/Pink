
const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/roblox/lookup", async (req, res) => {
  try {
    const query = String(req.body.query || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Please enter Roblox Username or User ID"
      });
    }

    let user;

    if (/^\d+$/.test(query)) {
      const response = await fetch(
        `https://users.roblox.com/v1/users/${query}`
      );

      if (!response.ok) throw new Error("Account not found");
      user = await response.json();

    } else {
      const response = await fetch(
        "https://users.roblox.com/v1/usernames/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            usernames: [query],
            excludeBannedUsers: false
          })
        }
      );

      if (!response.ok) throw new Error("Roblox API error");

      const data = await response.json();
      user = data.data?.[0];

      if (!user) throw new Error("Account not found");
    }

    res.json({
      success: true,
      userId: user.id,
      username: user.name,
      displayName: user.displayName
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("PinkTopup Roblox API is running!");
});

app.listen(process.env.PORT || 3000);
