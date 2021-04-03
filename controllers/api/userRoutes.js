const router = require('express').Router();
const { User } = require('../../models');
// const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      role_id: +req.body.role,
    })
    console.log(newUser);
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.email = newUser.email;
      req.session.loggedIn = true;
    });
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

router.post('/login', async (req, res) => {
  console.log("POST started");
  console.log(req.body);
  try {
    const userDB = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    console.log(`user_email: ${!userDB}`);
    if (!userDB) {
      res.status(400).json({ message: "1. Email or password is incorrect" })
      return;
    };

    const validPassword = await userDB.checkPassword(req.body.password);
    // console.log(`password: ${validPassword}`);
    console.log(!validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "2. Email or password is incorrect" })
      return;
    };

    req.session.save(() => {
      req.session.user_id = userDB.id;
      req.session.email = userDB.email;
      req.session.loggedIn = true;

      res.status(200).json({ user: userDB, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


//Post, Comment
// router.get('/', (req, res) => {
//   User.findAll({
//     attributes: { exclude: ['[password'] },
//   })
//     .then((dbUserData) => res.json(dbUserData))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.get('/:id', (req, res) => {
//   User.findOne({
//     attributes: { exclude: ['password'] },
//     where: {
//       id: req.params.id,
//     },
//     include: [
//       {
//         model: Post,
//         attributes: ['id', 'title', 'content', 'created_at'],
//       },

//       {
//         model: Comment,
//         attributes: ['id', 'comment_text', 'created_at'],
//         include: {
//           model: Post,
//           attributes: ['title'],
//         },
//       },
//       {
//         model: Post,
//         attributes: ['title'],
//       },
//     ],
//   })
//     .then((dbUserData) => {
//       if (!dbUserData) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });




// router.put('/:id', (req, res) => {
//   User.update(req.body, {
//     individualHooks: true,
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((dbUserData) => {
//       if (!dbUserData[0]) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.delete('/:id', (req, res) => {
//   User.destroy({
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((dbUserData) => {
//       if (!dbUserData) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

module.exports = router;
