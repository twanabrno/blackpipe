import { Button } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";

const TarqeqForm = ({ pieceValues, handleClose, getPieces, getAllTarqeq }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const initialValues = {
    ...pieceValues,
    thinning_thikness: "",
    thinning_length: "",
    tarqeq_by: localStorage.getItem("username"),
  };
  const validationSchema = Yup.object({
    thinning_thikness: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    thinning_length: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const handleUpdate = (values, onSubmitProps) => {
    const id = values.id;
    Swal.fire({
      title: `${t("on_tarqeq")}`,
      showCancelButton: true,
      confirmButtonText: `${t("tarqeq")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.patch(`/pieces/tarqeq/${id}`, values)
          .then((response) => {
            getPieces();
            getAllTarqeq();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("tarqeqed")}`,
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
            } else {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      }
      onSubmitProps.setSubmitting(false);
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
          <Row className="mb-3 p-3  addUserForm">
            <Form className="w-100 mb-3">
              <Row>
                <Col md={5}>
                  <FormikController
                    control="input"
                    formik={formik}
                    value={formik.values.thinning_thikness}
                    error={formik.errors.thinning_thikness}
                    touched={formik.touched.thinning_thikness}
                    type="number"
                    name="thinning_thikness"
                    label={t("tarqeq_thikness")}
                    step={0.1}
                  />
                </Col>
                <Col md={5}>
                  <FormikController
                    control="input"
                    formik={formik}
                    value={formik.values.thinning_length}
                    error={formik.errors.thinning_length}
                    touched={formik.touched.thinning_length}
                    type="number"
                    name="thinning_length"
                    label={t("tarqeq_length")}
                  />
                </Col>
                <div className="w-100 ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    variant="outline-primary"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t("tarqeq")}
                  </Button>
                </div>
              </Row>
            </Form>
          </Row>
        </>
      )}
    </Formik>
  );
};

export default TarqeqForm;
