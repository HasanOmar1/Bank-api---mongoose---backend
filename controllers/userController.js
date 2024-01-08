import STATUS_CODE from "../constants/statusCodes.js";
import User from "../models/UsersModel.js";

// Creates new user
// Create:  /api/v1/bank
export const addClient = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(STATUS_CODE.CREATED).send(user);
  } catch (error) {
    next(error);
  }
};

// Gets all users info
// Get:  /api/v1/bank
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No users in the database");
    }
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// Gets user's info by id
// Get:  /api/v1/bank/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: id });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

//  sort
// Get:  /api/v1/bank/sort-low

export const sortByLowCash = async (req, res, next) => {
  try {
    const users = await User.find().sort({ cash: 1 });
    res.send(users);
  } catch (error) {
    next(error);
  }
};

//  sort
// Get:  /api/v1/bank/sort-high
export const sortByHighCash = async (req, res, next) => {
  try {
    const users = await User.find().sort({ cash: -1 });
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// extra
// deletes user
// Delete:  /api/v1/bank/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findOneAndDelete({ id: id });
    if (!userToDelete) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }
    res.send(userToDelete);
  } catch (error) {
    next(error);
  }
};

// extra
// updates user's fields
// PUT:  /api/v1/bank/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findOneAndUpdate({ id: id }, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// updates user's credit
// PUT:  /api/v1/bank/update-credit/:id ?credit= [value]
export const updateCredit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (+req.query.credit < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Failed to add credit , only positive credits allowed!");
    }

    const user = await User.findOneAndUpdate(
      { id: id },
      { $set: { credit: +req.query.credit } },
      { new: true }
    );

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// deposits cash to the user
// PUT:  /api/v1/bank/deposit-cash/:id ?cash= [value]
export const depositCash = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: id });

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }

    if (+req.query.cash < 0) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("Cant deposit negative cash!");
    }

    if (user.isActive) {
      const updatedUser = await User.findOneAndUpdate(
        { id: id },
        { $set: { cash: user.cash + +req.query.cash } },
        { new: true }
      );
      res.send(updatedUser);
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Cannot deposit cash to inActive users!");
    }
  } catch (error) {
    next(error);
  }
};

export const withdrawMoney = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: id });

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }

    if (+req.query.money < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Cant withdraw negative money");
    }

    if (+req.query.money > user.cash + user.credit) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You don't have that amount of money to withdraw.");
    }

    if (user.isActive) {
      if (user.cash > +req.query.money) {
        const updatedUser = await User.findOneAndUpdate(
          { id: id },
          { $set: { cash: user.cash - +req.query.money } },
          { new: true }
        );
        res.send(updatedUser);
      }

      if (+req.query.money > user.cash) {
        const updatedUser = await User.findOneAndUpdate(
          { id: id },
          {
            $set: {
              cash: 0,
              credit: user.credit - (+req.query.money - user.cash),
            },
          },
          { new: true }
        );
        res.send(updatedUser);
      }
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Cannot withdraw money from inActive account!");
    }
  } catch (error) {
    next(error);
  }
};

// @des      Transfers money from one user to another [money goes to credit]
// @route    PUT /api/v1/bank/transfer/from/:senderId/to/:recipientId?money=[value]
export const transferMoney = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    const { recipientId } = req.params;

    const sender = await User.findOne({ id: senderId });
    const recipient = await User.findOne({ id: recipientId });

    if (!sender || !recipient) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("The sender or the recipient does not exist.");
    }

    if (+req.query.money < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Cant transfer negative money");
    }

    if (senderId === recipientId) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("You Cannot send money to yourself!");
    }

    if (sender.isActive && recipient.isActive) {
      if (+req.query.money > sender.cash + sender.credit) {
        res.status(STATUS_CODE.BAD_REQUEST);
        throw new Error("You don't have that amount of money to transfer.");
      }

      if (sender.cash > +req.query.money) {
        const updatedSender = await User.findOneAndUpdate(
          { id: senderId },
          {
            $set: { cash: sender.cash - +req.query.money },
          },
          { new: true }
        );

        const updatedRecipient = await User.findOneAndUpdate(
          { id: recipientId },
          {
            $set: { credit: recipient.credit + +req.query.money },
          },
          { new: true }
        );

        const senderAndRecipient = [updatedSender, updatedRecipient];
        res.send(senderAndRecipient);
      }

      if (+req.query.money > sender.cash) {
        const updatedSender = await User.findOneAndUpdate(
          { id: senderId },
          {
            $set: {
              cash: 0,
              credit: sender.credit - (+req.query.money - sender.cash),
            },
          },
          { new: true }
        );

        const updatedRecipient = await User.findOneAndUpdate(
          { id: recipientId },
          {
            $set: { credit: recipient.credit + +req.query.money },
          },
          { new: true }
        );

        const senderAndRecipient = [updatedSender, updatedRecipient];
        res.send(senderAndRecipient);
      }
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "Error transferring money , The sender or the recipient account is inActive."
      );
    }
  } catch (error) {
    next(error);
  }
};

// Gets users who has less/equal cash than certain value
// Get:  /api/v1/bank/filter-cash/less?cash=[value]
export const filterByCashLessThan = async (req, res, next) => {
  try {
    const users = await User.find({ cash: { $lte: +req.query.cash } });
    if (users.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No users found");
    }
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// Gets users who has less/equal cash than certain value
// Get:  /api/v1/bank/filter-cash/more?cash=[value]
export const filterByCashMoreThan = async (req, res, next) => {
  try {
    const users = await User.find({ cash: { $gte: +req.query.cash } });
    if (users.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No users found");
    }
    res.send(users);
  } catch (error) {
    next(error);
  }
};
