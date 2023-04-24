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

const AddSpare = ({ list, handleClose, getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const initialValues = {
    name: list.name,
    qnt: "",
    comment: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    qnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const handleAdd = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_spare")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(
          `/spare/create?_createdBy=${localStorage.getItem("username")}`,
          values
        )
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
          <Row className="mb-3 addUserForm">
            <Form className="w-100 mb-3 p-3">
              <Row>
                <Col md={4}>
                  <FormikController
                    control="input"
                    formik={formik}
                    disabled
                    value={formik.values.name}
                    error={formik.errors.name}
                    touched={formik.touched.name}
                    type="text"
                    name="name"
                    label={t("name")}
                  />
                </Col>
                <Col md={3}>
                  <FormikController
                    control="input"
                    formik={formik}
                    value={formik.values.qnt}
                    error={formik.errors.qnt}
                    touched={formik.touched.qnt}
                    type="number"
                    name="qnt"
                    label={t("qnt")}
                  />
                </Col>
                <Col md={5}>
                  <FormikController
                    control="textarea"
                    formik={formik}
                    value={formik.values.comment}
                    error={formik.errors.comment}
                    touched={formik.touched.comment}
                    name="comment"
                    label={t("comment")}
                  />
                </Col>
                <div className="w-100 ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t("add_spare")}
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

export default AddSpare;
