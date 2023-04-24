import React from "react";
import {} from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Modal, Col, Row, Button } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { HTTPFILE } from "../../HTTPS";
import { useAuth } from "../auth";
import { useState } from "react";

const UpdateRollForm = ({ initialValues, handleClose, getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = useState([]);
  const validationSchema = Yup.object({
    code: Yup.string(),
    type: Yup.string().required("Required"),
    grossWeight: Yup.number()
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
  const handleUpdate = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(true);
    const id = values.id;
    let data = new FormData();
    data.append("data", JSON.stringify(values));
    data.append("roll_img", selectedFile);
    Swal.fire({
      title: `${t("on_update")}`, 
      showCancelButton: true,
      confirmButtonText: `${t("update")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTPFILE.patch(
          `/rolls/update/${id}?_updatedBy=${localStorage.getItem("username")}`,
          data
        )
          .then((response) => {
            getData();
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${t("updated")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.setSubmitting(false);
            handleClose();
          })
          .catch((error) => {
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
              const message = error.response.data.error.message;
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
              onSubmitProps.setSubmitting(false);
            }
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
        <Form className="w-100 p-md-4">
          <Modal.Body>
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
                      formik.setFieldValue("img", e.currentTarget.files[0]);
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={handleClose} className="mx-2">
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="outline-primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t("update")}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateRollForm;
