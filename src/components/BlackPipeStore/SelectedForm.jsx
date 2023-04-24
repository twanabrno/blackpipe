import React, { useState } from "react";
import { Button } from "antd";
import { Formik, Form } from "formik";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useAuth } from "../auth";
import { HTTP } from "../../HTTPS";
import FormikController from "../Forms/FormikController";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

const SelectedForm = ({
  selectedProducts,
  handleClose,
  setSelectedProducts,
  getAllDatas,
  getSentDatas,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const [st, setSt] = useState("Sell");
  const [buyer, setBuyer] = useState(true);
  const initialValues = {
    id: selectedProducts,
    sentTo: "",
    sentBy: localStorage.getItem("username"),
    from: "BlackPipe",
    carNo: "",
    driverName: "",
    driverPhone: "",
    carType: "",
  };

  const validationSchema = Yup.object({
    sentTo: Yup.string().required("Required"),
    driverName: Yup.string().required("Required"),
    carNo: Yup.string().required("Required"),
  });
  const handleAdd = (values, onSubmitProps) => {
    Swal.fire({
      title: `${t("on_send")}`,
      showCancelButton: true,
      confirmButtonText: `${t("send")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(
          `/sent/sendmany?_by=${localStorage.getItem("username")}`,
          values
        )
          .then((response) => {
            getAllDatas();
            getSentDatas();
            setSelectedProducts([]);
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
      onSubmitProps.setSubmitting(false);
    });
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleAdd}
        validateOnMount
      >
        {(formik) => (
          <Row className="mb-3 py-5 px-3">
            <Form className="w-100 mb-3">
              <Row>
                <Row className="my-2">
                  <Col md={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-select-small">
                          {t("send_to")}
                        </InputLabel>
                        <Select
                          size="small"
                          style={{
                            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                          }}
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={st}
                          name="sendTo"
                          label="Send To"
                          onChange={(e) => setSt(e.target.value)}
                        >
                          <MenuItem
                            key="3"
                            value="Sell"
                            onClick={(e) => {
                              formik.setFieldValue("sentTo", "");
                              setBuyer(true);
                            }}
                          >
                            {t("sell")}
                          </MenuItem>
                          <MenuItem
                            key="1"
                            value="Factory"
                            onClick={() => {
                              formik.setFieldValue("sentTo", "FactoryStore");
                              setBuyer(false);
                            }}
                          >
                            {t("factor_store")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                  </Col>
                  <Col md={4}>
                    {buyer && (
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.sentTo}
                        error={formik.errors.sentTo}
                        touched={formik.touched.sentTo}
                        type="text"
                        name="sentTo"
                        label={t("sell_to")}
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.driverName}
                      error={formik.errors.driverName}
                      touched={formik.touched.driverName}
                      type="text"
                      name="driverName"
                      label={t("driverName")}
                    />
                  </Col>
                  <Col md={4}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.driverPhone}
                      error={formik.errors.driverPhone}
                      touched={formik.touched.driverPhone}
                      type="text"
                      name="driverPhone"
                      label={t("driverPhone")}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.carNo}
                      error={formik.errors.carNo}
                      touched={formik.touched.carNo}
                      type="text"
                      name="carNo"
                      label={t("car_no")}
                    />
                  </Col>
                  <Col md={4}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.carType}
                      error={formik.errors.carType}
                      touched={formik.touched.carType}
                      type="text"
                      name="carType"
                      label={t("car_type")}
                    />
                  </Col>
                </Row>
                <div className="w-100">
                  <Button
                    type="primary"
                    htmlType="submit"
                    variant="outline-primary"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t("send")}
                  </Button>
                </div>
              </Row>
            </Form>
          </Row>
        )}
      </Formik>
    </>
  );
};

export default SelectedForm;
