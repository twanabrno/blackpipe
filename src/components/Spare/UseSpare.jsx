import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import { Button } from "antd";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";

const UseSpare = ({ handleClose, getData, getUsedData, spare }) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const initialValues = {
    usedName: spare.name,
    usedBy: localStorage.getItem("username"),
    gaveTo: "",
    usedQnt: "",
    comment: "",
  };
  const validationSchema = Yup.object({
    usedName: Yup.string().required("Required"),
    gaveTo: Yup.string().required("Required"),
    usedQnt: Yup.number()
      .positive("Must be a positive Number")
      .max(spare.qnt)
      .required("Required"),
  });
  const handleUse = (values, onSubmitProps) => {
    var data = values;
    var id = spare.id;
    Swal.fire({
      title: `${t("on_use")}`,
      showCancelButton: true,
      confirmButtonText: `${t("use")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(`/spare/use/${id}`, data)
          .then((response) => {
            handleClose();
            getUsedData();
            getData();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("used")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.resetForm();
            onSubmitProps.setSubmitting(false);
          })
          .catch((error) => {
            if (error.response.status == 401) {
              auth.logout();
            } else {
              const message = error.response.data.error.message;
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
      onSubmit={handleUse}
      validateOnMount
    >
      {(formik) => (
        <Form className="px-3 py-3 pb-5">
          <Row>
            <Col md={6}>
              <FormikController
                control="input"
                formik={formik}
                value={formik.values.usedName}
                error={formik.errors.usedName}
                touched={formik.touched.usedName}
                disabled
                type="text"
                name="usedName"
                label={t("name")}
              />
            </Col>
            <Col md={6}></Col>
            <Col md={4}>
              <FormikController
                control="input"
                formik={formik}
                value={formik.values.gaveTo}
                error={formik.errors.gaveTo}
                touched={formik.touched.gaveTo}
                type="text"
                name="gaveTo"
                label={t("gaveTo")}
              />
            </Col>
            <Col md={2}>
              <FormikController
                control="input"
                formik={formik}
                value={formik.values.usedQnt}
                error={formik.errors.usedQnt}
                touched={formik.touched.usedQnt}
                type="number"
                name="usedQnt"
                label={t("qnt")}
              />
            </Col>
            <Col md={6}></Col>
            <Col md={6}>
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
          </Row>
          <Button
            className="px-5"
            type="primary"
            htmlType="submit"
            variant="outline-primary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {t("use")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UseSpare;
