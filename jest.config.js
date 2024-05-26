/* eslint-disable no-undef */
module.exports = {
  transformIgnorePatterns: [
    "node_modules/(?!@fullcalendar)"
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
