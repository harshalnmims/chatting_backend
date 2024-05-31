module.exports = {
  login: (req, res) => {
    console.log("request body json", JSON.stringify(req.body));

    return res.status(200).json({ message: "hello world" });
  },
};
