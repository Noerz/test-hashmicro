const BaseModel = require('./BaseModel');

/**
 * CharCheckerModel - Extends BaseModel for character checking feature
 * Core algorithm: nested loops + nested if + mathematics
 */
class CharCheckerModel extends BaseModel {
  constructor() {
    super('char_checker_logs');
  }

  /**
   * Main character check algorithm
   * Uses: nested loop, nested if, mathematics
   * @param {string} input1
   * @param {string} input2
   * @param {string} type - 'sensitive' or 'insensitive'
   */
  check(input1, input2, type) {
    const isSensitive = type === 'sensitive';

    // Get unique characters from input1
    const uniqueChars = this._getUniqueChars(input1);
    const totalUnique = uniqueChars.length;

    const matchedChars = [];
    const unmatchedChars = [];
    const charDetails = [];

    // Nested loop: iterate each char in input1, check against input2
    for (let i = 0; i < uniqueChars.length; i++) {
      const char = uniqueChars[i];
      let found = false;

      // Inner loop: check all chars in input2
      for (let j = 0; j < input2.length; j++) {
        let charToCheck = char;
        let input2Char = input2[j];

        // Nested if: sensitive vs insensitive
        if (!isSensitive) {
          charToCheck = char.toLowerCase();
          input2Char = input2Char.toLowerCase();
        }

        if (charToCheck === input2Char) {
          found = true;
          break;
        }
      }

      // Record detail per character
      charDetails.push({
        char: char,
        found: found,
        type: isSensitive ? 'case-sensitive' : 'case-insensitive'
      });

      if (found) {
        matchedChars.push(char);
      } else {
        unmatchedChars.push(char);
      }
    }

    // Mathematics: calculate percentage
    const matchCount = matchedChars.length;
    const percentage = totalUnique > 0
      ? Math.round((matchCount / totalUnique) * 100 * 100) / 100  // 2 decimal precision
      : 0;

    const result = {
      input1,
      input2,
      type: isSensitive ? 'Case Sensitive' : 'Case Insensitive',
      unique_chars_input1: uniqueChars,
      total_unique: totalUnique,
      matched_chars: matchedChars,
      unmatched_chars: unmatchedChars,
      match_count: matchCount,
      percentage,
      percentage_display: `${matchCount} / ${totalUnique} = ${percentage}%`,
      char_details: charDetails
    };

    // Save log to DB
    this.create({
      input1,
      input2,
      type: isSensitive ? 'sensitive' : 'insensitive',
      percentage,
      match_count: matchCount,
      total_unique: totalUnique
    });

    return result;
  }

  /**
   * Get unique characters from string (preserving order of first occurrence)
   * Uses nested if to handle space/special char distinction
   */
  _getUniqueChars(str) {
    const seen = [];
    const unique = [];

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      // Nested if: skip spaces, track unique
      if (char !== ' ') {
        if (!seen.includes(char)) {
          seen.push(char);
          unique.push(char);
        }
      }
    }
    return unique;
  }

  // Get recent logs
  getRecentLogs(limit = 10) {
    const logs = this.findAll();
    return logs.slice(-limit).reverse();
  }
}

module.exports = new CharCheckerModel();
