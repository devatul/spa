module.exports = {
  getUserData: function (param) {
    try {
      var user = JSON.parse(localStorage.getItem('nubity-user'));
      return user[param];
    } catch (e) {
      return null;
    }
  },

};
