import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { Button, Col, Container, Row } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const UpdateUser = ({ initialValues, handleClose, getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
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

  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Required"),
  });
  const handleUpdate = (values, onSubmitProps) => {
    const id = values.id;
    Swal.fire({
      title: `${t("on_update")}`,
      showCancelButton: true,
      confirmButtonText: `${t("update")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.patch(`/users/update/${id}`, values)
          .then((response) => {
            getData();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("updated")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.resetForm();
            onSubmitProps.setSubmitting(false);
            handleClose();
          })
          .catch((error) => {
            const message = error.response.data.error.message;
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Roll not Found",
                showConfirmButton: false,
                timer: 1500,
              });
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
      onSubmit={handleUpdate}
      validateOnMount
    >
      {(formik) => (
        <>
          <Row className="mb-3 addUserForm">
            <Form className="w-100 mb-3">
              <Container className="py-4">
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
                    />
                    <div
                      className={`${
                        formik.values.role == "Admin" ? "d-none" : ""
                      }`}
                    >
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
                    </div>
                  </Col>
                  <div className="w-100 ">
                    <Button
                      type="submit"
                      variant="outline-primary"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      {t("update")}
                    </Button>
                  </div>
                </Row>
              </Container>
            </Form>
          </Row>
        </>
      )}
    </Formik>
  );
};

export default UpdateUser;
