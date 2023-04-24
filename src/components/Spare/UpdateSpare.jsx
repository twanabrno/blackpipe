import { Autocomplete, TextField } from "@mui/material";
import { Button } from "antd";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";
import TextError from "../Forms/TextError";

const UpdateSpare = ({ initialValues, handleClose, getData, lists }) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    qnt: Yup.number()
      .positive("Must be a positive Number")
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
        await HTTP.patch(
          `/spare/update/${id}?_updatedBy=${localStorage.getItem("username")}`,
          values
        )
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
            <Form className="w-100 mb-3 py-3">
              <Row>
                <Col md={4}>
                  <Autocomplete
                    style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                    size="small"
                    id="combo-box-demo"
                    name="selectedList"
                    label={t("spares")}
                    options={lists.map((l) => l.name)}
                    defaultValue={initialValues.name}
                    onBlur={() => formik.setFieldTouched("", true)}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        formik.setFieldValue("name", newValue);
                      } else {
                        formik.setFieldValue("name", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<em>{t("spares")}</em>} />
                    )}
                  />
                  <ErrorMessage name={"name"} component={TextError} />
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

export default UpdateSpare;
