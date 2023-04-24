import { Autocomplete, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FormikController from "../Forms/FormikController";
import { HTTP } from "../../HTTPS";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Button } from "antd";
import { useAuth } from "../auth";

const UpdateProduct = ({ initialValues, handleClose, getAllDatas }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedListDatas, setSelectedListDatas] = useState();

  const validationSchema = Yup.object({
    quality: Yup.string().required("Required"),
    line: Yup.string().required("Required"),

    packetQnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    packetWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
  });
  const quality = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
  ];
  const lines = [
    { key: "101A", value: "101A" },
    { key: "76B", value: "76B" },
    { key: "76C", value: "76C" },
    { key: "51D", value: "51D" },
  ];
  const types = [
    { key: "hr", value: "HR" },
    { key: "gi", value: "GI" },
    { key: "gr", value: "CR" },
  ];

  const getSelectedListData = async (id) => {
    await HTTP.get(`/productionlist/byid/${id}`)
      .then((response) => {
        setSelectedListDatas(response.data.rows[0]);
      })
      .catch((error) => {
        setSelectedListDatas([]);
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
  const getLists = async () => {
    await HTTP.get(`/productionlist/allnames`)
      .then((response) => {
        let l = response.data.rows.map((l) => {
          return { id: l.id, label: l.name };
        });
        setLists(l);
      })
      .catch((error) => {
        setLists([]);
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
  const handleUpdate = (values, onSubmitProps) => {
    var data = values;
    data["name"] = selectedListDatas?.name || initialValues.name;
    data["type"] = selectedListDatas?.type || initialValues.type;
    const id = values.id;
    onSubmitProps.setSubmitting(false);
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
          `/production/update/${id}?_updatedBy=${localStorage.getItem(
            "username"
          )}`,
          values
        )
          .then((response) => {
            getAllDatas();
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
  useEffect(() => {
    getLists();
  }, [selectedListDatas]);
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
              <Row>
                <Row>
                  <Col md={8} className="mb-3">
                    <Autocomplete
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      }}
                      size="small"
                      id="combo-box-demo"
                      name="selectedList"
                      label={t("list_name")}
                      options={lists}
                      value={selectedListDatas?.name || initialValues.name}
                      onChange={(event, newValue) => {
                        if (newValue?.id) {
                          getSelectedListData(newValue.id);
                        } else {
                          setSelectedListDatas();
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<em>{t("select_list")}</em>}
                        />
                      )}
                    />
                  </Col>
                  <Col md={4}>
                    <FormikController
                      control="select"
                      formik={formik}
                      value={selectedListDatas?.type || initialValues.type}
                      options={types}
                      name="type"
                      label={t("type")}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={5}>
                    <FormikController
                      control="select"
                      formik={formik}
                      value={formik.values.quality}
                      error={formik.errors.quality}
                      touched={formik.touched.quality}
                      options={quality}
                      name="quality"
                      label={t("quality")}
                    />
                  </Col>
                  <Col md={5}>
                    <FormikController
                      control="select"
                      formik={formik}
                      value={formik.values.line}
                      error={formik.errors.line}
                      touched={formik.touched.line}
                      options={lines}
                      name="line"
                      label={t("line")}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={5}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.packetQnt}
                      error={formik.errors.packetQnt}
                      touched={formik.touched.packetQnt}
                      type="number"
                      name="packetQnt"
                      label={t("packet_qnt")}
                    />
                  </Col>
                  <Col md={5}>
                    <FormikController
                      control="input"
                      formik={formik}
                      value={formik.values.packetWeight}
                      error={formik.errors.packetWeight}
                      touched={formik.touched.packetWeight}
                      type="number"
                      name="packetWeight"
                      label={t("packet_w")}
                      step={0.1}
                    />
                  </Col>
                </Row>
                <div className="w-100 ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t("update")}
                  </Button>
                </div>
              </Row>
            </Form>
          </Row>
        </>
      )}
    </Formik>
  );
};

export default UpdateProduct;
