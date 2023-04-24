import { Button } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";
import { Col, Collapse, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AiOutlineUserAdd, AiOutlineMinusCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";

const AddUser = ({ getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const roles = [
    { key: "accountant", value: "Accountant" },
    { key: "watcher", value: "Watcher" },
    { key: "enter", value: "Enter" },
    { key: "slit", value: "Sliter" },
    { key: "tambur", value: "Tambur" },
    { key: "store", value: "Store" },
    { key: "qandelBlabas", value: "QandelBlbas" },
  ];
  const initialValues = {
    username: "",
    phone: "",
    role: "",
    password: "",
  };
  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Required"),
    password: Yup.string()
      .min(8, "Too Short!")
      .max(16, "Too Long!")
      .required("Required"),
  });

  const handleAdd = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(`/users/create`, values)
          .then((response) => {
            getData();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("added")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.resetForm();
            onSubmitProps.setSubmitting(false);
            setShowUserForm(false);
          })
          .catch((error) => {
            const message = error.response.data.error.message;
            if (error.response.status == 401) {
              auth.logout();
            } else {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
            }
            onSubmitProps.setSubmitting(false);
          });
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleAdd}
      validateOnMount
    >
      {(formik) => (
        <>
          <Row className="mb-3">
            <Col className="d-flex justify-content-end px-md-5 px-3">
              <div
                className="adduserbtn"
                onClick={() => {
                  formik.resetForm();
                  setShowUserForm(!showUserForm);
                }}
              >
                <span className="mb-3 add_span">{t("add_user")} </span>{" "}
                {showUserForm ? <AiOutlineMinusCircle /> : <AiOutlineUserAdd />}
              </div>
            </Col>
          </Row>
          <Collapse in={showUserForm}>
            <Row className="mb-3 addUserForm">
              <Form className="w-100 mb-3">
                <Row>
                  <Col md={6}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.username}
                      error={formik.errors.username}
                      touched={formik.touched.username}
                      type="text"
                      name="username"
                      label={t("username")}
                      id="01"
                    />
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.phone}
                      error={formik.errors.phone}
                      touched={formik.touched.phone}
                      type="text"
                      name="phone"
                      label={t("phone")}
                      id="03"
                    />
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.password}
                      error={formik.errors.password}
                      touched={formik.touched.password}
                      type="password"
                      name="password"
                      label={t("password")}
                      id="04"
                    />
                    <FormikController
                      control="select"
                      formik={formik}
                      value={formik.values.role}
                      error={formik.errors.role}
                      touched={formik.touched.role}
                      options={roles}
                      name="role"
                      label={t("role")}
                    />
                  </Col>
                  <div className="w-100 ">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      {t("add")}
                    </Button>
                  </div>
                </Row>
              </Form>
            </Row>
          </Collapse>
        </>
      )}
    </Formik>
  );
};

export default AddUser;
