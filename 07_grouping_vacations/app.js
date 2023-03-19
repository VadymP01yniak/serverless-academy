const originalData = require('./data.json');

const transformedData = [];

originalData.forEach(data => {
      const { _id: userId, name: userName } = data.user;
      const { startDate, endDate } = data;

      const user = transformedData.find(user => user.userId === userId);

      if (user) {
            user.vacations.push({ startDate, endDate });
      } else {
            transformedData.push({
                  userId,
                  userName,
                  vacations: [{ startDate, endDate }]
            });
      }
});

console.log(JSON.stringify(transformedData, null, 2));