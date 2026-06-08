const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

/**
 * UserModel - Extends BaseModel with user-specific logic
 */
class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // Override create to hash password
  create(data) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    data.role = data.role || 'user';
    return super.create(data);
  }

  // Validate credentials
  authenticate(username, password) {
    const user = this.findBy('username', username);
    if (!user) return null;
    const valid = bcrypt.compareSync(password, user.password);
    return valid ? user : null;
  }

  // Update without exposing password logic
  updateProfile(id, data) {
    if (data.password && data.password.trim() !== '') {
      data.password = bcrypt.hashSync(data.password, 10);
    } else {
      delete data.password;
    }
    return this.update(id, data);
  }

  // Get safe user (no password)
  getSafe(id) {
    const user = this.findById(id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  }

  // Get all users without passwords
  getAllSafe() {
    return this.findAll().map(({ password, ...safe }) => safe);
  }
}

module.exports = new UserModel();
