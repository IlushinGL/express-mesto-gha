const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Некорректный email адрес',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: () => 'Некорректный URL',
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  const errCredentials = new Error('Почта или пароль указаны не верно');
  // errCredentials.statusCode = 401;
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        // пользователь не найден — отклоняем промис с ошибкой
        return Promise.reject(errCredentials);
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис с ошибкой
            return Promise.reject(errCredentials);
          }
          // аутентификация успешна теперь user доступен
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
