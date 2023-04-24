import React, { useState, useEffect } from "react";
import { Button, DatePicker, Space, Spin, Table, Input } from "antd";
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";
import { IoIosCut } from "react-icons/io";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import SliterForm from "./SliterForm";
import { HTTP } from "../../HTTPS";
import moment from "moment/moment";
import UpdateSlitForm from "./UpdateSlitForm";
import { useTranslation } from "react-i18next";
import EachPiece from "./EachPiece";
import { useAuth } from "../auth";
const { Search } = Input;

const Sliters = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [rollData, setRollData] = useState([]);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [rollsLength, setRollsLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const [slittedsData, setSlittedsData] = useState([]);
  const [slimit, setSLimit] = useState(25);
  const [scount, setSCount] = useState(0);
  const [slittedLength, setSlittedLength] = useState(0);
  const [scurrentPage, setSCurrentPage] = useState(1);
  const [ssearch, setSSearch] = useState("");
  const [sloading, setSLoading] = useState(false);
  const [sdate, setSDate] = useState("");

  const [deletedSlittedsData, setDeletedSlittedsData] = useState([]);
  const [dslimit, setDSLimit] = useState(10);
  const [dscount, setDSCount] = useState(0);
  const [dslittedLength, setDSlittedLength] = useState(0);
  const [dscurrentPage, setDSCurrentPage] = useState(1);
  const [dsloading, setDSLoading] = useState(false);

  const [openSlitModal, setOpenSlitModal] = useState(false);
  const [slitRecord, setSlitRecord] = useState({});
  const handleSlitModalClose = () => {
    setSlitRecord([]);
    setOpenSlitModal(false);
  };

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [rollId, setRollId] = useState(null);
  const handleUpdateModalClose = () => {
    setRollId(null);
    setOpenUpdateModal(false);
  };

  const RollColumns = [
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
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "id",
      width: 50,
    },

    {
      title: `${t("net_weight")}`,
      dataIndex: "netWeight",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },

    {
      title: `${t("madein")}`,
      dataIndex: "madeIn",
      key: "id",
      width: 75,
      render: (record) => <span>{record}</span>,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
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
                  onClick={() => {
                    setSlitRecord(record);
                    setOpenSlitModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <IoIosCut />{" "}
                  <span className="d-none d-md-inline"> {t("slit")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];
  const slittedColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return scurrentPage === 1
          ? index + 1
          : (scurrentPage - 1) * slimit + (index + 1);
      },
    },
    { title: `${t("type")}`, dataIndex: "type", key: "type", width: 50 },
    {
      title: `${t("real_width")}`,
      dataIndex: "realWidth",
      key: "realWidth",
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
      dataIndex: "netWeight",
      key: "netWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("devided_into")}`,
      dataIndex: "dividedInto",
      key: "dividedInto",
      width: 75,
    },
    {
      title: `${t("remains")}`,
      dataIndex: "remaining",
      key: "remaining",
      width: 60,
      render: (record) => (
        <span>
          {record} {t("mm")}
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
    ...(role == "Admin" || role == "Accountant" || role == "Sliter"
      ? [
          {
            dataIndex: "",
            width: 65,
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
                    setRollId(record.rollId);
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
  const deletedSlittedColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return dscurrentPage === 1
          ? index + 1
          : (dscurrentPage - 1) * dslimit + (index + 1);
      },
    },
    { title: `${t("type")}`, dataIndex: "type", key: "type", width: 50 },
    {
      title: `${t("real_width")}`,
      dataIndex: "realWidth",
      key: "realWidth",
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
      title: `${t("devided_into")}`,
      dataIndex: "dividedInto",
      key: "dividedInto",
      width: 75,
    },
    {
      title: `${t("remains")}`,
      dataIndex: "remaining",
      key: "remaining",
      width: 60,
      render: (record) => (
        <span>
          {record} {t("mm")}
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
            width: 75,
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

  const getRollsData = async () => {
    setLoading(true);
    await HTTP.get(
      `/rolls/all?_limit=${limit}&_page=${currentPage}&_search=${search}&_date=${date}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setRollsLength(response.data.count);
        setRollData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setRollData([]);
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
  const getSlittedsData = async () => {
    setSLoading(true);
    await HTTP.get(
      `/slit/all?_limit=${slimit}&_page=${scurrentPage}&_search=${ssearch}&_date=${sdate}`
    )
      .then((response) => {
        setSLoading(false);
        setSCount(Math.ceil(response.data.count / slimit));
        setSlittedLength(response.data.count);
        setSlittedsData(response.data.rows);
      })
      .catch((error) => {
        setSLoading(false);
        setSlittedsData([]);
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
  const getDeletedSlittedsData = async () => {
    if (role == "Admin" || (role == "Accountant") | (role == "Watcher")) {
      setDSLoading(true);
      await HTTP.get(`/slit/deleted?_limit=${dslimit}&_page=${dscurrentPage}`)
        .then((response) => {
          setDSLoading(false);
          setDeletedSlittedsData(response.data.rows);
          setDSCount(Math.ceil(response.data.count / dslimit));
          setDSlittedLength(response.data.count);
        })
        .catch((error) => {
          setDSLoading(false);
          setDeletedSlittedsData([]);
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

  const handlePermanentlyDelete = (id) => {
    Swal.fire({
      title: `${t("on_delete_per")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await HTTP.delete(
          `/slit/deletepermanently/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            setLoading(false);
            getDeletedSlittedsData();
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
            getDeletedSlittedsData([]);
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Slitted not Found",
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
  const handleDelete = async (id) => {
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
        setLoading(true);
        await HTTP.post(`/slit/delete/${id}`, data)
          .then((response) => {
            getRollsData();
            getSlittedsData();
            getDeletedSlittedsData();
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
          });
      }
    });
  };

  useEffect(() => {
    getRollsData();
    getSlittedsData();
    getDeletedSlittedsData();
  }, [
    limit,
    currentPage,
    search,
    date,
    slimit,
    scurrentPage,
    ssearch,
    sdate,
    dslimit,
    dscurrentPage,
  ]);
  return (
    <>
      {/*ROLLS TABLE */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("current_rolls")} ({rollsLength})
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
        columns={RollColumns}
        size="small"
        className="tbs"
        id="rollsTable"
        tableLayout="fixed"
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
          pageSizeOptions: ["10", "25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="px-md-4">
              {record.code && (
                <>
                  <span className=" lh-base">{t("code")}: </span>
                  <span className="fw-bold">{record.code}</span>
                  <br />
                </>
              )}
              <span className=" lh-base">{t("added_by")}: </span>
              <span className="fw-bold">{record.addedBy}</span>
              <br />
              <span className=" lh-base">{t("gross_weight")}: </span>
              <span className="fw-bold">
                {record.grossWeight} {t("kg")}
              </span>
              <br />
              {record.length && (
                <>
                  <span className=" lh-base">{t("length")}: </span>
                  <span className="fw-bold">
                    {record.length} {t("mm")}
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
              {record.addedComment && (
                <>
                  <span className=" lh-base">{t("comment")}: </span>
                  <span className="fw-bold">{record.addedComment}</span>
                  <br />
                </>
              )}
              {record.roll_img && (
                <>
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}/pics/${record.roll_img}`}
                    className="img-fluid"
                    alt=""
                  />
                </>
              )}
            </div>
          ),
          columnWidth: 12,
        }}
        dataSource={rollData}
      />
      {/*Slitted ROLLS */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("current_slitteds")} ({slittedLength})
          </h4>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            className="my-1 my-md-2"
            onChange={(date, dateString) => {
              setSDate(dateString);
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
              setSSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={slittedColumns}
        size="small"
        className="tbs"
        id="rollsTable"
        tableLayout="fixed"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: sloading,
        }}
        pagination={{
          onChange: (current, size) => {
            setSLimit(size);
            setSCurrentPage(current);
          },
          total: Math.floor(scount * slimit),
          defaultPageSize: slimit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <Row>
                <Col md={3}>
                  {" "}
                  <div className="px-md-4">
                    {record.code && (
                      <>
                        <span className=" lh-base">{t("code")}: </span>
                        <span className="fw-bold">{record.code}</span>
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
                    {record.slittedComment && (
                      <>
                        <span className=" lh-base">{t("comment")}: </span>
                        <span className="fw-bold">{record.slittedComment}</span>
                        <br />
                      </>
                    )}
                  </div>
                </Col>
                <Col md={8} className="mt-3 p-0">
                  <EachPiece date={date} rollId={record.rollId} />
                </Col>
              </Row>
            </>
          ),
          columnWidth: 12,
        }}
        dataSource={slittedsData}
      />
      {/*DELETED Slitted */}
      {role == "Admin" || role == "Accountant" || role == "Watcher" ? (
        <>
          <h4 className="mb-3">
            {t("deleted_slitteds")} ({dslittedLength})
          </h4>
          <Table
            columns={deletedSlittedColumns}
            size="small"
            className="tbs"
            id="rollsTable"
            tableLayout="fixed"
            rowKey="id"
            loading={{
              indicator: (
                <Space size="middle">
                  <Spin size="large" />
                </Space>
              ),
              spinning: dsloading,
            }}
            pagination={{
              onChange: (current, size) => {
                setDSLimit(size);
                setDSCurrentPage(current);
              },
              total: Math.floor(dscount * dslimit),
              defaultPageSize: dslimit,
              showSizeChanger: true,
              pageSizeOptions: ["10", "25", "50"],
            }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <div className="px-md-4">
                    {record.code && (
                      <>
                        <span className=" lh-base">{t("code")}: </span>
                        <span className="fw-bold">{record.code}</span>
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
                    <span className=" lh-base">{t("deleted_by")}: </span>
                    <span className="fw-bold">{record.deletedBy}</span>
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
                    {record.deletedComment && (
                      <>
                        <span className=" lh-base">
                          {t("deleted_comment")}:{" "}
                        </span>
                        <span className="fw-bold">{record.deletedComment}</span>
                        <br />
                      </>
                    )}
                  </div>
                </>
              ),
              columnWidth: 12,
            }}
            dataSource={deletedSlittedsData}
          />
        </>
      ) : (
        <></>
      )}

      {/* SLITTER MODAL */}
      <Modal
        show={openSlitModal}
        onHide={handleSlitModalClose}
        fullscreen
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("slit")}</Modal.Title>
          </Modal.Header>
          <SliterForm
            rollValues={slitRecord}
            handleClose={handleSlitModalClose}
            getRollsData={getRollsData}
            getSlittedsData={getSlittedsData}
            getDeletedSlittedsData={getDeletedSlittedsData}
          />
        </Container>
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        onHide={handleUpdateModalClose}
        fullscreen
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
          </Modal.Header>
          <UpdateSlitForm
            rollId={rollId}
            handleClose={handleUpdateModalClose}
            getSlittedsData={getSlittedsData}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Sliters;
