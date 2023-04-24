import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Badge, Button, DatePicker, Input, Space, Spin, Table } from "antd";
import { BsBorderWidth } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { HTTP } from "../../HTTPS";
import moment from "moment/moment";
import TarqeqForm from "./TarqeqForm";
import { useAuth } from "../auth";
import Swal from "sweetalert2";
const { Search } = Input;

const Tarqeq = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [piecesData, setPiecesData] = useState([]);
  const [piecesLength, setPiecesLength] = useState(0);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [widthSearch, setWidthSearch] = useState("");
  const [thiknessSearch, setThiknessSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const [tarqeqData, setTarqeqData] = useState([]);
  const [tarqeqLength, setTarqeqLength] = useState(0);
  const [tlimit, setTLimit] = useState(25);
  const [tcount, setTCount] = useState(0);
  const [tcurrentPage, setTCurrentPage] = useState(1);
  const [twidthSearch, setTWidthSearch] = useState("");
  const [tthiknessSearch, setTThiknessSearch] = useState("");
  const [tloading, setTLoading] = useState(false);
  const [tdate, setTDate] = useState("");

  const [openTamburModal, setOpenTamburModal] = useState(false);
  const [pieceValues, setPieceValues] = useState({});

  const handleTamburModalClose = () => {
    setPieceValues({});
    setOpenTamburModal(false);
  };

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
    ...(role == "Admin" || role == "Accountant"
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
                  <BsBorderWidth />{" "}
                  <span className="d-none d-md-inline"> {t("tarqeq")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];
  const TarqeqColumns = [
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
      key: "x",
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
      width: 75,
      render: (record) => (
        <span>
          <div className="bg_tarqeq">
            {record} {t("mm")}
          </div>
        </span>
      ),
    },
    {
      title: `${t("tarqeq_thikness")}`,
      dataIndex: "thinning_thikness",
      key: "thinning_thikness",
      width: 75,
      render: (record) => (
        <span>
          <div className="bg_tarqeq">
            {record} {t("mm")}
          </div>
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
    {
      title: `${t("situation")}`,
      key: "weight",
      width: 50,
      render: (record) => (
        <span>
          {!record.deleted ? (
            <>
              <Badge color="green" /> {t("available")}
            </>
          ) : ( 
            <>
              <Badge color="red" /> {record.deletedComment}
            </>
          )}
        </span>
      ),
    },
  ];

  const getPieces = async () => {
    setLoading(true);
    await HTTP.get(
      `/pieces/all?_limit=${limit}&_page=${currentPage}&_ws=${widthSearch}&_ts=${thiknessSearch}&_date=${date}`
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
  const getAllTarqeq = async () => {
    setLoading(true);
    await HTTP.get(
      `/pieces/alltarqeq?_limit=${tlimit}&_page=${tcurrentPage}&_ws=${twidthSearch}&_ts=${tthiknessSearch}&_date=${tdate}`
    )
      .then((response) => {
        setTLoading(false);
        setTCount(Math.ceil(response.data.count / tlimit));
        setTarqeqLength(response.data.count);
        setTarqeqData(response.data.rows);
      })
      .catch((error) => {
        setTLoading(false);
        setTarqeqData([]);
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
  useEffect(() => {
    getPieces();
    getAllTarqeq();
  }, [
    currentPage,
    thiknessSearch,
    widthSearch,
    date,
    limit,
    tlimit,
    tcurrentPage,
    tthiknessSearch,
    twidthSearch,
    tdate,
  ]);
  return (
    <>
      {/*PIECES TABLE */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("current_pieces")} ({piecesLength}){" "}
          </h4>
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
      </Row>
      <Table
        columns={PiecesColumns}
        size="small"
        className="tbs"
        rowKey="id"
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
              <span className=" lh-base">{t("roll_code")}: </span>
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
              <span className=" lh-base">{t("aLength")}: </span>
              <span className="fw-bold">
                {record.aLength} {t("m")}
              </span>
              <br />
              <span className=" lh-base">{t("tLength")}: </span>
              <span className="fw-bold">
                {record.tLength} {t("m")}
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
          columnWidth: 10,
        }}
        dataSource={piecesData}
      />

      {/*TARQEQ TABLE */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("current_tarqeq")} ({tarqeqLength}){" "}
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
        <Col md={2}>
          <Search
            placeholder={t("thikness")}
            allowClear
            className="my-1 my-md-2"
            onChange={(e) => {
              setTThiknessSearch(e.target.value);
            }}
          />
        </Col>
        <Col md={2}>
          <Search
            placeholder={t("width")}
            allowClear
            className="my-1 my-md-2"
            onChange={(e) => {
              setTWidthSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={TarqeqColumns}
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
              <span className=" lh-base">{t("roll_code")}: </span>
              <span className="fw-bold">{record.rollCode}</span>
              <br />
              <span className=" lh-base">{t("madein")}: </span>
              <span className="fw-bold">{record.madeIn}</span>
              <br />
              <span className=" lh-base">{t("slitted_by")}: </span>
              <span className="fw-bold">{record.slittedBy}</span>
              <br />
              <span className=" lh-base bg_tarqeq">{t("tarqeq_length")}: </span>
              <span className="fw-bold bg_tarqeq">
                {record.thinning_length}
              </span>
              <br />
              <span className=" lh-base">{t("day_series")}: </span>
              <span className="fw-bold">{record.daySeries}</span>
              <br />
              <span className=" lh-base">{t("piece_series")}: </span>
              <span className="fw-bold">{record.pieceSeries}</span>
              <br />
              <span className=" lh-base">{t("aLength")}: </span>
              <span className="fw-bold">
                {record.aLength} {t("m")}
              </span>
              <br />
              <span className=" lh-base">{t("tLength")}: </span>
              <span className="fw-bold">
                {record.tLength} {t("m")}
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
          columnWidth: 10,
        }}
        dataSource={tarqeqData}
      />
      {/* TARQEQ MODAL */}
      <Modal
        show={openTamburModal}
        onHide={handleTamburModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("tarqeq")}</Modal.Title>
          </Modal.Header>
          <TarqeqForm
            pieceValues={pieceValues}
            handleClose={handleTamburModalClose}
            getPieces={getPieces}
            getAllTarqeq={getAllTarqeq}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Tarqeq;
