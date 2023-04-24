import { Button } from "antd";
import { Formik, Form } from "formik";
import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FormikController from "../Forms/FormikController";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const SellRemainings = ({ selectedRows, handleClose, getRemainings }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const initialValues = {
    ids: selectedRows,
    sellTo: "",
    sellComment: "",
    sellBy: localStorage.getItem("username"),
  };
  const validationSchema = Yup.object({
    sellTo: Yup.string().required("Required"),
  });
  const handleSell = async (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_send")}`,
      showCancelButton: true,
      confirmButtonText: `${t("send")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(`/remainings/sell`, values)
          .then((response) => {
            getRemainings();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("sent")}`,
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
      onSubmit={handleSell}
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
                  value={formik.values.sellTo}
                  error={formik.errors.sellTo}
                  touched={formik.touched.sellTo}
                  type="text"
                  name="sellTo"
                  label={t("sell_to")}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormikController
                  control="textarea"
                  formik={formik}
                  value={formik.values.sellComment}
                  error={formik.errors.sellComment}
                  touched={formik.touched.sellComment}
                  name="sellComment"
                  label={t("comment")}
                />
              </Col>
            </Row>
          </Modal.Body>
          <div className="w-100 d-flex justify-content-end">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t("sell")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SellRemainings;
