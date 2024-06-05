const { z } = require("zod");

module.exports = {
  phoneNumberValidate: async (phone) => {
    if (phone != undefined || phone != null) {
      try {
        const zod = z.number();
        zod.parse(phone);

        const validateLength = z
          .string()
          .refine((value) => value.length === 10);
        validateLength.parse(String(phone));

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
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  },
};
