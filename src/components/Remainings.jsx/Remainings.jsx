import { Button, Space, Spin, Table, Input, DatePicker } from "antd";
import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import AddRemainings from "./AddRemainings";
import SellRemainings from "./SellRemainings";
import UpdateRemainings from "./UpdateRemainings";
const { Search } = Input;

const Remainings = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [remainingsData, setRemainingsData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState(0);
  const [remainingsLength, setRemainingsLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});
  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };

  const [openSellModal, setOpenSellModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSellModalClose = () => {
    setOpenSellModal(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const RemainingsColumns = [
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
      title: `${t("roll_code")}`,
      dataIndex: "rollCode",
      key: "rollCode",
      width: 75,
    },
    { title: `${t("type")}`, dataIndex: "type", key: "type", width: 50 },
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
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "weight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("day_series")}`,
      dataIndex: "daySeries",
      key: "daySeries",
      width: 75,
    },
    {
      title: `${t("piece_series")}`,
      dataIndex: "pieceSeries",
      key: "pieceSeries",
      width: 75,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Sliter"
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
                  disabled={record.rollId}
                  onClick={() => handleDelete(record.id)}
                  className={`my-1 ${
                    role == "Admin" || role == "Accountant" ? "" : "d-none"
                  }`}
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  disabled={record.rollId}
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

  const getRemainings = async () => {
    setLoading(true);
    await HTTP.get(
      `/remainings/all?_limit=${limit}&_page=${currentPage}&_search=${search}&_date=${date}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setRemainingsLength(response.data.count);
        setRemainingsData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setRemainingsData([]);
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

  const handleDelete = (id) => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await HTTP.post(
          `/remainings/delete/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            setLoading(false);
            getRemainings();
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
            setRemainingsData([]);
            if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "piece not Found",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              const message = error.response.data.error.message;
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
              } else {
                Swal.fire({
                  position: "top-end",
                  icon: "info",
                  title: message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          });
      }
    });
  };
  useEffect(() => {
    getRemainings();
  }, [limit, currentPage, search, date]);

  return (
    <>
      {/* ADD REMAINING PIECE */}
      {role == "Admin" || role == "Accountant" || role == "Sliter" ? (
        <AddRemainings getRemainings={getRemainings} />
      ) : (
        <></>
      )}

      {/*Remainings TABLE */}
      <Row>
        <Col md={5}>
          <h4 className="mb-3">
            {t("current_remainings")} ({remainingsLength})
          </h4>
        </Col>
        <Col md={1}>
          <Button
            onClick={() => {
              setOpenSellModal(true);
            }}
            disabled={!selectedRows.length}
            type="primary"
            className="my-1 my-md-2"
            ghost
          >
            {t("sell")}
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
        <Col md={4}>
          <Search
            placeholder={t("search")}
            allowClear
            enterButton
            className="my-1 my-md-2"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={RemainingsColumns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
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
          pageSizeOptions: ["25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="px-md-4">
              {record.autoCode && (
                <>
                  <span className=" lh-base">{t("code")}: </span>
                  <span className="fw-bold">{record.autoCode}</span>
                  <br />
                </>
              )}
              {record.madeIn && (
                <>
                  <span className=" lh-base">{t("madein")}: </span>
                  <span className="fw-bold">{record.madeIn}</span>
                  <br />
                </>
              )}
              <span className=" lh-base">{t("slitted_by")}: </span>
              <span className="fw-bold">{record.slittedBy}</span>
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
          columnWidth: 1,
        }}
        dataSource={remainingsData}
      />
      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        onHide={handleUpdateModalClose}
        size="xl"
        aria-labelledby="update-modal-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
        </Modal.Header>
        <UpdateRemainings
          initialValues={updateRecord}
          handleClose={handleUpdateModalClose}
          getRemainings={getRemainings}
        />
      </Modal>
      {/* SELL MODAL */}
      <Modal
        show={openSellModal}
        onHide={handleSellModalClose}
        fullscreen
        aria-labelledby="update-modal-title"
        centered
      >
        <Container
          className="pb-5 pb-md-0"
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title"> {t("update")} </Modal.Title>
          </Modal.Header>
          <SellRemainings
            selectedRows={selectedRows}
            handleClose={handleSellModalClose}
            getRemainings={getRemainings}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Remainings;
