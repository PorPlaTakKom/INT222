class Validate {
  getGeneralValidate(text) {
    const textCheck = /^(?!\s*$).+/;

    if (text.match(" ") || "") {
      return false;
    } else if (text.match(textCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateShopName(shopName) {
    const shopNameCheck = /^[a-zA-Z0-9]{1,35}$/;

    if (shopName.match(" ") || "") {
      return false;
    } else if (shopName.match(shopNameCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateNationalID(nationalID) {
    const nationalIDCheck = /^\d{13}$/;

    if (nationalID.match(" ") || "") {
      return false;
    } else if (nationalID.match(nationalIDCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateBrandName(brandName) {
    const brandCheck = /^[a-zA-Z]{1,35}$/;

    if (brandName.match(" ") || "") {
      return false;
    } else if (brandName.match(brandCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateProductName(productName) {
    const productCheck = /^[a-zA-Z0-9._-]{1,35}$/;

    if (productName.match(" ") || "") {
      return false;
    } else if (productName.match(productCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateColor(color) {
    const colorCheck = /^[a-zA-Z-]{1,35}$/;

    if (color.match(" ") || "") {
      return false;
    } else if (color.match(colorCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidatePrice(price) {
    const priceCheck = /^([0-9]{0,7})+(\.[0-9]{1,4})?$/;

    if (price.match(" ") || "") {
      return false;
    } else if (price.match(priceCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateQuantity(quantity) {
    const quantityCheck = /^((?!(0))[0-9]{1,7})$/;

    if (quantity.match(" ") || "") {
      return false;
    } else if (quantity.match(quantityCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateWarranty(warranty) {
    const warrantyCheck = /^((?!(0))[0-9]{1,7})$/;

    if (warranty.match(" ") || "") {
      return false;
    } else if (warranty.match(warrantyCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateUsername(username) {
    const userCheck = /^[a-zA-Z0-9._-]{3,15}$/;
    if (username.match(" ") || "") {
      return false;
    } else if (username.match(userCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateFirstName(firstname) {
    const firsNameCheck = /^[a-zA-Z]{1,35}$/;
    if (firstname.match(" ") || "") {
      return false;
    } else if (firstname.match(firsNameCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateLastName(lastname) {
    const lastNameCheck = /^[a-zA-Z]{1,35}$/;
    if (lastname.match(" ") || "") {
      return false;
    } else if (lastname.match(lastNameCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidatePhoneNumber(phonenumber) {
    const phonenumberCheck = /^([06,08,09]{2})\d{8}$/;
    if (phonenumber.match(" ") || "") {
      return false;
    } else if (phonenumber.match(phonenumberCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidatePassword(password) {
    const pwdCheck =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,128}$/;
    if (password.match(" ") || "") {
      return false;
    } else if (password.match(pwdCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateConfirmPassword(password, confirmpass) {
    if (password === confirmpass) {
      return true;
    } else {
      return false;
    }
  }

  getValidateEmail(email) {
    const emailCheck = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (email.match(" ") || "") {
      return false;
    } else if (email.match(emailCheck)) {
      return true;
    } else {
      return false;
    }
  }

  getValidateInput(input) {
    const inputCheck = /^[a-zA-Z0-9#?!@$ %^&*._-]{1,128}$/;
    if (input.match(" ") || "") {
      return false;
    } else if (input.match(inputCheck)) {
      return true;
    } else {
      return false;
    }
  }
}

export default new Validate();
