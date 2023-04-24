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

const AddList = ({ getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const types = [
    { key: "hr", value: "HR" },
    { key: "gi", value: "GI" },
    { key: "gr", value: "CR" },
  ];
  const initialValues = {
    name: "",
    type: "HR",
    createdBy:localStorage.getItem("username"),
    standartPacketQnt: "",
    standartPacketWeight: "",
    standartPieceWeight: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    standartPacketQnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    standartPacketWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    standartPieceWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    type: Yup.string().required("Required"),
  });
  const handleAdd = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_list")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(`/productionlist/create`, values)
          .then((response) => {
            getData();
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
                <span className="mb-3 add_span">{t("add_list")} </span>
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
                      label={t("list_name")}
                    />
                  </Col>
                  <Col md={2}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.standartPacketQnt}
                      error={formik.errors.standartPacketQnt}
                      touched={formik.touched.standartPacketQnt}
                      type="number"
                      name="standartPacketQnt"
                      label={t("s_packet_qnt")}
                    />
                  </Col>
                  <Col md={2}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.standartPacketWeight}
                      error={formik.errors.standartPacketWeight}
                      touched={formik.touched.standartPacketWeight}
                      type="number"
                      name="standartPacketWeight"
                      label={t("s_packet_w")}
                      step={0.1}
                    />
                  </Col>
                  <Col md={2}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.standartPieceWeight}
                      error={formik.errors.standartPieceWeight}
                      touched={formik.touched.standartPieceWeight}
                      type="number"
                      name="standartPieceWeight"
                      label={t("s_piece_w")}
                      step={0.1}
                    />
                  </Col>
                  <Col md={2}>
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
                  </Col>
                  <div className="w-100 ">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      {t("add_list")}
                    </Button>
                  </div>
                </Row>
              </Form>
            </Row>
          </Collapse>
        </>
      )}
    </Formik>
  );
};

export default AddList;
