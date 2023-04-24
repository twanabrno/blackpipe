import { Button } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";
import { Col, Collapse, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { BiListPlus } from "react-icons/bi";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";

const CreateSpareList = ({ getLists }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const initialValues = {
    name: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });
  const handleAdd = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_spare_list")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(
          `/spare/createsparelist?_createdBy=${localStorage.getItem(
            "username"
          )}`,
          values
        )
          .then((response) => {
            getLists();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("added")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.resetForm();
            onSubmitProps.setSubmitting(false);
            setShowUserForm(false);
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
          <Row className="mb-3">
            <Col className="d-flex justify-content-end px-md-5 px-3">
              <div
                className="adduserbtn"
                onClick={() => {
                  formik.resetForm();
                  setShowUserForm(!showUserForm);
                }}
              >
                <span className="mb-3 add_span">{t("add_spare_list")} </span>
                {showUserForm ? <AiOutlineMinusCircle /> : <BiListPlus />}
              </div>
            </Col>
          </Row>
          <Collapse in={showUserForm}>
            <Row className="mb-3 addUserForm">
              <Form className="w-100 mb-3">
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
                      {t("add_spare_list")}
                    </Button>
                  </div>
                </Row>
                <hr />
              </Form>
            </Row>
          </Collapse>
        </>
      )}
    </Formik>
  );
};

export default CreateSpareList;
