const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../dbconnection");

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexSpecialChar = /[^A-Za-z0-9_|\s]/g;

exports.register = async (req, res) => {
  console.log("** start register **");

  try {
    const { email, password, firstName, lastName } = req.body;

    const [rowsEmails] = await db
      .promise()
      .query(`SELECT users.email from users WHERE email = '${email}'`);

    if (rowsEmails && rowsEmails.length > 0) {
      throw new Error("Un compte est déjà associé à cette adresse email.");
    }
    const searchSpecialChar = password.match(regexSpecialChar);
    const testEmail = email.match(regexEmail);
    if (!testEmail) {
      throw new Error("L'email est incorrect.");
    }

    if (!searchSpecialChar || password.length < 8) {
      throw { message: "Need one special character in ur password" };
    }

    let imageUrl = null;

    if (req.file && req.file.filename) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }

    const pwdHash = await bcrypt.hash(password, 10);

    const queryFields = [lastName, firstName, email, pwdHash, imageUrl];

    const queryTxt =
      "INSERT INTO users (last_name, first_name, email, password, image_url) VALUES(?, ?, ?, ?, ?);";

    // insert new user in table users
    await db.promise().query(queryTxt, queryFields);

    console.log("** end register without error **");
    return res.status(200).json({ message: "Votre compte à bien été crée." });
  } catch (error) {
    console.log("** end register with an error **", error.message);
    return res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  console.log("** start login **");
  try {
    const { email, password } = req.body;
    const [rowsUsers] = await db
      .promise()
      .query(
        `SELECT u.id, u.password, u.first_name, u.image_url, u.is_admin FROM users as u WHERE email = '${email}';`
      );

    if (rowsUsers && rowsUsers.length > 0) {
      const user = rowsUsers[0];

      const passwordIsGood = await bcrypt.compare(
        password,
        user.password.toString() // buffer to string
      );

      if (passwordIsGood) {
        console.log("** end login without error **");
        console.log("process.env.SECRET_TOKEN", process.env.SECRET_TOKEN);
        const token = jwt.sign(
          {
            id: user.id,
            imageUrl: user.image_url,
            firstName: user.first_name,
            isAdmin: user.is_admin === 1,
          },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1d",
          }
        );
        console.log({ token });
        return res.status(200).json({
          token,
        });
      } else {
        throw new Error("Le mot de passe est incorrect.");
      }
    } else {
      throw new Error("Vous n'avez pas encore de compte.");
    }
  } catch (error) {
    console.log("** end login with an error **", error.message);
    return res.status(400).send(error.message);
  }
};
