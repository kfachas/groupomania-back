const bcrypt = require("bcrypt");
const db = require("../dbconnection");

exports.getProfil = async (req, res) => {
  console.log("** start get profil **");
  try {
    const userId = req.params.id;

    const queryFields = [userId];

    const queryTxt = "SELECT * FROM users WHERE users.id = ?";

    const [rowsUsers] = await db.promise().query(queryTxt, queryFields);
    if (rowsUsers && rowsUsers.length > 0) {
      const user = rowsUsers[0];
      if (user.id === req.auth.userId) {
        const dataToSend = {
          firstName: user.first_name,
          lastName: user.last_name,
          filePreview: user.image_url,
          email: user.email,
        };

        console.log("** end get profil without error **");
        return res.status(200).send(dataToSend);
      }
    }
  } catch (error) {
    console.log("** end get profil with an error **", error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateProfil = async (req, res) => {
  console.log("** start update profil **");
  try {
    const userId = req.params.id;
    let { firstName, lastName, confirmPassword } = req.body;

    const queryFields = [userId];

    const queryTxt = "SELECT * FROM users WHERE users.id = ?";

    const [rowsUsers] = await db.promise().query(queryTxt, queryFields);

    if (rowsUsers && rowsUsers.length > 0) {
      const user = rowsUsers[0];
      if (user.id === req.auth.userId) {
        const passwordIsGood = await bcrypt.compare(
          confirmPassword,
          user.password.toString() // buffer to string
        );

        console.log(confirmPassword);
        if (!passwordIsGood) {
          return res
            .status(400)
            .send({ message: "Le mot de passe est incorrect." });
        }
        if (!firstName) {
          firstName = user.first_name;
        }
        if (!lastName) {
          lastName = user.last_name;
        }

        let imageUrl = user.image_url;
        if (req.file && req.file.filename) {
          imageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        }

        const queryFields = [firstName, lastName, imageUrl, user.id];

        const queryTxt =
          "UPDATE users SET first_name = ?, last_name = ?, image_url = ? WHERE users.id = ?;";

        await db.promise().query(queryTxt, queryFields);

        console.log("** end update profil without error **");
        return res.status(200).send(true);
      }
    }
    return res.status(400).send(false);
  } catch (error) {
    console.log("** end update profil with an error **", error.message);
    return res.status(400).send(error.message);
  }
};

exports.deleteProfil = async (req, res) => {};
