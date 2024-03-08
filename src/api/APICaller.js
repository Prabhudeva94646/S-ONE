import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN =
  'uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ';
export class APICaller {
  async AuthenticateUser(UserName = 13115, Password = 1) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/AuthenticateUser?UserName=${UserName}&Password=${Password}&Token=${TOKEN}`,
        {
          method: 'GET',
        },
      );
      return res.json();
    } catch (error) {
      console.error('Error occurred during authentication:', error);
      throw new Error('Authentication failed');
    }
  }

  async HomeData() {
    try {
      const EmpCode = await AsyncStorage.getItem('employeeCode');
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/GetPendingApprovalsCount?EmpCode=${EmpCode}&Token=${TOKEN}`,
        {method: 'GET'},
      );
      return res.json();
    } catch (error) {
      console.error('Error occurred during data fetching:', error);
      throw new Error('Error While fetching Data!!');
    }
  }

  async ListData(Category) {
    try {
      const EmpCode = await AsyncStorage.getItem('employeeCode');
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/GetPendingApprovalsList?EmpCode=${EmpCode}&ApprovalCategory=${Category}&Token=${TOKEN}`,
        {method: 'GET'},
      );
      return res.json();
    } catch (error) {
      console.error('Error occurred during data fetching:', error);
      throw new Error('Error While fetching Data!!');
    }
  }

  async TableData(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/GetDocumentDetails?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        {method: 'GET'},
      );
      return res.json();
    } catch (error) {
      console.error('Error occurred during data fetching:', error);
      throw new Error('Error While fetching Data!!');
    }
  }
  async approvalHistory(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/GetApprovalHistory?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        {method: 'GET'},
      );
      return res.json();
    } catch (error) {
      console.error('Error occurred during data fetching:', error);
      throw new Error('Error While fetching Data!!');
    }
  }
}

const apiCaller = new APICaller();
export default apiCaller;
