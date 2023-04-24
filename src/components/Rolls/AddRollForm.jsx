import React, { useState } from "react";
import { Button, DatePicker } from "antd";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Col, Row } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { HTTPFILE } from "../../HTTPS";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const AddRollForm = ({ getData }) => {
  const { t } = useTranslation();
  const role = localStorage.getItem("role");
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = useState([]);
  const initialValues = {
    code: "",
    type: "HR",
    grossWeight: "",
    netWeight: "",
    addedBy: localStorage.getItem("username"),
    rollQuality: "A",
    tLength: "",
    aLength: "",
    width: "",
    thikness: "",
    madeIn: "china",
    addedComment: "",
    createdAt: "",
    img: "",
  };
  const validationSchema = Yup.object({
    code: Yup.string(),
    type: Yup.string().required("Required"),
    grossWeight: Yup.number("Number")
      .positive("Must be a positive Number")
      .required("Required"),
    netWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    width: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    thikness: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    img: Yup.string().required("Required"),
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
  const handleAdd = (values, onSubmitProps) => {
    let data = new FormData();
    data.append("data", JSON.stringify(values));
    data.append("roll_img", selectedFile);
    onSubmitProps.setSubmitting(true);
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_roll")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTPFILE.post(`/rolls/create`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((response) => {
            getData();
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${t("added")}`,
              showConfirmButton: false,
              timer: 3000,
            });
            onSubmitProps.setSubmitting(false);
            onSubmitProps.resetForm();
            setSelectedFile([]);
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
                timer: 3000,
              });
            }
            onSubmitProps.setSubmitting(false);
          });
      } else {
        onSubmitProps.setSubmitting(false);
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
          <h4 className="mb-3">{t("add_roll")}</h4>
          <div className="addRollForm">
            <Row>
              <Col md={6}>
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.code}
                  error={formik.errors.code}
                  touched={formik.touched.code}
                  type="text"
                  name="code"
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
                  step={0.1}
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
                  value={formik.values.netWeight}
                  error={formik.errors.netWeight}
                  touched={formik.touched.netWeight}
                  type="number"
                  name="netWeight"
                  label={t("net_weight")}
                />
                <FormikController
                  control="input"
                  formik={formik}
                  value={formik.values.grossWeight}
                  error={formik.errors.grossWeight}
                  touched={formik.touched.grossWeight}
                  type="number"
                  name="grossWeight"
                  label={t("gross_weight")}
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
                  value={formik.values.addedComment}
                  error={formik.errors.addedComment}
                  touched={formik.touched.addedComment}
                  name="addedComment"
                  label={t("comment")}
                />
                {role == "Admin" || role == "Accountant" ? (
                  <DatePicker
                    placeholder={t("date")}
                    className="my-1 my-md-2 w-100"
                    size={"large"}
                    onChange={(date, dateString) => {
                      formik.setFieldValue("createdAt", dateString);
                    }}
                  />
                ) : (
                  <></>
                )}
                <div className="mb-3 pt-2">
                  <label htmlFor="roll_img" className="form-label">
                    {t("upload_image")}
                  </label>
                  <Field
                    className="form-control"
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={(e) => {
                      setSelectedFile(e.currentTarget.files[0]);
                      formik.setFieldValue("img", e.currentTarget.className);
                    }}
                  />
                  {selectedFile.length == 0 && (
                    <div
                      className="error"
                      style={{
                        color: "red",
                        fontSize: "13px",
                      }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="w-100 d-flex justify-content-end">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {t("add_roll")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddRollForm;
