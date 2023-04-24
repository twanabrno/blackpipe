import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "./Forms/FormikController";
import { useAuth } from "./auth";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/imgs/logo.png";
import "../assets/Login.css";
import { useTranslation } from "react-i18next";
import { LOGIN } from "../HTTPS";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Login = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const logedin = Cookies.get("username");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.path?.state || "/";

  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const initialValues = {
    username: "",
    password: "",
  };
  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });
  const login = async (values, onSubmitProps) => {
    setLoading(true);
    await LOGIN.post(`/auth/login`, values)
      .then((response) => {
        setUnauthorized(false);
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        if (response.data.role == "Tambur") {
          localStorage.setItem("storeLoged", true);
          navigate("/productions", { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setUnauthorized(true);
        } else {
          const message = error.response.data.error.message;
          Swal.fire({
            position: "top-end",
            icon: "info",
            title: message,
            showConfirmButton: false,
            timer: 3000,
          });
        }
        auth.logout();
        setLoading(false);
        onSubmitProps.setSubmitting(false);
      });
  };

  useEffect(() => {
    if (logedin) {
      window.location.reload(false);
      navigate("/", { replace: true });
    }
  });
  return (
    <div className="login-body">
      <div className="login-form">
        <div className="text-center mb-3">
          <img src={logo} className="img-fluid" alt="" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={login}
          validateOnMount
        >
          {(formik) => (
            <Form className="w-100">
              {unauthorized && (
                <p className="text-danger">Username or password is not valid</p>
              )}

              <FormikController
                formik={formik}
                value={formik.values.username}
                error={formik.errors.username}
                touched={formik.touched.username}
                control="input"
                type="text"
                name="username"
                label={t("username")}
              />
              <FormikController
                formik={formik}
                value={formik.values.password}
                error={formik.errors.password}
                touched={formik.touched.password}
                control="input"
                type="password"
                name="password"
                label={t("password")}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!formik.isValid || formik.isSubmitting || loading}
              >
                {t("login")}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default Login;
