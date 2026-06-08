/**
 * BaseModel - Parent class for all models
 * Implements basic CRUD operations using OOP inheritance
 */
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = require('../config/database');
  }

  // Generate next ID (nested loop + math used here)
  _generateId() {
    const records = this.db.get(this.tableName).value();
    if (records.length === 0) return 1;
    let maxId = 0;
    for (let i = 0; i < records.length; i++) {
      for (let key in records[i]) {
        if (key === 'id' && records[i][key] > maxId) {
          maxId = records[i][key];
        }
      }
    }
    return maxId + 1;
  }

  // Find all records
  findAll(filters = {}) {
    let query = this.db.get(this.tableName);
    const filterKeys = Object.keys(filters);
    if (filterKeys.length > 0) {
      query = query.filter(filters);
    }
    return query.value();
  }

  // Find by ID
  findById(id) {
    return this.db.get(this.tableName).find({ id: parseInt(id) }).value();
  }

  // Find by field
  findBy(field, value) {
    return this.db.get(this.tableName).find({ [field]: value }).value();
  }

  // Create record
  create(data) {
    const newRecord = {
      id: this._generateId(),
      ...data,
      created_at: new Date().toISOString()
    };
    this.db.get(this.tableName).push(newRecord).write();
    return newRecord;
  }

  // Update record
  update(id, data) {
    const record = this.findById(id);
    if (!record) return null;
    const updated = { ...record, ...data, updated_at: new Date().toISOString() };
    this.db.get(this.tableName).find({ id: parseInt(id) }).assign(updated).write();
    return updated;
  }

  // Delete record
  delete(id) {
    const record = this.findById(id);
    if (!record) return false;
    this.db.get(this.tableName).remove({ id: parseInt(id) }).write();
    return true;
  }

  // Count records
  count(filters = {}) {
    return this.findAll(filters).length;
  }
}

module.exports = BaseModel;
