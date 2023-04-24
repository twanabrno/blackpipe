import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Button, Space, Spin } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import FormikController from "../Forms/FormikController";
import { useEffect } from "react";
import { useState } from "react";

const UpdateUsed = ({ initialValues, handleClose, getData, getUsedData }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [spares, setSpares] = useState([]);
  const [id, setId] = useState(initialValues.spareId);

  const validationSchema = Yup.object({
    usedName: Yup.string().required("Required"),
    usedBy: Yup.string().required("Required"),
    usedQnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const handleUpdate = (values, onSubmitProps) => {
    var data = values;
    data["spareId"] = id;
    const AllData = { new: data, old: initialValues };
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
          `/spare/updateused?_updatedBy=${localStorage.getItem("username")}`,
          AllData
        )
          .then((response) => {
            getData();
            getUsedData();
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
  const getSpareNames = async () => {
    setLoading(true);
    await HTTP.get(`/spare/all`)
      .then((response) => {
        setLoading(false);
        setSpares(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setSpares([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response.status === 404) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  useEffect(() => {
    getSpareNames();
  }, []);
  return (
    <>
      {!loading ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
          validateOnMount
        >
          {(formik) => (
            <>
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
                  {t("update")}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      ) : (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )}
    </>
  );
};

export default UpdateUsed;
