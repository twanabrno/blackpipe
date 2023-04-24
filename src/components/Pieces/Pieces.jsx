import React, { useEffect, useState } from "react";
import { Button, Space, Spin, Table, Input, DatePicker } from "antd";
import AddPieceForm from "./AddPieceForm";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import UpdatePieceForm from "./UpdatePieceForm";
import { HTTP } from "../../HTTPS";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
const { Search } = Input;

const Pieces = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [piecesData, setPiecesData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState(0);
  const [piecesLength, setPiecesLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [widthSearch, setWidthSearch] = useState("");
  const [thiknessSearch, setThiknessSearch] = useState("");
  const [code, setCode] = useState("");

  const [dpiecesData, setDPiecesData] = useState([]);
  const [dlimit, setDLimit] = useState(10);
  const [dcount, setDCount] = useState(0);
  const [dpiecesLength, setDPiecesLength] = useState(0);
  const [dcurrentPage, setDCurrentPage] = useState(1);
  const [dpsearch, setDPSearch] = useState("");
  const [dloading, setDLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});
  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
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
      width: 50,
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
            width: 75,
            fixed: "right",
            key: "x",
            render: (record) => (
              <>
                <Button
                  size="small"
                  disabled={record.rollId}
                  onClick={() => handleDelete(record.id)}
                  className="my-1"
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
  const DeletedPiecesColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => {
        return dcurrentPage === 1
          ? index + 1
          : (dcurrentPage - 1) * dlimit + (index + 1);
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
      key: "thikness",
      width: 75,
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
    { title: `${t("type")}`, dataIndex: "type", key: "type", width: 50 },
    {
      title: `${t("code")}`,
      dataIndex: "autoCode",
      key: "autoCode",
      width: 85,
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
            width: 65,
            fixed: "right",
            key: "x",
            render: (record) => (
              <>
                <Button
                  size="small"
                  disabled={record.rollId}
                  onClick={() => handlePermanentlyDelete(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> Delete</span>
                </Button>{" "}
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
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  const getDeletedPieces = async () => {

    if (role == "Admin" || (role == "Accountant") | (role == "Watcher")) {
      setDLoading(true);
      await HTTP.get(
        `/pieces/deleted?_search=${dpsearch}&_limit=${dlimit}&_page=${dcurrentPage}`
      )
        .then((response) => {
          setDLoading(false);
          setDCount(Math.ceil(response.data.count / dlimit));
          setDPiecesLength(response.data.count);
          setDPiecesData(response.data.rows);
        })
        .catch((error) => {
          setDLoading(false);
          setDPiecesData([]);
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
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
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
      if (result.isConfirmed) {
        setLoading(true);
        const data = {
          deletedBy: localStorage.getItem("username"),
          deletedComment: result.value,
        };
        await HTTP.post(`/pieces/delete/${id}`, data)
          .then((response) => {
            setLoading(false);
            getPieces();
            getDeletedPieces();
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
            setPiecesData([]);
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
        setLoading(true);
        await HTTP.delete(
          `/pieces/deletepermanently/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            setLoading(false);
            getPieces();
            getDeletedPieces();
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
            setDPiecesData([]);
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

  useEffect(() => {
    getPieces();
    getDeletedPieces();
  }, [
    limit,
    currentPage,
    date,
    dlimit,
    dcurrentPage,
    widthSearch,
    thiknessSearch,
    code,
    dpsearch,
  ]);
  return (
    <>
      {/* ADD PIECE */}
      {role == "Admin" || role == "Accountant" || role == "Sliter" ? (
        <AddPieceForm getPieces={getPieces} />
      ) : (
        <></>
      )}

      {/*Pieces TABLE */}
      <Row>
        <Col md={4}>
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
            <>
              <div className="px-md-4">
                <span className=" lh-base">{t("roll_code")}: </span>
                <span className="fw-bold">{record.rollCode}</span>
                <br />
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
                  <div>
                    <span className=" lh-base">{t("comment")}: </span>
                    <span className="fw-bold">{record.pieceComment}</span>
                    <br />
                  </div>
                )}
              </div>
            </>
          ),
          columnWidth: 12,
        }}
        dataSource={piecesData}
      />

      {/*Deleted Pieces TABLE */}
      {role == "Admin" || role == "Accountant" || role == "Watcher" ? (
        <>
          <Row>
            <Col md={8}>
              <h4 className="mb-3">
                {t("deleted_pieces")} ({dpiecesLength}){" "}
              </h4>
            </Col>
            <Col md={4}>
              <Search
                placeholder={t("code")}
                allowClear
                className="my-1 my-md-2"
                onChange={(e) => {
                  setDPSearch(e.target.value);
                }}
              />
            </Col>
          </Row>
          <Table
            columns={DeletedPiecesColumns}
            size="small"
            className="tbs"
            tableLayout="fixed"
            rowKey="id"
            loading={{
              indicator: (
                <Space size="middle">
                  <Spin size="large" />
                </Space>
              ),
              spinning: dloading,
            }}
            pagination={{
              onChange: (current, size) => {
                setDLimit(size);
                setDCurrentPage(current);
              },
              total: Math.floor(dcount * dlimit),
              defaultPageSize: dlimit,
              showSizeChanger: true,
              pageSizeOptions: ["10", "25", "50", "100"],
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div className="px-md-4">
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
            dataSource={dpiecesData}
          />
        </>
      ) : (
        <></>
      )}

      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        onHide={handleUpdateModalClose}
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
            <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
          </Modal.Header>
          <UpdatePieceForm
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getPieces={getPieces}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Pieces;
