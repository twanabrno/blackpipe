import React, { useState } from "react";
import { Button, Space, Spin } from "antd";
import { Formik, Form } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useAuth } from "../auth";
import { HTTP } from "../../HTTPS";
import FormikController from "../Forms/FormikController";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const NotSelectedForm = ({
  selectedProducts,
  handleClose,
  getAllDatas,
  getSentDatas,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);

  const [lists, setLists] = useState([]);
  const [selectedListDatas, setSelectedListDatas] = useState();

  const [st, setSt] = useState("Sell");
  const [buyer, setBuyer] = useState(true);
  const initialValues = {
    ...selectedProducts,
    quality: "1",
    line: "101A",
    qnt: "",
    weight: "",
    sentBy: localStorage.getItem("username"),
    from: "BlackPipe",
    sentTo: "",
    carNo: "",
    driverName: "",
    driverPhone: "",
    carType: "",
  };
  const validationSchema = Yup.object({
    qnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required")
      .max(selectedListDatas?.packetQnt - 1 || 0, "Not Enough Piece!"),
    weight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required")
      .max(selectedListDatas?.packetWeight - 1 || 0, "Not Enough Weight!"),
    quality: Yup.string().required("Required"),
    line: Yup.string().required("Required"),
    sentTo: Yup.string().required("Required"),
    carNo: Yup.string().required("Required"),
    driverName: Yup.string().required("Required"),
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

  const getDatas = async () => {
    setLoading(true);
    await HTTP.get(`/qandelblbasstore/all`)
      .then((response) => {
        let l = response.data.rows.map((l) => {
          return { id: l.id, key: l.id, label: l.name };
        });
        setLoading(false);
        setLists(l);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response && error.response.status === 404) {
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
    await HTTP.get(`/qandelblbasstore/byid/${id}`)
      .then((response) => {
        setSelectedListDatas(response.data.rows[0]);
      })
      .catch((error) => {
        setSelectedListDatas([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response && error.response.status === 404) {
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
    data["pId"] = selectedListDatas.id;
    data["name"] = selectedListDatas.name;
    data["type"] = selectedListDatas.type;
    data["productCode"] = selectedListDatas.productCode;
    data["standartPieceWeight"] = selectedListDatas.standartPieceWeight;
    data["standartPacketQnt"] = selectedListDatas.standartPacketQnt;
    data["standartPacketWeight"] = selectedListDatas.standartPacketWeight;
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
          `/sent/sendpieces?_by=${localStorage.getItem("username")}`,
          data
        )
          .then((response) => {
            getAllDatas();
            getSentDatas();
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
  useEffect(() => {
    getDatas();
  }, []);
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
            {loading ? (
              <Space size="middle">
                <Spin size="large" />
              </Space>
            ) : (
              <Form className="w-100 mb-2 px-3 px-md-0">
                <Container fluid>
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
                    <Col md={6}>
                      <Row>
                        <Col md={6}>
                          <FormikController
                            control="select"
                            formik={formik}
                            value={selectedListDatas?.type || "HR"}
                            options={types}
                            disabled
                            name="type"
                            label={t("type")}
                          />
                        </Col>
                        <Col md={6}>
                          <FormikController
                            control="select"
                            formik={formik}
                            value={selectedListDatas?.line || "101"}
                            disabled
                            options={lines}
                            name="line"
                            label={t("line")}
                          />
                        </Col>
                        <Col md={6}>
                          {" "}
                          <FormikController
                            control="input"
                            formik={formik}
                            value={`${selectedListDatas?.packetQnt || 0}/${
                              selectedListDatas?.standartPacketQnt || 0
                            }`}
                            disabled
                            type="text"
                            name="packetQnt"
                            label={t("qnt")}
                          />
                        </Col>
                        <Col md={6}>
                          <FormikController
                            control="input"
                            formik={formik}
                            value={`${selectedListDatas?.packetWeight || 0}/${
                              selectedListDatas?.standartPacketWeight || 0
                            }`}
                            disabled
                            type="text"
                            name="packetWeight"
                            label={t("weight")}
                          />
                        </Col>
                        <Col md={6}>
                          <FormikController
                            control="select"
                            formik={formik}
                            value={selectedListDatas?.quality || "1"}
                            disabled
                            options={quality}
                            name="quality"
                            label={t("quality")}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md={5} className="mb-3">
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
                    <Col md={5}>
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
                    <Col md={5}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.diverName}
                        error={formik.errors.diverName}
                        touched={formik.touched.diverName}
                        type="text"
                        name="diverName"
                        label={t("driverName")}
                      />
                    </Col>
                    <Col md={5}>
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
                    <Col md={5}>
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
                    <Col md={5}>
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
                    <Col md={5}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={formik.values.qnt}
                        error={formik.errors.qnt}
                        touched={formik.touched.qnt}
                        type="number"
                        name="qnt"
                        disabled={!selectedListDatas}
                        max={selectedListDatas?.packetQnt}
                        label={t("qnt")}
                      />
                    </Col>
                    <Col md={5}>
                      <FormikController
                        control="input"
                        formik={formik}
                        value={
                          formik.values.weight ||
                          formik.values.standartPieceWeight * formik.values.qnt
                        }
                        error={formik.errors.weight}
                        touched={formik.touched.weight}
                        type="number"
                        name="weight"
                        disabled={!selectedListDatas}
                        label={t("weight")}
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
                    {t("send")}
                  </Button>
                </Container>
              </Form>
            )}
          </Row>
        )}
      </Formik>
    </>
  );
};

export default NotSelectedForm;
