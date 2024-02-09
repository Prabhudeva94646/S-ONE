import HomeData from '../Data/HomeData';
import Data from '../Data/Data';
export class HomeAPI {
  async getCategoryData() {
    try {
      const res = {};
      HomeData.forEach(obj => {
        const key = `${obj.Category}`;
        if (!res[key]) {
          res[key] = {Category: obj.Category, count: 0};
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
      Data.filter(function (item) {
        return item.REQUEST_TYPE == `${Category}`;
      }).forEach(obj => {
        const key = `${obj.VERTICAL_NAME}`;
        if (!res[key]) {
          res[key] = {VERTICAL_NAME: obj.VERTICAL_NAME, count: 0};
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
      Data.filter(function (item) {
        return (
          item.REQUEST_TYPE == `${Category}` &&
          item.VERTICAL_NAME == `${VERTICAL_NAME}`
        );
      }).forEach(obj => {
        const key = `${obj.DEPTNAME}`;
        if (!res[key]) {
          res[key] = {DEPTNAME: obj.DEPTNAME, count: 0};
        }
        res[key].count += 1;
      });
      return Object.values(res);
    } catch (error) {
      console.log(error);
    }
  }
}

const homeAPI = new HomeAPI();
export default homeAPI;
