import { Form, Formik } from "formik";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";
import * as Yup from "yup";
import { Button } from "antd";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";

const ResetPassword = ({ id, handleClose, getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const initialValues = {
    newpassword: "",
  };

  const validationSchema = Yup.object({
    newpassword: Yup.string()
      .min(8, "Too Short!")
      .max(16, "Too Long!")
      .required("Required"),
  });

  const handleReset = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_reset")}`,
      showCancelButton: true,
      confirmButtonText: `${t("reset")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.patch(`/users/resetpassword/${id}`, values)
          .then((response) => {
            getData();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("reseted")}`,
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
      onSubmit={handleReset}
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
                      value={formik.values.newpassword}
                      error={formik.errors.newpassword}
                      touched={formik.touched.newpassword}
                      type="password"
                      name="newpassword"
                      label={t("newpassword")}
                    />
                  </Col>
                  <div className="w-100 ">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      {t("reset")}
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

export default ResetPassword;
