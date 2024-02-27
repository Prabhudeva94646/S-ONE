import HomeData from '../Data/HomeData';
import Data from '../Data/Data';
export class HomeAPI {
  async HomeData() {
    try {
      const res = {};
      HomeData.forEach(obj => {
        const key = `${obj.Category}`;
        if (!res[key]) {
          res[key] = {Category: obj.Category, count: 0, };
        }
        res[key].count += 1;
      });
      return Object.values(res);
    } catch (error) {
      console.log(error);
    }
  }

  async getBoxListData({Category}) {
    try {
      const res = {};
      HomeData.filter(function (item) {
        return item.Category == `${Category}`;
      }).forEach(obj => {
        const key = `${obj.Type}` && `${obj.Vertical_Type}`;
        if (!res[key]) {
          res[key] = {VERTICAL_NAME: `${obj.Type} : ${obj.Vertical_Type}`, count: 0};
        }
        res[key].count += 1;
      });
      return Object.values(res);
    } catch (error) {
      console.log(error);
    }
  }

  async getBoxList2Data({Category, VERTICAL_NAME}) {
    try {
      const res = {};
      HomeData.filter(function (item) {
        return (
          item.Category == `${Category}` &&
          `${item.Type} : ${item.Vertical_Type}` == `${VERTICAL_NAME}`
        );
      }).forEach(obj => {
        const key = `${obj.Department_Name}`;
        if (!res[key]) {
          res[key] = {DEPTNAME: obj.Department_Name, count: 0};
        }
        res[key].count += 1;
      });
      return Object.values(res);
    } catch (error) {
      console.log(error);
    }
  }

  async ListData({Category}) {
    try {
      const res = {};
      HomeData.filter(function (item) {
        return item.Category == `${Category}`;
      }).forEach(obj => {
        const key = `${obj.Department_Name}`;
        if (!res[key]) {
          res[key] = {Department_Name: obj.Department_Name, count: 0};
        }
        res[key].count += 1;
      });
      return Object.values(res);
    } catch (error) {
      console.log(error);
    }
  }

  async ApprovalData({Category, Department_Name}) {
    try {
      let data = HomeData.filter(function (item) {
        return (
          item.Category == `${Category}` &&
          item.Department_Name == `${Department_Name}`
        );
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

const homeAPI = new HomeAPI();
export default homeAPI;
