import URLS from "../utils/endpoint-urls";

const loginAPI = async (data) => {
  const url = `${URLS.BASE_URL}${URLS.LOGIN_URL}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  console.log("responseData", responseData);

  return responseData;
};

const signUpAPI = async (data) => {
  const url = `${URLS.BASE_URL}${URLS.SIGN_UP_URL}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return responseData;
};

const logOutAPI = async (data) => {
  const url = `${URLS.BASE_URL}${URLS.LOGOUT_URL}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Logout api response:", response);

  return response;
}

export { loginAPI, signUpAPI, logOutAPI };
