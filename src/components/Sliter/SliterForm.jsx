import React, { useState } from "react";
import { FieldArray, Formik, Form } from "formik";
import * as Yup from "yup";
import { Col, Modal, Row, Container } from "react-bootstrap";
import FormikController from "../Forms/FormikController";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { useAuth } from "../auth";
import { DatePicker } from "antd";

const SlitForm = ({
  rollValues,
  handleClose,
  getRollsData,
  getSlittedsData,
  getDeletedSlittedsData,
}) => {
  const { t } = useTranslation();
  const role = localStorage.getItem("role");
  const auth = useAuth();
  const [date, setDate] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [realWidth, setRealWidth] = useState("");
  const [divideInto, setDivideInto] = useState("");

  const piecesForm = {
    rollId: rollValues.id,
    rollCode: rollValues.code,
    autoCode: "",
    type: rollValues.type,
    rollQuality: rollValues.rollQuality,
    madeIn: rollValues.madeIn,
    slittedBy: localStorage.getItem("username"),
    weight: "",
    width: 0,
    aLength: rollValues.aLength,
    tLength: rollValues.tLength,
    thikness: rollValues.thikness,
    daySeries: "",
    pieceSeries: "",
    slittedComment: rollValues.slittedComment,
    pieceComment: "",
  };
  const initialValues = {
    ...rollValues,
    slittedComment: "",
    slittedBy: localStorage.getItem("username"),
    realWidth: "",
    daySeries: "",
    remaining: 0,
    dividedInto: "",
    pieces: [],
    remains: piecesForm,
  };
  const devidSelect = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
    { key: "4", value: "4" },
    { key: "5", value: "5" },
    { key: "6", value: "6" },
    { key: "7", value: "7" },
    { key: "8", value: "8" },
    { key: "9", value: "9" },
    { key: "10", value: "10" },
    { key: "11", value: "11" },
    { key: "12", value: "12" },
    { key: "13", value: "13" },
    { key: "14", value: "14" },
    { key: "15", value: "15" },
  ];

  const validationSchema = Yup.object({
    realWidth: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    daySeries: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    dividedInto: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    pieces: Yup.array(
      Yup.object({
        width: Yup.number()
          .positive("Must be a positive Number")
          .required("Required"),
      })
    ),
  });

  const handleSubmit = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(true);
    setLoading(true);
    const data = values;
    data["date"] = date;
    Swal.fire({
      title: `${t("on_slit")}`,
      showCancelButton: true,
      confirmButtonText: `${t("slit")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTP.post(`/slit/create`, data)
          .then((response) => {
            getRollsData();
            getSlittedsData();
            getDeletedSlittedsData();
            handleClose();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("slited")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.setSubmitting(false);
            setLoading(false);
          })
          .catch((error) => {
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Roll not Found",
                showConfirmButton: false,
                timer: 1500,
              });
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
            setLoading(false);
          });
      }
    });
  };

  return (
    <Modal.Body>
      <Row className="slit-info px-0 px-md-2">
        <Col>
          <span className=" lh-base">{t("net_weight")}: </span>
          <span className="fw-bold">{rollValues.netWeight}</span>
          <br />
          <span className=" lh-base">{t("width")}: </span>
          <span className="fw-bold">{rollValues.width}</span>
          <br />
          <span className=" lh-base">{t("thikness")}: </span>
          <span className="fw-bold">{rollValues.thikness}</span>
          <br />
          <span className=" lh-base">{t("aLength")}: </span>
          <span className="fw-bold">{rollValues.aLength}</span>
          <br />
        </Col>
        <Col className="px-0">
          {rollValues && (
            <>
              <span className=" lh-base">{t("code")}: </span>
              <span className="fw-bold">{rollValues.code}</span>
              <br />
              <span className=" lh-base">{t("rollQuality")}: </span>
              <span className="fw-bold">{rollValues.rollQuality}</span>
              <br />
              <span className=" lh-base">{t("madeIn")}: </span>
              <span className="fw-bold">{rollValues.madeIn}</span>
              <br />
              <span className=" lh-base">{t("date")}: </span>
              <span className="fw-bold">
                {moment(rollValues.createdAt).format("Y.MM.DD")}
              </span>
              <br />
            </>
          )}
        </Col>
      </Row>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(formik) => (
          <>
            <p className="m-0 mt-1">
              {t("remains")} <b className="fw-bolder">{remaining || 0}</b>{" "}
              {t("mm")}
            </p>
            <Form className="py-2">
              <Row className="py-2">
                <Col md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    inputProps={{
                      min: 0,
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    label={t("real_width")}
                    value={realWidth}
                    type="number"
                    name="realWidth"
                    onBlur={() => formik.setFieldTouched("realWidth", true)}
                    error={
                      formik.touched.realWidth &&
                      Boolean(formik.errors.realWidth)
                    }
                    onChange={(e) => {
                      setRealWidth(e.target.value);
                      formik.setFieldValue("realWidth", e.target.value);
                      let x = 0;
                      if (!formik.values.pieces.length) {
                        setRemaining(e.target.value);
                        formik.setFieldValue(`remaining`, e.target.value);
                        formik.setFieldValue(`remains.width`, e.target.value);
                      } else {
                        Array.from({
                          length: formik.values.pieces.length,
                        }).map((_, i) => {
                          x += parseInt(formik.values.pieces[i].width);
                        });
                        setRemaining(e.target.value - x);
                        formik.setFieldValue(`remaining`, e.target.value - x);
                        formik.setFieldValue(
                          `remains.width`,
                          e.target.value - x
                        );
                      }
                      formik.setFieldValue(
                        "remains.weight",
                        parseFloat(
                          (formik.values.netWeight / e.target.value) *
                            (realWidth - x)
                        ).toFixed(3)
                      );
                    }}
                  />
                </Col>
                <Col md={6}>
                  {role == "Admin" || role == "Accountant" ? (
                    <DatePicker
                      placeholder={t("date")}
                      size="large"
                      className="w-100"
                      onChange={(date, dateString) => {
                        setDate(dateString);
                        let x = [];
                        Array.from({
                          length: divideInto,
                        }).map((_, i) => {
                          x.push(piecesForm);
                        });
                        formik.setFieldValue(`pieces`, x);
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <Row className="py-2">
                <Col>
                  <TextField
                    size="small"
                    fullWidth
                    inputProps={{
                      min: 0,
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    label={t("day_series")}
                    value={formik.values.daySeries}
                    name="daySeries"
                    onBlur={() => formik.setFieldTouched("daySeries", true)}
                    error={
                      formik.touched.daySeries &&
                      Boolean(formik.errors.daySeries)
                    }
                    type="number"
                    onChange={(e) => {
                      formik.setFieldValue("daySeries", e.target.value);
                    }}
                  />
                </Col>
                <Col>
                  <FormControl fullWidth>
                    <InputLabel id="demo-select-small">
                      {t("devid_into")}
                    </InputLabel>
                    <Select
                      size="small"
                      style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                      labelId="demo-select-small"
                      id="demo-select-small"
                      label={t("devid_into")}
                      value={divideInto}
                      onBlur={() => formik.setFieldTouched("dividedInto", true)}
                      error={
                        formik.touched.dividedInto &&
                        Boolean(formik.errors.dividedInto)
                      }
                      disabled={
                        !formik.values.daySeries ||
                        formik.values.daySeries == 0 ||
                        !formik.values.realWidth ||
                        formik.values.realWidth == 0
                      }
                      onChange={(e) => {
                        formik.setFieldValue("dividedInto", e.target.value);
                        setDivideInto(Number(e.target.value));
                        let x = [];
                        Array.from({
                          length: e.target.value,
                        }).map((_, i) => {
                          x.push(piecesForm);
                        });
                        formik.setFieldValue(`pieces`, x);
                      }}
                    >
                      {devidSelect.map((option) => {
                        return (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <div
                className="pt-3"
                style={{
                  maxHeight: "calc(100vh - 380px)",
                  overflowY: "auto",
                }}
              >
                <FieldArray name="pieces">
                  {({ push, remove }) => {
                    return (
                      <React.Fragment>
                        {formik.values.pieces.map((_, index) => (
                          <Container fluid className="pt-1" key={index}>
                            <Row>
                              <Col sm={3} className="mb-2">
                                <TextField
                                  size="small"
                                  fullWidth
                                  inputProps={{
                                    min: 0,
                                  }}
                                  id="outlined-basic"
                                  variant="outlined"
                                  name={`pieces.${index}.width`}
                                  label={t("width")}
                                  value={formik.values.pieces[index].width}
                                  type="number"
                                  disabled={
                                    !formik.values.daySeries ||
                                    formik.values.daySeries == 0 ||
                                    !formik.values.realWidth ||
                                    formik.values.realWidth == 0
                                  }
                                  onBlur={() =>
                                    formik.setFieldTouched(
                                      `pieces.${index}.width`,
                                      true
                                    )
                                  }
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      `pieces.${index}.width`,
                                      e.target.value
                                    );
                                    let x = 0;
                                    Array.from({
                                      length: formik.values.pieces.length,
                                    }).map((_, i) => {
                                      if (i == index) {
                                        x += parseInt(e.target.value);
                                      } else {
                                        x += parseInt(
                                          formik.values.pieces[i].width
                                        );
                                      }
                                    });
                                    setRemaining(realWidth - x);
                                    formik.setFieldValue(
                                      `remaining`,
                                      realWidth - x
                                    );
                                    formik.setFieldValue(
                                      `remains.width`,
                                      realWidth - x
                                    );
                                    formik.setFieldValue(
                                      "remains.weight",
                                      parseFloat(
                                        (formik.values.netWeight / realWidth) *
                                          (realWidth - x)
                                      ).toFixed(3)
                                    );
                                    let day = date
                                      ? moment(date).format("DD")
                                      : moment().format("DD");
                                    let month = date
                                      ? moment(date).format("MM")
                                      : moment().format("MM");
                                    let year = date
                                      ? moment(date).format("YY")
                                      : moment().format("YY");

                                    let type = formik.values.type;

                                    if (type == "HR") {
                                      type = "SH";
                                    } else if (type == "GI") {
                                      type = "SG";
                                    } else if (type == "CR") {
                                      type = "SC";
                                    }

                                    let daySeries;
                                    if (formik.values.daySeries <= 9) {
                                      daySeries = `0${formik.values.daySeries}`;
                                    } else {
                                      daySeries = formik.values.daySeries;
                                    }
                                    let pieceSeries;
                                    let rSeries;
                                    if (index < 9) {
                                      pieceSeries = `0${index + 1}`;
                                      rSeries = `0${index + 2}`;
                                    } else {
                                      pieceSeries = index + 1;
                                      rSeries = index + 2;
                                    }
                                    let w =
                                      (formik.values.netWeight / realWidth) *
                                      e.target.value;

                                    formik.setFieldValue(
                                      `pieces.${index}.autoCode`,
                                      `${day}${month}${year[1]}${type}${daySeries}${pieceSeries}`
                                    );
                                    formik.setFieldValue(
                                      `pieces.${index}.daySeries`,
                                      daySeries
                                    );
                                    formik.setFieldValue(
                                      `pieces.${index}.pieceSeries`,
                                      pieceSeries
                                    );
                                    formik.setFieldValue(
                                      `pieces.${index}.weight`,
                                      parseFloat(w).toFixed(3)
                                    );
                                    formik.setFieldValue(
                                      `remains.autoCode`,
                                      `${day}${month}${year[1]}${type}${daySeries}${rSeries}`
                                    );
                                    formik.setFieldValue(
                                      `remains.daySeries`,
                                      daySeries
                                    );
                                    formik.setFieldValue(
                                      `remains.pieceSeries`,
                                      rSeries
                                    );
                                  }}
                                />
                              </Col>
                              <Col sm={3} className="">
                                <FormikController
                                  control="input"
                                  formik={formik}
                                  value={formik.values.pieces[index].autoCode}
                                  type="text"
                                  name={`pieces.${index}.code`}
                                  label={t("code")}
                                  disabled
                                />
                              </Col>
                              <Col sm={3} className="">
                                <FormikController
                                  control="input"
                                  formik={formik}
                                  value={parseFloat(
                                    (formik.values.netWeight / realWidth) *
                                      formik.values.pieces[index].width
                                  ).toFixed(3)}
                                  type="number"
                                  name={`pieces.${index}.weight`}
                                  label={t("weight")}
                                  disabled
                                />
                              </Col>
                              <Col md={3} className="mb-2">
                                <FormikController
                                  control="textarea"
                                  formik={formik}
                                  value={
                                    formik.values.pieces[index].pieceComment
                                  }
                                  name={`pieces.${index}.pieceComment`}
                                  label={t("comment")}
                                />
                              </Col>
                            </Row>
                            <hr className="m-0 mb-2" />
                          </Container>
                        ))}
                      </React.Fragment>
                    );
                  }}
                </FieldArray>
              </div>
              <div className="py-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!formik.isValid || formik.isSubmitting || loading}
                >
                  {t("slit")}
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </Modal.Body>
  );
};

export default SlitForm;
