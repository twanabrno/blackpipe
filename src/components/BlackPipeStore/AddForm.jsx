import { Autocomplete, TextField } from "@mui/material";
import { Button } from "antd";
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Col, Collapse, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { BiListPlus } from "react-icons/bi";
import * as Yup from "yup";
import FormikController from "../Forms/FormikController";
import { useAuth } from "../auth";
import { HTTP } from "../../HTTPS";
import Swal from "sweetalert2";

const AddForm = ({ getAllDatas }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedListDatas, setSelectedListDatas] = useState();
  const [showUserForm, setShowUserForm] = useState(false);

  const initialValues = {
    name: "",
    type: "HR",
    line: "101A",
    quality: "1",
    seller: "",
    addedBy: localStorage.getItem("username"),
    packetQnt: "",
    packetWeight: "",
    standartPacketQnt: "",
    standartPacketWeight: "",
    standartPieceWeight: "",
  };
  const validationSchema = Yup.object({
    quality: Yup.string().required("Required"),
    seller: Yup.string().required("Required"),
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
  const handleAdd = (values, onSubmitProps) => {
    var data = values;
    data["name"] = selectedListDatas.name;
    data["type"] = selectedListDatas.type;
    data["standartPacketQnt"] = selectedListDatas.standartPacketQnt;
    data["standartPacketWeight"] = selectedListDatas.standartPacketWeight;
    data["standartPieceWeight"] = selectedListDatas.standartPieceWeight;
    Swal.fire({
      title: `${t("on_add")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_products")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(
          `/blackpistore/create?_createdBy=${localStorage.getItem("username")}`,
          data
        )
          .then((response) => {
            getAllDatas();
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
            if (error.response.status == 401) {
              auth.logout();
            } else {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: `${t("Data_Not_Found")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
            onSubmitProps.setSubmitting(false);
          });
      }
    });
  };

  useEffect(() => {
    getLists();
  }, [selectedListDatas]);
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
                <span className="mb-3 add_span">{t("add_products")} </span>
                {showUserForm ? <AiOutlineMinusCircle /> : <BiListPlus />}
              </div>
            </Col>
          </Row>
          <Collapse in={showUserForm}>
            <Row className="mb-3 addUserForm">
              <Form className="w-100 mb-3">
                <Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Autocomplete
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        }}
                        size="small"
                        id="combo-box-demo"
                        name="selectedList"
                        label={t("list_name")}
                        options={lists}
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
                    <Col md={3}>
                      <FormikController
                        control="select"
                        formik={formik}
                        value={selectedListDatas?.type || "HR"}
                        options={types}
                        name="type"
                        label={t("type")}
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormikController
                        control="select"
                        formik={formik}
                        value={formik.values.quality}
                        error={formik.errors.quality}
                        touched={formik.touched.quality}
                        options={quality}
                        name="quality"
                        label={t("quality")}
                        disabled={!selectedListDatas}
                      />
                    </Col>
                    <Col md={3}>
                      <FormikController
                        control="select"
                        formik={formik}
                        value={formik.values.line}
                        error={formik.errors.line}
                        touched={formik.touched.line}
                        options={lines}
                        name="line"
                        label={t("line")}
                        disabled={!selectedListDatas}
                      />
                    </Col>
                    <Col md={3}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.seller}
                        error={formik.errors.seller}
                        touched={formik.touched.seller}
                        type="text"
                        name="seller"
                        label={t("seller")}
                        disabled={!selectedListDatas}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.packetQnt}
                        error={formik.errors.packetQnt}
                        touched={formik.touched.packetQnt}
                        type="number"
                        name="packetQnt"
                        label={t("packet_qnt")}
                        disabled={!selectedListDatas}
                      />
                    </Col>
                    <Col md={3}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.packetWeight}
                        error={formik.errors.packetWeight}
                        touched={formik.touched.packetWeight}
                        type="number"
                        name="packetWeight"
                        label={t("packet_w")}
                        disabled={!selectedListDatas}
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
                      {t("add_products")}
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

export default AddForm;
