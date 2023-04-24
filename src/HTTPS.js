import axios from "axios";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";

export const HTTP = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const HTTPFILE = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
  },
});

export const LOGIN = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

HTTP.interceptors.request.use(async (req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  let currentDate = new Date();
  const decodeToken = jwt_decode(localStorage.getItem("token"));
  if (decodeToken.exp * 1000 < currentDate.getTime()) {
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then((response) => {
        localStorage.setItem("token", response.data.accessToken);
        req.headers.Authorization = `Bearer ${response.data.accessToken}`;
      })
      .catch((error) => {
        if (error.response.status == 401 || error.response.status == 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          localStorage.removeItem("line");
          localStorage.removeItem("storeLoged");
          localStorage.removeItem("refreshToken");
          <Navigate to="/login" replace />;
        } else alert("Somthing is wrong, Please try again later");
      });
  }
  return req;
});

HTTPFILE.interceptors.request.use(async (req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

  let currentDate = new Date();
  const decodeToken = jwt_decode(localStorage.getItem("token"));
  if (decodeToken.exp * 1000 < currentDate.getTime()) {
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then((response) => {
        localStorage.setItem("token", response.data.accessToken);
        req.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return req;
      })
      .catch((error) => {
        if (error.response.status == 401 || error.response.status == 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          localStorage.removeItem("line");
          localStorage.removeItem("storeLoged");
          localStorage.removeItem("refreshToken");
          <Navigate to="/login" replace />;
          return req;
        } else alert("Somthing is wrong, Please try again later");
      });
  }
  return req;
});
