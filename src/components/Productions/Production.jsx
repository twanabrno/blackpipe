import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Form, Formik } from "formik";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";
import * as Yup from "yup";
import { HTTP } from "../../HTTPS";
import FormikController from "../Forms/FormikController";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import TodaysProductions from "./TodaysProductions";
import moment from "moment/moment";
import { useAuth } from "../auth";
import { Button, DatePicker } from "antd";
import UpdateProduct from "../FactoryStore/UpdateProduct";

const Production = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");

  const [type, setType] = useState("");
  let day = moment().format("DD");
  let month = moment().format("MM");
  let year = moment().format("YY");

  const [code, setCode] = useState("");

  const [line, setLine] = useState(localStorage.getItem("line") || "");
  const [length, setLength] = useState(0);
  const [lists, setLists] = useState([]);
  const [selectedListDatas, setSelectedListDatas] = useState();

  const [fStoreData, setFStoreDataData] = useState([]);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [fStoreDataLength, setFStoreDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});

  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };

  const fStoreColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return currentPage === 1
          ? index + 1
          : (currentPage - 1) * limit + (index + 1);
      },
    },
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("packet_qnt")}`,
      dataIndex: "packetQnt",
      key: "packetQnt",
      width: 75,
    },
    {
      title: `${t("packet_w")}`,
      dataIndex: "packetWeight",
      key: "packetWeight",
      width: 75,
    },
    {
      title: `${t("quality")}`,
      dataIndex: "quality",
      key: "quality",
      width: 35,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 35,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 35,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant"
      ? [
          {
            dataIndex: "",
            width: 100,
            fixed: "right",
            key: "id",
            render: (record) => (
              <>
                <Button
                  size="small"
                  onClick={() => handleDelete(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setUpdateRecord(record);
                    setOpenUpdateModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <AiTwotoneEdit />{" "}
                  <span className="d-none d-md-inline"> {t("edit")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  const initialValues = {
    packetQnt: "",
    packetWeight: "",
    quality: "1",
    p_comment: "",
    createdAt: "",
  };
  const validationSchema = Yup.object({
    packetQnt: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    packetWeight: Yup.number()
      .positive("Must be a positive Number")
      .required("Required"),
    quality: Yup.string().required("Required"),
    p_comment: Yup.string().required("Required"),
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
  const getLists = async () => {
    await HTTP.get(`/productionlist/allnames`)
      .then((response) => {
        console.log(response.data.rows);
        let l = response.data.rows.map((l) => {
          return { id: l.id, label: `${l.name}*${l.type}` };
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
        let type = response.data.rows[0].type;
        setType(response.data.rows[0].type);
        let l = line;
        setCode(`${day}${month}${year[1]}${type}${l}${length}`);
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
  const getData = async () => {
    setLoading(true);
    await HTTP.get(
      `/production/all?_date=${
        date || moment().format("Y-MM-DD")
      }&_search=${search}&_from=Factory`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setFStoreDataLength(response.data.count);
        setFStoreDataData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setFStoreDataData([]);
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
  const getTodayData = async () => {
    setLoading(true);
    await HTTP.get(
      `/production/all?_date=${moment().format(
        "Y-MM-DD"
      )}&_from=Factory&_line=${line}`
    )
      .then((response) => {
        setLoading(false);
        setLength(response.data.count);
        let l;
        if (Number(response.data.count) < 1) {
          setLength(`001`);
          l = `001`;
        } else if (Number(response.data.count) < 10) {
          setLength(`00${response.data.count + 1}`);
          l = `00${response.data.count + 1}`;
        } else if (Number(response.data.count) < 100) {
          setLength(`0${response.data.count + 1}`);
          l = `0${response.data.count + 1}`;
        }
        setCode(`${day}${month}${year[1]}${type}${line}${l}`);
      })
      .catch((error) => {
        setLoading(false);
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
    var data = {
      testId: selectedListDatas.id,
      name: selectedListDatas.name,
      type: selectedListDatas.type,
      standartPacketQnt: selectedListDatas.standartPacketQnt,
      standartPacketWeight: selectedListDatas.standartPacketWeight,
      standartPieceWeight: selectedListDatas.standartPieceWeight,
      ...values,
      productCode: code,
      line: line,
    };
    Swal.fire({
      title: `${t("on_product")}`,
      showCancelButton: true,
      confirmButtonText: `${t("add_products")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      onSubmitProps.setSubmitting(true);
      if (result.isConfirmed) {
        await HTTP.post(
          `/production/create?_createdBy=${localStorage.getItem("username")}`,
          data
        )
          .then((response) => {
            getData();
            let a = code.substr(code.length - 3);
            let remain = code.slice(0, -3);
            let b = Number(a) + 1;
            if (b < 10) {
              b = `00${b}`;
            } else if (b < 100) {
              b = `0${b}`;
            }
            let c = remain + String(b);
            setCode(c);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("added")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            onSubmitProps.resetForm();
            onSubmitProps.setSubmitting(false);
          })
          .catch((error) => {
            if (error.response.status == 401) {
              auth.logout();
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
  const handleDelete = async (id) => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await HTTP.delete(
          `/production/delete/${id}?_createdBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            getData();
            setLoading(false);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("deleted")}`,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            setLoading(false);
            if (error.response && error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Production not Found",
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
      }
    });
  };

  useEffect(() => {
    getLists();
  }, []);
  useEffect(() => {
    getData();
    getTodayData();
  }, [limit, currentPage, search, date, line, selectedListDatas]);

  return (
    <>
      {role == "Admin" || role == "Accountant" || role == "Store" ? (
        <>
          <Row>
            <Col md={3}>
              <FormControl className="w-100 mb-3 ">
                <InputLabel id="demo-simple-select-helper-label">
                  {t("select_line")}
                </InputLabel>
                <Select
                  size="small"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                  labelId="demo-select-small"
                  id="demo-select-small"
                  label={t("select_line")}
                  value={line}
                  onChange={(e) => {
                    setLine(e.target.value);
                  }}
                >
                  {lines.map((option) => {
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
          <Row>
            <Col md={6}>
              <Autocomplete
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                size="small"
                id="combo-box-demo"
                name="selectedList"
                label={t("select_list")}
                options={lists}
                disabled={!line}
                onChange={(event, newValue) => {
                  if (newValue?.id) {
                    setLength();
                    getSelectedListData(newValue.id);
                  } else {
                    setSelectedListDatas();
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label={<em>{t("select_list")}</em>} />
                )}
              />
            </Col>
          </Row>
          <Row className="p-3 ">
            <Col md={6}>
              <span className="l-text align-top">{t("type")}: </span>
              {selectedListDatas && (
                <span className="h6 r-text">{selectedListDatas.type}</span>
              )}
              <br />
              <span className="l-text align-top">{t("s_packet_qnt")}: </span>
              {selectedListDatas && (
                <span className="h6 r-text">
                  {selectedListDatas.standartPacketQnt}
                </span>
              )}
              <br />
            </Col>
            <Col md={6}>
              <span className="l-text align-top">{t("s_packet_w")}: </span>
              {selectedListDatas && (
                <span className="h6 r-text">
                  {selectedListDatas.standartPacketWeight}
                </span>
              )}
              <br />
              <span className="l-text align-top">{t("s_piece_w")}: </span>
              {selectedListDatas && (
                <span className="h6 r-text">
                  {selectedListDatas.standartPieceWeight}
                </span>
              )}
              <br />
            </Col>
          </Row>
          <div className="bg-sh">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleAdd}
              validateOnMount
            >
              {(formik) => (
                <>
                  <Row className="mb-3  addUserForm">
                    <h4 className="mb-3">{t("produce")}</h4>
                    <Form className="w-100 mb-3">
                      <Row>
                        <Col md={3}>
                          {role == "Admin" || role == "Accountant" ? (
                            <DatePicker
                              placeholder={t("date")}
                              className="my-1 my-md-2"
                              size={"large"}
                              onChange={(date, dateString) => {
                                formik.setFieldValue("createdAt", dateString);
                                if (dateString) {
                                  let y = moment(dateString).format("YY");
                                  setCode(
                                    `${moment(dateString).format("MMDD")}${
                                      y[1]
                                    }${code.slice(5)}`
                                  );
                                } else {
                                  let y = moment().format("YY");
                                  setCode(
                                    `${moment().format("MMDD")}${
                                      y[1]
                                    }${code.slice(5)}`
                                  );
                                }
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                      <Row className="produce-form">
                        <div className=" d-flex flex-wrap">
                          <div
                            className="flex-grow-1"
                            style={{
                              padding: "0 5px",
                            }}
                          >
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
                          </div>
                          <div
                            className="flex-grow-1"
                            style={{
                              padding: "0 5px",
                            }}
                          >
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
                          </div>
                          <div
                            className="flex-grow-1"
                            style={{
                              minWidth: "100px",
                              padding: "0 5px",
                            }}
                          >
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
                          </div>
                          <div
                            className="flex-grow-1"
                            style={{
                              padding: "0 5px",
                            }}
                          >
                            <FormikController
                              control="input"
                              formik={formik}
                              value={!line || !selectedListDatas ? "" : code}
                              type="text"
                              name="code"
                              label={t("code")}
                              disabled
                            />
                          </div>
                          <div
                            className="flex-grow-1"
                            style={{
                              padding: "0 5px",
                            }}
                          >
                            <FormikController
                              control="textarea"
                              formik={formik}
                              value={formik.values.p_comment}
                              error={formik.errors.p_comment}
                              touched={formik.touched.p_comment}
                              name="p_comment"
                              label={t("comment")}
                              disabled={!selectedListDatas}
                            />
                          </div>
                        </div>
                      </Row>

                      <Button
                        className="px-5 mt-3"
                        type="primary"
                        htmlType="submit"
                        variant="outline-primary"
                        disabled={!formik.isValid || formik.isSubmitting}
                      >
                        {t("produce")}
                      </Button>
                    </Form>
                  </Row>
                </>
              )}
            </Formik>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* Day Productions */}
      <TodaysProductions
        fStoreDataLength={fStoreDataLength}
        setSearch={setSearch}
        fStoreColumn={fStoreColumn}
        loading={loading}
        setLimit={setLimit}
        setCurrentPage={setCurrentPage}
        count={count}
        limit={limit}
        setDate={setDate}
        fStoreData={fStoreData}
      />
      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        onHide={handleUpdateModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
        </Modal.Header>
        <Container className="p-4">
          <UpdateProduct
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getAllDatas={getData}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Production;
