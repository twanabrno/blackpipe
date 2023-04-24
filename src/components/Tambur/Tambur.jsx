import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Button, DatePicker, Input, Space, Spin, Table } from "antd";
import { GiSteelClaws } from "react-icons/gi";
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";
import Swal from "sweetalert2";
import TambureForm from "./TambureForm";
import { HTTP } from "../../HTTPS";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import UpdateForm from "./UpdateForm";
import { useAuth } from "../auth";
import BulkTambur from "./BulkTambur";

const { Search } = Input;

const Tambur = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [justLogedIn, setJustLogedIn] = useState(false);
  const [line, setLine] = useState(localStorage.getItem("line") || "");
  const [piecesData, setPiecesData] = useState([]);
  const [piecesLength, setPiecesLength] = useState(0);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [widthSearch, setWidthSearch] = useState("");
  const [thiknessSearch, setThiknessSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");

  const [tamburedData, setTamburedData] = useState([]);
  const [tlimit, setTLimit] = useState(25);
  const [tcount, setTCount] = useState(0);
  const [tamburedLength, setTamburedLength] = useState(0);
  const [tcurrentPage, setTCurrentPage] = useState(1);
  const [tsearch, setTSearch] = useState("");
  const [tloading, setTLoading] = useState(false);
  const [tdate, setTDate] = useState("");

  const [dtamburedData, setDTamburedData] = useState([]);
  const [dtlimit, setDTLimit] = useState(10);
  const [dtcount, setDTCount] = useState(0);
  const [dtamburedLength, setDTamburedLength] = useState(0);
  const [dtcurrentPage, setDTCurrentPage] = useState(1);
  const [dtloading, setDTLoading] = useState(false);

  const [openTamburModal, setOpenTamburModal] = useState(false);
  const [pieceValues, setPieceValues] = useState({});

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});
  const lines = [
    { key: "101A", value: "101A" },
    { key: "76B", value: "76B" },
    { key: "76C", value: "76C" },
    { key: "51D", value: "51D" },
  ];
  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };

  const handleTamburModalClose = () => {
    setPieceValues({});
    setOpenTamburModal(false);
  };

  const tamburedColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return tcurrentPage === 1
          ? index + 1
          : (tcurrentPage - 1) * tlimit + (index + 1);
      },
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "width",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "thikness",
      width: 25,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("tarqeq_thikness")}`,
      dataIndex: "thinning_thikness",
      key: "thinning_thikness",
      width: 25,
      render: (record) => (
        <span>
          {record ? (
            <>
              {record} {t("mm")}
            </>
          ) : (
            <>-</>
          )}
        </span>
      ),
    },
    {
      title: `${t("actual_weight")}`,
      dataIndex: "realWeight",
      key: "realWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "weight",
      width: 50,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 75,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 75,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Tambur"
      ? [
          {
            dataIndex: "",
            width: 100,
            fixed: "right",
            key: "x",
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
  const deletedTamburedColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return dtcurrentPage === 1
          ? index + 1
          : (dtcurrentPage - 1) * dtlimit + (index + 1);
      },
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "width",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("thikness")}`,
      key: "thikness",
      width: 50,
      render: (record) => (
        <span>
          {!record.tarqeq ? (
            <div>
              {record.thikness} {t("mm")}
            </div>
          ) : (
            <div className="bg_tarqeq">
              {record.thinning_thikness} {t("mm")} / ({record.thikness}{" "}
              {t("mm")})
            </div>
          )}
        </span>
      ),
    },
    {
      title: `${t("actual_weight")}`,
      dataIndex: "realWeight",
      key: "realWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 75,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 75,
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
            key: "x",
            render: (record) => (
              <>
                <Button
                  size="small"
                  onClick={() => handlePermanentlyDelete(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
              </>
            ),
          },
        ]
      : []),
  ];
  const PiecesColumns = [
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
      title: `${t("width")}`,
      dataIndex: "width",
      key: "width",
      width: 50,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "thikness",
      width: 25,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("tarqeq_thikness")}`,
      dataIndex: "thinning_thikness",
      key: "thinning_thikness",
      width: 25,
      render: (record) => (
        <span>
          {record ? (
            <>
              {record} {t("mm")}
            </>
          ) : (
            <>-</>
          )}
        </span>
      ),
    },
    { title: `${t("type")}`, dataIndex: "type", key: "type", width: 50 },
    {
      title: `${t("code")}`,
      dataIndex: "autoCode",
      key: "autoCode",
      width: 100,
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "weight",
      width: 50,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Tambur"
      ? [
          {
            dataIndex: "",
            width: 50,
            fixed: "right",
            key: "x",
            render: (record) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setPieceValues(record);
                    setOpenTamburModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <GiSteelClaws />{" "}
                  <span className="d-none d-md-inline"> {t("tambur")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  const getPieces = async () => {
    setLoading(true);
    await HTTP.get(
      `/pieces/all?_limit=${limit}&_page=${currentPage}&_code=${code}&_ws=${widthSearch}&_ts=${thiknessSearch}&_date=${date}&_sort=date`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setPiecesLength(response.data.count);
        setPiecesData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setPiecesData([]);
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
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  const getTambureds = async () => {
    setTLoading(true);
    await HTTP.get(
      `/tambur/all?_limit=${tlimit}&_page=${tcurrentPage}&_search=${tsearch}&_date=${tdate}`
    )
      .then((response) => {
        setTLoading(false);
        setTCount(Math.ceil(response.data.count / tlimit));
        setTamburedLength(response.data.count);
        setTamburedData(response.data.rows);
      })
      .catch((error) => {
        setTLoading(false);
        setTamburedData([]);
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
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  const getDeletedTambureds = async () => {
    if (role == "Admin" || (role == "Accountant") | (role == "Watcher")) {
      setDTLoading(true);
      await HTTP.get(`/tambur/deleted?_limit=${dtlimit}&_page=${dtcurrentPage}`)
        .then((response) => {
          setDTLoading(false);
          setDTCount(Math.ceil(response.data.count / dtlimit));
          setDTamburedLength(response.data.count);
          setDTamburedData(response.data.rows);
        })
        .catch((error) => {
          setDTLoading(false);
          setDTamburedData([]);
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
          } else alert("Somthing is wrong, Please try again later");
        });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
      input: "textarea",
      customClass: {
        validationMessage: "my-validation-message",
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Your Comment is required'
          );
        }
      },
    }).then(async (result) => {
      const data = {
        deletedBy: localStorage.getItem("username"),
        deletedComment: result.value,
      };
      if (result.isConfirmed) {
        await HTTP.post(`/tambur/delete/${id}`, data)
          .then((response) => {
            getPieces();
            getTambureds();
            getDeletedTambureds();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("deleted")}`,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            setTamburedData([]);
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
          });
      }
    });
  };
  const handlePermanentlyDelete = (id) => {
    Swal.fire({
      title: `${t("on_delete_per")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HTTP.delete(
          `/tambur/deletepermanently/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            getPieces();
            getDeletedTambureds();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("deleted")}`,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            setDTamburedData([]);
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
          });
      }
    });
  };
  const handleLineModalClose = () => {
    setJustLogedIn(false);
  };
  useEffect(() => {
    getPieces();
    getTambureds();
    getDeletedTambureds();
  }, [
    currentPage,
    thiknessSearch,
    widthSearch,
    date,
    limit,
    tlimit,
    tcurrentPage,
    tsearch,
    tdate,
    dtlimit,
    dtcurrentPage,
    code,
  ]);
  useEffect(() => {
    if (
      localStorage.getItem("role") == "Tambur" &&
      localStorage.getItem("storeLoged") === "true"
    ) {
      setJustLogedIn(true);
    } else {
      localStorage.setItem("storeLoged", false);
    }
  }, []);
  const [openBulkTamburModal, setOpenBulkTamburModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  const handleBulkTamburModalClose = () => {
    // setSelectedRows([]);
    // setPiecesData([]);
    // getPieces();
    // getTambureds();
    setOpenBulkTamburModal(false);
  };
  return (
    <>
      {/*Pieces TABLE */}
      <Row>
        <Col md={3}>
          <h4 className="mb-3">
            {t("current_pieces")} ({piecesLength}){" "}
          </h4>
        </Col>
        <Col md={1}>
          <Button
            className="my-1 my-md-2"
            disabled={!selectedRows.length}
            onClick={() => setOpenBulkTamburModal(true)}
          >
            tambur
          </Button>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            className="my-1 my-md-2"
            onChange={(date, dateString) => {
              setDate(dateString);
            }}
          />
        </Col>
        <Col md={2}>
          <Search
            placeholder={t("thikness")}
            allowClear
            className="my-1 my-md-2"
            onChange={(e) => {
              setThiknessSearch(e.target.value);
            }}
          />
        </Col>
        <Col md={2}>
          <Search
            placeholder={t("width")}
            allowClear
            className="my-1 my-md-2"
            onChange={(e) => {
              setWidthSearch(e.target.value);
            }}
          />
        </Col>
        <Col md={2}>
          <Search
            placeholder={t("code")}
            allowClear
            className="my-1 my-md-2"
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={PiecesColumns}
        size="small"
        className="tbs"
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          hideSelectAll: true,
          getCheckboxProps: () => ({
            className: `${selectedRows.length >= 5 ? "allselected" : ""}`,
          }),
          ...rowSelection,
        }}
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: loading,
        }}
        pagination={{
          onChange: (current, size) => {
            setLimit(size);
            setCurrentPage(current);
          },
          total: Math.floor(count * limit),
          defaultPageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="px-md-4">
              <span className=" lh-base">{t("roll code")}: </span>
              <span className="fw-bold">{record.rollCode}</span>
              <br />
              <span className=" lh-base">{t("madein")}: </span>
              <span className="fw-bold">{record.madeIn}</span>
              <br />
              <span className=" lh-base">{t("slitted_by")}: </span>
              <span className="fw-bold">{record.slittedBy}</span>
              <br />
              {record.tarqeq && (
                <>
                  <span className=" lh-base bg_tarqeq">
                    {t("tarqeq_thikness")}:{" "}
                  </span>
                  <span className="fw-bold bg_tarqeq">
                    {record.thinning_thikness}
                  </span>
                  <br />
                  <span className=" lh-base bg_tarqeq">
                    {t("tarqeq_length")}:{" "}
                  </span>
                  <span className="fw-bold bg_tarqeq">
                    {record.thinning_length}
                  </span>
                  <br />
                </>
              )}
              <span className=" lh-base">{t("day_series")}: </span>
              <span className="fw-bold">{record.daySeries}</span>
              <br />
              <span className=" lh-base">{t("piece_series")}: </span>
              <span className="fw-bold">{record.pieceSeries}</span>
              <br />
              <span className=" lh-base">{t("date")}: </span>
              <span className="fw-bold">
                {moment(record.createdAt).format("Y.MM.DD")}
              </span>
              <br />
              <span className=" lh-base">{t("time")}: </span>
              <span className="fw-bold">
                {moment(record.createdAt).format("HH:mm:ss")}
              </span>
              <br />
              {record.pieceComment && (
                <>
                  <span className=" lh-base">{t("comment")}: </span>
                  <span className="fw-bold">{record.pieceComment}</span>
                  <br />
                </>
              )}
            </div>
          ),
          columnWidth: 12,
        }}
        dataSource={piecesData}
      />
      {/*TAMBURED TAMBLE */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("current_tambured")} ({tamburedLength}){" "}
          </h4>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            className="my-1 my-md-2"
            onChange={(date, dateString) => {
              setTDate(dateString);
            }}
          />
        </Col>
        <Col md={4}>
          <Search
            placeholder={t("search")}
            allowClear
            enterButton
            className="my-1 my-md-2"
            onChange={(e) => {
              setTSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={tamburedColumns}
        size="small"
        className="tbs"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: tloading,
        }}
        pagination={{
          onChange: (current, size) => {
            setTLimit(size);
            setTCurrentPage(current);
          },
          total: Math.floor(tcount * tlimit),
          defaultPageSize: tlimit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="px-md-4">
              <span className=" lh-base">{t("code")}: </span>
              <span className="fw-bold">{record.autoCode}</span>
              <br />
              <span className=" lh-base">{t("tambured_by")}: </span>
              <span className="fw-bold">{record.tamburedBy}</span>
              <br />
              <span className=" lh-base">{t("madein")}: </span>
              <span className="fw-bold">{record.madeIn}</span>
              <br />
              {record.tarqeq && (
                <>
                  <span className=" lh-base bg_tarqeq">
                    {t("tarqeq_thikness")}:{" "}
                  </span>
                  <span className="fw-bold bg_tarqeq">
                    {record.thinning_thikness}
                  </span>
                  <br />
                  <span className=" lh-base bg_tarqeq">
                    {t("tarqeq_length")}:{" "}
                  </span>
                  <span className="fw-bold bg_tarqeq">
                    {record.thinning_length}
                  </span>
                  <br />
                </>
              )}
              <span className=" lh-base">{t("date")}: </span>
              <span className="fw-bold">
                {moment(record.createdAt).format("Y.MM.DD")}
              </span>
              <br />
              <span className=" lh-base">{t("time")}: </span>
              <span className="fw-bold">
                {moment(record.createdAt).format("HH:mm:ss")}
              </span>
              <br />
              {record.tamburComment && (
                <>
                  <span className=" lh-base">{t("comment")}: </span>
                  <span className="fw-bold">{record.tamburComment}</span>
                  <br />
                </>
              )}
              {record.tambur_img && (
                <>
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}/pics/${record.tambur_img}`}
                    className="img-fluid"
                    alt=""
                  />
                </>
              )}
            </div>
          ),
          columnWidth: 10,
        }}
        dataSource={tamburedData}
      />
      {/*DELETED TAMBURED TAMBLE */}
      {role == "Admin" || role == "Accountant" || role == "Watcher" ? (
        <>
          <Row>
            <h4 className="mb-3">
              {t("deleted_tambured")} ({dtamburedLength}){" "}
            </h4>
          </Row>
          <Table
            columns={deletedTamburedColumns}
            size="small"
            className="tbs"
            rowKey="id"
            loading={{
              indicator: (
                <Space size="middle">
                  <Spin size="large" />
                </Space>
              ),
              spinning: dtloading,
            }}
            pagination={{
              onChange: (current, size) => {
                setDTLimit(size);
                setDTCurrentPage(current);
              },
              total: Math.floor(dtcount * dtlimit),
              defaultPageSize: dtlimit,
              showSizeChanger: true,
              pageSizeOptions: ["10", "25", "50"],
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div className="px-md-4">
                  <span className=" lh-base">{t("code")}: </span>
                  <span className="fw-bold">{record.autoCode}</span>
                  <br />
                  <span className=" lh-base">{t("deleted_by")}: </span>
                  <span className="fw-bold">{record.deletedBy}</span>
                  <br />
                  <span className=" lh-base">{t("madein")}: </span>
                  <span className="fw-bold">{record.madeIn}</span>
                  <br />
                  {record.tarqeq && (
                    <>
                      <span className=" lh-base bg_tarqeq">
                        {t("tarqeq_thikness")}:{" "}
                      </span>
                      <span className="fw-bold bg_tarqeq">
                        {record.thinning_thikness}
                      </span>
                      <br />
                      <span className=" lh-base bg_tarqeq">
                        {t("tarqeq_length")}:{" "}
                      </span>
                      <span className="fw-bold bg_tarqeq">
                        {record.thinning_length}
                      </span>
                      <br />
                    </>
                  )}
                  <span className=" lh-base">{t("deleted_date")}: </span>
                  <span className="fw-bold">
                    {moment(record.deletedDate).format("Y.MM.DD")}
                  </span>
                  <br />
                  <span className=" lh-base">{t("time")}: </span>
                  <span className="fw-bold">
                    {moment(record.createdAt).format("HH:mm:ss")}
                  </span>
                  <br />
                  {record.deletedComment && (
                    <>
                      <span className=" lh-base">{t("deleted_comment")}: </span>
                      <span className="fw-bold">{record.deletedComment}</span>
                      <br />
                    </>
                  )}
                </div>
              ),
              columnWidth: 12,
            }}
            dataSource={dtamburedData}
          />
        </>
      ) : (
        <></>
      )}
      {/* TAMBUR MODAL */}
      <Modal
        show={openTamburModal}
        onHide={handleTamburModalClose}
        fullscreen
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("tambur")}</Modal.Title>
          </Modal.Header>
          <TambureForm
            pieceValues={pieceValues}
            handleClose={handleTamburModalClose}
            getPieces={getPieces}
            getTambureds={getTambureds}
            getDeletedTambureds={getDeletedTambureds}
          />
        </Container>
      </Modal>
      {/* LINE MODAL */}
      {justLogedIn && <div className="fade modal-backdrop show"></div>}
      <Modal
        show={justLogedIn}
        onHide={handleLineModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        top
        backdrop={false}
      >
        <Modal.Header>
          <Modal.Title id="update-modal-title">{t("line")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="pb-4">
            <Row className="px-3 mb-4">{t("select_line_hasto")}</Row>
            <Row>
              <Col md={8}>
                <FormControl className="w-100 mb-3">
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
                      localStorage.setItem("line", e.target.value);
                      localStorage.setItem("storeLoged", false);
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
                <Button
                  className="mt-3"
                  variant="outline-primary"
                  onClick={() => {
                    setJustLogedIn(false);
                  }}
                  disabled={!line}
                >
                  Done
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        onHide={handleUpdateModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title"> {t("update")} </Modal.Title>
          </Modal.Header>
          <UpdateForm
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getTambureds={getTambureds}
          />
        </Container>
      </Modal>
      {/* BULK TAMBUR */}
      <Modal
        show={openBulkTamburModal}
        onHide={handleBulkTamburModalClose}
        fullscreen
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title"> {t("tambur")} </Modal.Title>
          </Modal.Header>
          <BulkTambur
            initialValues={selectedRows}
            handleClose={handleBulkTamburModalClose}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Tambur;
