import { TextField } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment/moment";
import React, { useState } from "react";
import * as Yup from "yup";
import { useEffect } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import FormikController from "../Forms/FormikController";
import { Space, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const UpdateSlitForm = ({ rollId, getSlittedsData, handleClose }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [realWidth, setRealWidth] = useState(0);
  const [divideInto, setDivideInto] = useState(0);
  const piecesForm = {
    rollId: datas.id,
    autoCode: "",
    type: datas.type,
    madeIn: datas.madeIn,
    slittedBy: localStorage.getItem("username"),
    weight: 0,
    width: 0,
    length: datas.length,
    thikness: datas.thikness,
    daySeries: 0,
    pieceSeries: 0,
    slittedComment: datas.slittedComment,
    pieceComment: "",
  };
  const initialValues = {
    ...datas.slitteds,
    pieces: datas.pieces,
    remains: datas.remains,
  };
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
    Swal.fire({
      title: `${t("on_update")}`,
      showCancelButton: true,
      confirmButtonText: `${t("update")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTP.patch(
          `/slit/update/${values.id}?_updatedBy=${localStorage.getItem(
            "username"
          )}`,
          values
        )
          .then((response) => {
            getSlittedsData();
            handleClose();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("updated")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.setSubmitting(false);
          })
          .catch((error) => {
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "not Found",
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
          });
      }
    });
  };

  const getDatas = async () => {
    await HTTP.get(`/slit/byrollid/${rollId}`)
      .then((response) => {
        setDatas(response.data);
        setRemaining(response.data.slitteds.remaining);
        setRealWidth(response.data.slitteds.realWidth);
        setDivideInto(response.data.slitteds.dividedInto);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response.status === 404) {
          Swal.fire({
            position: "top-end",
            icon: "info",
            title: "not Found",
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
      });
  };
  useEffect(() => {
    setLoading(true);
    getDatas();
  }, []);

  return (
    <>
      {loading ? (
        <Space size="large">
          <Spin size="large" />
        </Space>
      ) : (
        <div>
          <Modal.Body>
            <Row className="px-2 slit-info">
              <Col>
                <span className=" lh-base">{t("weight")}: </span>
                <span className="fw-bold">{datas.slitteds.netWeight}</span>
                <br />
                <span className=" lh-base">{t("width")}: </span>
                <span className="fw-bold">{datas.slitteds.width}</span>
                <br />
              </Col>
              <Col>
                {datas.slitteds.code && (
                  <>
                    <span className=" lh-base">{t("code")}: </span>
                    <span className="fw-bold">{datas.slitteds.code}</span>
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
                          onBlur={() =>
                            formik.setFieldTouched("realWidth", true)
                          }
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
                              formik.setFieldValue(
                                `remains.width`,
                                e.target.value
                              );
                            } else {
                              Array.from({
                                length: formik.values.pieces.length,
                              }).map((_, i) => {
                                x += parseInt(formik.values.pieces[i].width);
                              });
                              setRemaining(e.target.value - x);
                              formik.setFieldValue(
                                `remaining`,
                                e.target.value - x
                              );
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
                          onBlur={() =>
                            formik.setFieldTouched("daySeries", true)
                          }
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
                        <TextField
                          size="small"
                          fullWidth
                          inputProps={{
                            min: 0,
                          }}
                          id="outlined-basic"
                          variant="outlined"
                          label={t("devide_into")}
                          value={divideInto}
                          type="number"
                          name="dividedInto"
                          disabled={
                            !formik.values.daySeries ||
                            formik.values.daySeries == 0 ||
                            !formik.values.realWidth ||
                            formik.values.realWidth == 0
                          }
                          onBlur={() =>
                            formik.setFieldTouched("dividedInto", true)
                          }
                          error={
                            formik.touched.dividedInto &&
                            Boolean(formik.errors.dividedInto)
                          }
                          onChange={(e) => {
                            formik.setFieldValue("dividedInto", e.target.value);
                            setDivideInto(e.target.value);
                            let x = [];
                            Array.from({
                              length: e.target.value,
                            }).map((_, i) => {
                              x.push(piecesForm);
                            });
                            formik.setFieldValue(`pieces`, x);
                          }}
                        />
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
                                        value={
                                          formik.values.pieces[index].width
                                        }
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
                                              (formik.values.netWeight /
                                                realWidth) *
                                                (realWidth - x)
                                            ).toFixed(3)
                                          );
                                          let day = moment().format("DD");
                                          let month = moment().format("MM");
                                          let year = moment().format("YY");
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
                                            (formik.values.netWeight /
                                              realWidth) *
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
                                        value={
                                          formik.values.pieces[index].autoCode
                                        }
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
                                          (formik.values.netWeight /
                                            realWidth) *
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
                                        value={formik.values.pieceComment}
                                        error={formik.errors.pieceComment}
                                        touched={formik.touched.pieceComment}
                                        name="pieceComment"
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
                      {" "}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!formik.isValid || formik.isSubmitting}
                      >
                        {t("update")}
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </Modal.Body>
        </div>
      )}
    </>
  );
};

export default UpdateSlitForm;
