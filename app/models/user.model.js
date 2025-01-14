module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      },
      { timestamps: true }
    );
  
    const User = mongoose.model("user", schema);
    return User;
  };
  