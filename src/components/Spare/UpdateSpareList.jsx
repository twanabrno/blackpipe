import { Button } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";

import * as Yup from "yup";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";

const UpdateSpareList = ({ initialValues, handleClose, getLists }) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
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
        await HTTP.patch(
          `/spare/updatelist/${id}?_updatedBy=${localStorage.getItem("username")}`,
          values
        )
          .then((response) => {
            getLists();
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
          <Row className="mb-3 addUserForm">
            <Form className="w-100 mb-3 py-3 px-3">
              <Row>
                <Col md={4}>
                  <FormikController
                    control="input"
                    formik={formik}
                    value={formik.values.name}
                    error={formik.errors.name}
                    touched={formik.touched.name}
                    type="text"
                    name="name"
                    label={t("name")}
                  />
                </Col>
                <div className="w-100 ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t("update")}
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

export default UpdateSpareList;
