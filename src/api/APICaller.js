import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import LottieView from 'lottie-react-native';
import NoInternetAnimation from '../components/loading/animation2.json';

const TOKEN =
  "uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ";

const playNoInternetAnimation = () => {
  return new Promise((resolve, reject) => {
    let animationCompleted = false;

    const onAnimationComplete = () => {
      animationCompleted = true;
      resolve();
    };

    const animation = (
      <LottieView
        source={NoInternetAnimation}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
        onAnimationFinish={onAnimationComplete}
      />
    );

    // Display the animation
    // You can render this component wherever you need to display the animation

    // Wait until animation completes
    const checkAnimationCompletion = () => {
      if (animationCompleted) {
        // Animation completed, resolve the promise
        resolve();
      } else {
        // Animation not completed yet, check again after a short delay
        setTimeout(checkAnimationCompletion, 100);
      }
    };

    // Check animation completion
    checkAnimationCompletion();
  });
};

export class APICaller {
  async AuthenticateUser(UserName = 13115, Password = 1) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/AuthenticateUser?UserName=${UserName}&Password=${Password}&Token=${TOKEN}`,
        {
          method: "GET",
        }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during authentication:", error);
      await playNoInternetAnimation();
      throw new Error("Authentication failed");
    }
  }

  async HomeData() {
    try {
      const EmpCode = await AsyncStorage.getItem("employeeCode");
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetPendingApprovalsCount?EmpCode=${EmpCode}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }

  async ListData(Category) {
    try {
      const EmpCode = await AsyncStorage.getItem("employeeCode");
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetPendingApprovalsList?EmpCode=${EmpCode}&ApprovalCategory=${Category}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }

  async TableData(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetDocumentDetails?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }

  async approvalHistory(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetApprovalHistory?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      const data = await res.json();

      // Check if data has been received
      if (data && data.Data) {
        // Filter out entries with empty date and time
        const filteredData = data.Data.filter(
          (item) => item.ApproverActionDate.trim() !== "" && item.ApproverDecisionStatus.trim() !== "PENDING"
        );

        // Custom sorting function
        filteredData.sort((a, b) => {
          // Parse dates
          const dateA = moment(a.ApproverActionDate, "DD-MM-YYYY HH:mm:ss");
          const dateB = moment(b.ApproverActionDate, "DD-MM-YYYY HH:mm:ss");

          // Compare dates
          if (dateA.isBefore(dateB)) return -1;
          if (dateB.isBefore(dateA)) return 1;
          return 0;
        });

        // Convert time format to AM/PM
        filteredData.forEach((item) => {
          item.ApproverActionDate = moment(
            item.ApproverActionDate,
            "DD-MM-YYYY HH:mm:ss"
          ).format("DD-MM-YYYY hh:mm A"); // AM/PM format
        });

        // Update the data with sorted and filtered array
        data.Data = filteredData;
      }

      return data;
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }

  async returnToList(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetReturnToList?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during history fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching History!!");
    }
  }

  async postRemark({ data }) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/PostApproverDecision?ApprovalMapID=${data.ApprovalMapID}&Decision=${data.Decision}&Remarks=${data.Remarks}&ReturnToEmpcode=${data.ReturnToEmpcode}&Token=${TOKEN}`,
        { method: "POST" }
      );
      return res.json();
    } catch (error) {
      console.error("Error Uploading Data:", error);
      await playNoInternetAnimation();
      throw new Error("Error While Data Uploading!!");
    }
  }

  async GetAttachedFiles(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetAttachedFiles?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error while fetching attached files");
    }
  }


  async GetImage() {
    try {
      const EmpCode = await AsyncStorage.getItem("employeeCode");
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetUserProfilePic?EmpCode=${EmpCode}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }
}

const apiCaller = new APICaller();
export default apiCaller;
