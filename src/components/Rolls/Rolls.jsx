import React, { useState } from "react";
import { Button, Table, DatePicker, Space, Spin, Input, Badge } from "antd";
import UpdateRollForm from "./UpdateRollForm";
import AddRollForm from "./AddRollForm";
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useEffect } from "react";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";

const { Search } = Input;

const Rolls = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [rollData, setRollData] = useState([]);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rollsLength, setRollsLength] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const [deletedRollData, setDeletedRollData] = useState([]);
  const [dlimit, setDLimit] = useState(10);
  const [dcount, setDCount] = useState(0);
  const [drollsLength, setDRollsLength] = useState(0);
  const [dcurrentPage, setDCurrentPage] = useState(1);
  const [dloading, setDLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});

  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
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
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {moment().format("Y-MM-DD") ==
          moment(record.createdAt).format("Y-MM-DD") ? (
            <Badge className="mx-1 badge-today" color="green" />
          ) : (
            ""
          )}
          {record.thikness} {t("mm")}
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
      title: `${t("rollQuality")}`,
      dataIndex: "rollQuality",
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
    ...(role == "Admin" || role == "Accountant" || role == "Enter"
      ? [
          {
            dataIndex: "",
            width: 70,
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
  const deletedRowsColumns = [
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
      width: 75,
    },
    {
      title: `${t("rollQuality")}`,
      dataIndex: "rollQuality",
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
                  onClick={() => handlePermanentlyDelete(record.id)}
                  size="small"
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

  const getData = async () => {
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
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  const getDeletedData = async () => {
    if (role == "Admin" || (role == "Accountant") | (role == "Watcher")) {
      setDLoading(true);
      await HTTP.get(`/rolls/deleted?_limit=${dlimit}&_page=${currentPage}`)
        .then((response) => {
          setDLoading(false);
          setDCount(Math.ceil(response.data.count / dlimit));
          setDRollsLength(response.data.count);
          setDeletedRollData(response.data.rows);
        })
        .catch((error) => {
          setDLoading(false);
          setRollData([]);
          if (error.response.status == 401) {
            auth.logout();
          } else if (error.response.status === 404) {
            alert("Data not found");
          } else alert("Somthing is wrong, Please try again later");
        });
    }
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
      if (result.isConfirmed) {
        setLoading(true);
        const data = {
          deletedBy: localStorage.getItem("username"),
          deletedComment: result.value,
        };
        await HTTP.post(`/rolls/delete/${id}`, data)
          .then((response) => {
            setLoading(false);
            getData();
            getDeletedData();
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
  const handlePermanentlyDelete = async (id) => {
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
          `/rolls/deletepermanently/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            setLoading(false);
            getData();
            getDeletedData();
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
            setDeletedRollData([]);
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Deleted Roll not Found",
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
    getData();
    getDeletedData();
  }, [limit, currentPage, search, date, dlimit, dcurrentPage]);

  return (
    <>
      {/* ADD ROLL FORM */}
      {role == "Admin" || role == "Accountant" || role == "Enter" ? (
        <AddRollForm getData={getData} />
      ) : (
        <></>
      )}

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
          showSizeChanger: true,
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
      {/*DELETED ROLLS */}
      {role == "Admin" || role == "Accountant" || role == "Watcher" ? (
        <>
          <h4 className="mb-3">
            {t("deleted_rolls")} ({drollsLength})
          </h4>
          <Table
            columns={deletedRowsColumns}
            id="deletedRollsTable"
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
                    <span className=" lh-base">{t("deleted_by")}: </span>
                    <span className="fw-bold">{record.deletedBy}</span>
                    <br />
                    <span className=" lh-base">{t("gross_weight")}: </span>
                    <span className="fw-bold">
                      {record.grossWeight} {t("kg")}
                    </span>
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
                    <span className=" lh-base">{t("deleted_date")}: </span>
                    <span className="fw-bold">
                      {moment(record.deletedDate).format("Y.MM.DD")}
                    </span>
                    <br />
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
                </>
              ),
              columnWidth: 12,
            }}
            dataSource={deletedRollData}
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
            <Modal.Title id="update-modal-title"> {t("update")} </Modal.Title>
          </Modal.Header>
          <UpdateRollForm
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getData={getData}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Rolls;
