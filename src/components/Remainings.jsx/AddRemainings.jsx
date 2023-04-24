import React from "react";
import { Button } from "antd";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import FormikController from "../Forms/FormikController";
import { HTTP } from "../../HTTPS";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const AddRemainings = ({ getRemainings }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const initialValues = {
    autoCode: "",
    type: "HR",
    rollQuality: "A",
    madeIn: "china",
    slittedBy: localStorage.getItem("username"),
    weight: "",
    width: "",
    aLength: "",
    tLength: "",
    thikness: "",
    daySeries: "",
    pieceSeries: "",
    slittedComment: "",
    pieceComment: "",
  };
  const validationSchema = Yup.object({
    autoCode: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    weight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    width: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    length: Yup.number().positive("Must be a positive Number"),
    daySeries: Yup.number().positive("Must be a positive Number"),
    pieceSeries: Yup.number().positive("Must be a positive Number"),
    thikness: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const types = [
    { key: "hr", value: "HR" },
    { key: "gi", value: "GI" },
    { key: "gr", value: "CR" },
  ];
  const rollQ = [
    { key: "A", value: "A" },
    { key: "B", value: "B" },
  ];
  const countries = [
    { key: "cn", value: "china" },
    { key: "ir", value: "iran" },
    { key: "tr", value: "turkey" },
    { key: "ru", value: "russia" },
    { key: "ua", value: "ukraine" },
    { key: "eu", value: "europe" },
    { key: "jo", value: "jordan" },
  ];
  const handleAdd = async (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(false);
      if (result.isConfirmed) {
        await HTTP.post(`/remainings/create`, values)
          .then((response) => {
            getRemainings();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("added")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.setSubmitting(false);
            onSubmitProps.resetForm();
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
        <Form className="w-100 mb-5">
          <h4 className="mb-3">{t("add_remaining")}</h4>
          <div className="addRollForm">
            <Row>
              <Col md={6}>
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.autoCode}
                  error={formik.errors.autoCode}
                  touched={formik.touched.autoCode}
                  type="text"
                  name="autoCode"
                  label={t("code")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.thikness}
                  error={formik.errors.thikness}
                  touched={formik.touched.thikness}
                  type="number"
                  name="thikness"
                  label={t("thikness")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.width}
                  error={formik.errors.width}
                  touched={formik.touched.width}
                  type="number"
                  name="width"
                  label={t("width")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.weight}
                  error={formik.errors.weight}
                  touched={formik.touched.weight}
                  type="number"
                  name="weight"
                  label={t("weight")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.tLength}
                  error={formik.errors.tLength}
                  touched={formik.touched.tLength}
                  type="number"
                  name="tLength"
                  label={t("tLength")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.aLength}
                  error={formik.errors.aLength}
                  touched={formik.touched.aLength}
                  type="number"
                  name="aLength"
                  label={t("aLength")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.daySeries}
                  error={formik.errors.daySeries}
                  touched={formik.touched.daySeries}
                  type="number"
                  name="daySeries"
                  label={t("day_series")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.pieceSeries}
                  error={formik.errors.pieceSeries}
                  touched={formik.touched.pieceSeries}
                  type="number"
                  name="pieceSeries"
                  label={t("piece_series")}
                />
              </Col>
              <Col md={6}>
                <FormikController
                  control="select"
                  formik={formik}
                  value={formik.values.type}
                  error={formik.errors.type}
                  touched={formik.touched.type}
                  options={types}
                  name="type"
                  label={t("type")}
                />
                <FormikController
                  control="select"
                  formik={formik}
                  value={formik.values.rollQuality}
                  error={formik.errors.rollQuality}
                  touched={formik.touched.rollQuality}
                  options={rollQ}
                  name="rollQuality"
                  label={t("rollQuality")}
                />
                <FormikController
                  control="select"
                  formik={formik}
                  value={formik.values.madeIn}
                  error={formik.errors.madeIn}
                  touched={formik.touched.madeIn}
                  options={countries}
                  name="madeIn"
                  label={t("madein")}
                />
                <FormikController
                  control="textarea"
                  formik={formik}
                  value={formik.values.pieceComment}
                  error={formik.errors.pieceComment}
                  touched={formik.touched.pieceComment}
                  name="pieceComment"
                  label={t("comment")}
                />
              </Col>
            </Row>

            <div className="w-100 d-flex justify-content-end">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {t("add_remaining")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddRemainings;
