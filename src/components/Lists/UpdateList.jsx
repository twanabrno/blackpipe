import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { Button, Col, Container, Row } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const UpdateList = ({ initialValues, handleClose, getData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const types = [
    { key: "hr", value: "HR" },
    { key: "gi", value: "GI" },
    { key: "gr", value: "CR" },
  ];
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
          `/productionlist/update/${id}?_updatedBy=${localStorage.getItem(
            "username"
          )}`,
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
            <Form className="w-100 mb-3">
              <Container className="py-4">
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
                      type="submit"
                      variant="outline-primary"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      {t("update")}
                    </Button>
                  </div>
                </Row>
              </Container>
            </Form>
          </Row>
        </>
      )}
    </Formik>
  );
};

export default UpdateList;
