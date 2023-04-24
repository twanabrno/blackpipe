import { Field, Form, Formik } from "formik";
import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTPFILE } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";

const UpdateForm = ({ initialValues, handleClose, getTambureds }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = React.useState([]);
  const validationSchema = Yup.object({
    realWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const handleUpdate = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(true);
    const id = values.id;
    let data = new FormData();
    data.append("data", JSON.stringify(values));
    data.append("tambur_img", selectedFile);
    Swal.fire({
      title: `${t("on_update")}`,
      showCancelButton: true,
      confirmButtonText: `${t("update")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTPFILE.patch(`/tambur/update/${id}?_updatedBy=${localStorage.getItem('username')}`, data)
          .then((response) => {
            getTambureds();
            Swal.fire({
              position: "top-end",
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
        <Form className="w-100 p-4">
          <Modal.Body>
            <Row>
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
                <FormikController
                  control="textarea"
                  formik={formik}
                  value={formik.values.tamburComment}
                  error={formik.errors.tamburComment}
                  touched={formik.touched.tamburComment}
                  name="tamburComment"
                  label={t("comment")}
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

export default UpdateForm;
