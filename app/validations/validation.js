const { z } = require("zod");

module.exports = {
  phoneNumberValidate: async (phone) => {
    if (phone != undefined || phone != null) {
      try {
        const zod = z.number();
        zod.parse(phone);

        const validateLength = z
          .string(String(phone))
          .refine((value) => value.length === 10);
        validateLength.parse(phone);

        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  },

  numberValidate: (num) => {
    if (num != undefined && num != null) {
      try {
        const zod = z.number();
        zod.parse(num);
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  },
};
