db.createUser(
  {
    user: "yoda",
    pwd: "theforce",
    roles: [
      {
        role: "readWrite",
        db: "minecraftapp"
      }
    ]
  }
)
