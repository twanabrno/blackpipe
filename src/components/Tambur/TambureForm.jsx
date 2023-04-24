import { Button, DatePicker } from "antd";
import { Form, Formik, Field } from "formik";
import React from "react";
import * as Yup from "yup";
import { Col, Modal, Row } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { HTTPFILE } from "../../HTTPS";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const TambureForm = ({
  pieceValues,
  handleClose,
  getPieces,
  getTambureds,
  getDeletedTambureds,
}) => {
  const { t } = useTranslation();
  const role = localStorage.getItem("role");
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = React.useState([]);
  const initialValues = {
    ...pieceValues,
    realWeight: "",
    line: localStorage.getItem("line") || "101A",
    tamburedBy: localStorage.getItem("username"),
    tamburedComment: "",
    img: "",
    createdAt: "",
  };
  const validationSchema = Yup.object({
    realWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    img: Yup.string().required("Required"),
  });
  const lines = [
    { key: "101A", value: "101A" },
    { key: "76B", value: "76B" },
    { key: "76C", value: "76C" },
    { key: "51D", value: "51D" },
  ];
  const handleSubmit = (values, onSubmitProps) => {
    let data = new FormData();
    data.append("data", JSON.stringify(values));
    data.append("tambur_img", selectedFile);
    onSubmitProps.setSubmitting(true);
    Swal.fire({
      title: `${t("on_tambur")}`,
      showCancelButton: true,
      confirmButtonText: `${t("tambur")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTPFILE.post(`/tambur/create`, data)
          .then((response) => {
            getPieces();
            getTambureds();
            getDeletedTambureds();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("tambured")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.setSubmitting(false);
            handleClose();
          })
          .catch((error) => {
            console.log(error);
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
    <Modal.Body>
      <Row className="px-2">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {(formik) => (
            <>
              <Row className="px-2">
                <Col md={6}>
                  {pieceValues.slittedBy && (
                    <>
                      <span className=" lh-base">{t("slitted_by")}: </span>
                      <span className="fw-bold">{pieceValues.slittedBy}</span>
                      <br />
                    </>
                  )}
                  <span className=" lh-base">{t("weight")}: </span>
                  <span className="fw-bold">{pieceValues.weight}</span>
                  <br />
                  <div className="mt-3">
                    <FormikController
                      className={`${
                        localStorage.getItem("role") == "Tambur" ? "d-none" : ""
                      }`}
                      control="select"
                      formik={formik}
                      value={formik.values.line}
                      error={formik.errors.line}
                      touched={formik.touched.line}
                      options={lines}
                      name="line"
                      label={t("line")}
                    />
                  </div>
                </Col>
                <Col>
                  <Col md={6}></Col>
                  {pieceValues.autoCode && (
                    <>
                      <span className=" lh-base">{t("code")}: </span>
                      <span className="fw-bold">{pieceValues.autoCode}</span>
                      <br />
                    </>
                  )}
                  <span className=" lh-base">{t("thikness")}: </span>
                  <span className="fw-bold">{pieceValues.thikness}</span>
                  <br />
                </Col>
              </Row>
              <Form className="p-2">
                <Row className="">
                  <Col md={6}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.realWeight}
                      error={formik.errors.realWeight}
                      touched={formik.touched.realWeight}
                      type="number"
                      name="realWeight"
                      label={t("actual_weight")}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="mb-3 pt-2">
                      <label htmlFor="tambure_img" className="form-label">
                        {t("upload_image")}
                      </label>
                      <Field
                        id="tambure_img"
                        className="form-control"
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) => {
                          setSelectedFile(e.currentTarget.files[0]);
                          formik.setFieldValue(
                            "img",
                            e.currentTarget.className
                          );
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
                <Row className="mb-3">
                  <Col md={6}>
                    {role == "Admin" || role == "Accountant" ? (
                      <DatePicker
                        placeholder={t("date")}
                        size="large"
                        className="w-100"
                        onChange={(date, dateString) => {
                          formik.setFieldValue("createdAt", dateString);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormikController
                      control="textarea"
                      formik={formik}
                      value={formik.values.tamburedComment}
                      error={formik.errors.tamburedComment}
                      touched={formik.touched.tamburedComment}
                      name="tamburedComment"
                      label={t("comment")}
                    />
                  </Col>
                </Row>
                <Button
                  className="mt-2"
                  type="primary"
                  size="large"
                  htmlType="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {t("tambur")}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </Row>
    </Modal.Body>
  );
};

export default TambureForm;
