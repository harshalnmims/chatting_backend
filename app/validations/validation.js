const {z} = require('zod');

module.exports = {

  phoneNumberValidate : async (phone) => {
     try {
        if(phone != undefined || phone != null){
         
         const zod = z.number();
         zod.parse(phone);

         const validateLength = z.string(String(phone)).refine(value => value.length === 10);
         validateLength.parse(phone);

         return true;

        }
     } catch (error) {
        return false;
     }
  }  


}