exports.dateToString = (date) => {
   if (!(date instanceof Date) || isNaN(date)) {
     return null; // or handle the error as appropriate
   }
   return date.toISOString();
 };