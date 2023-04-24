import { Button, DatePicker, Input, Space, Spin, Table } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { AiFillUnlock, AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import UpdateSpare from "./UpdateSpare";
import moment from "moment/moment";
import UseSpare from "./UseSpare";
import UpdateUsed from "./UpdateUsed";
import CreateSpareList from "./CreateSpareList";
import UpdateSpareList from "./UpdateSpareList";
import AddSpare from "./AddSpare";
const { Search } = Input;

const Spare = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");

  const [listData, setListData] = useState([]);
  const [listLength, setListLength] = useState(0);
  const [lsearch, setLSearch] = useState("");
  const [lloading, setLLoading] = useState(false);
  const [llimit, setLLimit] = useState(10);
  const [lcount, setLCount] = useState(0);
  const [lcurrentPage, setLCurrentPage] = useState(1);

  const [spareData, setSpareData] = useState([]);
  const [spareLength, setSpareLength] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [usedData, setUsedData] = useState([]);
  const [usedLength, setUsedLength] = useState(0);
  const [uloading, setULoading] = useState(false);
  const [usearch, setUSearch] = useState("");
  const [udate, setUDate] = useState("");
  const [ulimit, setULimit] = useState(10);
  const [ucount, setUCount] = useState(0);
  const [ucurrentPage, setUCurrentPage] = useState(1);

  const [openUpdateListModal, setOpenUpdateListModal] = useState(false);
  const [updateListRecord, setUpdateListRecord] = useState({});
  const handleUpdateListModalClose = () => {
    setUpdateListRecord([]);
    setOpenUpdateListModal(false);
  };

  const [openAddSpareModal, setOpenAddSpareModal] = useState(false);
  const [addListRecord, setAddListRecord] = useState({});
  const handleAddSpareModalClose = () => {
    setAddListRecord([]);
    setOpenAddSpareModal(false);
  };

  const [openUpdateSpareModal, setOpenUpdateSpareModal] = useState(false);
  const [updateSpareRecord, setUpdateSpareRecord] = useState({});
  const handleUpdateSpareModalClose = () => {
    setUpdateSpareRecord([]);
    setOpenUpdateSpareModal(false);
  };

  const [openUseFormModal, setOpenUseFormModal] = useState(false);
  const [useSpareRecord, setUseSpareRecord] = useState({});
  const handleSendModalClose = () => {
    setUseSpareRecord([]);
    setOpenUseFormModal(false);
  };

  const [openUpdateUsedModal, setOpenUpdateUsedModal] = useState(false);
  const [updateUsedRecord, setUpdateUsedRecord] = useState({});
  const handleUpdateUsedModalClose = () => {
    setUseSpareRecord([]);
    setOpenUpdateUsedModal(false);
  };

  const listColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("name")}`,
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 100,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Store"
      ? [
          {
            dataIndex: "",
            width: 50,
            fixed: "right",
            key: "id",
            render: (record) => (
              <>
                <Button
                  size="small"
                  onClick={() => handleDeleteList(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setUpdateListRecord(record);
                    setOpenUpdateListModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <AiTwotoneEdit />{" "}
                  <span className="d-none d-md-inline"> {t("edit")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setAddListRecord(record);
                    setOpenAddSpareModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <MdAdd />{" "}
                  <span className="d-none d-md-inline"> {t("add_spare")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];
  const spareColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "qnt",
      key: "qnt",
      width: 35,
    },
    {
      title: `${t("comment")}`,
      dataIndex: "comment",
      key: "comment",
      width: 75,
      render: (record) => <span>{record || "-"}</span>,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Store"
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
                  onClick={() => handleDeleteSpare(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setUpdateSpareRecord(record);
                    setOpenUpdateSpareModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <AiTwotoneEdit />{" "}
                  <span className="d-none d-md-inline"> {t("edit")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setUseSpareRecord(record);
                    setOpenUseFormModal(true);
                  }}
                  type="primary"
                  ghost
                >
                  <AiFillUnlock />{" "}
                  <span className="d-none d-md-inline"> {t("use")}</span>
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];
  const usedColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("name")}`,
      dataIndex: "usedName",
      key: "usedName",
      width: 75,
    },
    {
      title: `${t("usedBy")}`,
      dataIndex: "usedBy",
      key: "usedBy",
      width: 75,
    },
    {
      title: `${t("gaveTo")}`,
      dataIndex: "gaveTo",
      key: "gaveTo",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "usedQnt",
      key: "usedQnt",
      width: 35,
    },
    {
      title: `${t("comment")}`,
      dataIndex: "comment",
      key: "comment",
      width: 75,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 75,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin" || role == "Accountant" || role == "Store"
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
                  onClick={() => handleDeleteUsed(record.id)}
                  className="my-1"
                  danger
                >
                  <AiTwotoneDelete />{" "}
                  <span className="d-none d-md-inline"> {t("delete")}</span>
                </Button>{" "}
                <Button
                  size="small"
                  onClick={() => {
                    setUpdateUsedRecord(record);
                    setOpenUpdateUsedModal(true);
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

  const getLists = async () => {
    setLLoading(true);
    await HTTP.get(
      `/spare/alllist?_search=${lsearch}&_limit=${llimit}&_page=${lcurrentPage}`
    )
      .then((response) => {
        setLLoading(false);
        setLCount(Math.ceil(response.data.count / 50));
        setListLength(response.data.count);
        setListData(response.data.rows);
      })
      .catch((error) => {
        setLLoading(false);
        setListData([]);
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
      `/spare/all?_search=${search}&_date=${date}&_limit=${limit}&_page=${currentPage}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setSpareLength(response.data.count);
        setSpareData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setSpareData([]);
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
  const getUsedData = async () => {
    setULoading(true);
    await HTTP.get(
      `/spare/usedspares?_search=${usearch}&_date=${udate}&_limit=${ulimit}&_page=${ucurrentPage}`
    )
      .then((response) => {
        setULoading(false);
        setUCount(Math.ceil(response.data.count / ulimit));
        setUsedLength(response.data.count);
        setUsedData(response.data.rows);
      })
      .catch((error) => {
        setULoading(false);
        setUsedData([]);
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

  const handleDeleteList = async (id) => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLLoading(true);
        await HTTP.delete(
          `/spare/deletelist/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            getLists();
            setLLoading(false);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${t("deleted")}`,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            setLLoading(false);
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
          });
      }
    });
  };
  const handleDeleteSpare = async (id) => {
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
          `/spare/delete/${id}?_deletedBy=${localStorage.getItem("username")}`
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
          });
      }
    });
  };
  const handleDeleteUsed = async (id) => {
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
          `/spare/deleteused/${id}?_deletedBy=${localStorage.getItem(
            "username"
          )}`
        )
          .then((response) => {
            getData();
            getUsedData();
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
          });
      }
    });
  };

  useEffect(() => {
    getLists();
    getData();
    getUsedData();
  }, [
    search,
    lsearch,
    limit,
    llimit,
    currentPage,
    lcurrentPage,
    usearch,
    ulimit,
    ucurrentPage,
    date,
    udate,
  ]);
  return (
    <>
      {/* CREATE SPARE LIST */}
      {role == "Admin" || role == "Accountant" || role == "Store" ? (
        <CreateSpareList getLists={getLists} />
      ) : (
        <></>
      )}
      {/* ALL SPARE LISTS */}
      <Row>
        <Col md={8}>
          <h4 className="mb-3">
            {t("spare_lists")} ({listLength})
          </h4>
        </Col>
        <Col md={4}>
          <Search
            placeholder={t("search")}
            allowClear
            enterButton
            className="my-1 my-md-2"
            onChange={(e) => {
              setLSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={listColumn}
        size="small"
        className="tbs"
        id="rollsTable"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: lloading,
        }}
        pagination={{
          onChange: (current, size) => {
            setLLimit(size);
            setLCurrentPage(current);
          },
          total: Math.floor(lcount * llimit),
          defaultPageSize: llimit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50"],
        }}
        dataSource={listData}
      />

      {/* ALL SPARES */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("spare_parts")} ({spareLength})
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
        columns={spareColumn}
        size="small"
        className="tbs"
        id="rollsTable"
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
          pageSizeOptions: ["10", "25", "50"],
        }}
        dataSource={spareData}
      />

      {/* USEDS */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("used_spares")} ({usedLength})
          </h4>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            className="my-1 my-md-2"
            onChange={(date, dateString) => {
              setUDate(dateString);
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
              setUSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={usedColumn}
        size="small"
        className="tbs"
        id="rollsTable"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: uloading,
        }}
        pagination={{
          onChange: (current, size) => {
            setULimit(size);
            setUCurrentPage(current);
          },
          total: Math.floor(ucount * ulimit),
          defaultPageSize: ulimit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50"],
        }}
        dataSource={usedData}
      />

      {/* UPDATE LIST*/}
      <Modal
        show={openUpdateListModal}
        onHide={handleUpdateListModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
          </Modal.Header>
          <UpdateSpareList
            initialValues={updateListRecord}
            handleClose={handleUpdateListModalClose}
            getLists={getLists}
          />
        </Container>
      </Modal>
      {/* ADD SPARE*/}
      <Modal
        show={openAddSpareModal}
        onHide={handleAddSpareModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("add_spare")}</Modal.Title>
          </Modal.Header>
          <AddSpare
            list={addListRecord}
            lists={listData}
            handleClose={handleAddSpareModalClose}
            getData={getData}
          />
        </Container>
      </Modal>
      {/* UPDATE SPARE*/}
      <Modal
        show={openUpdateSpareModal}
        onHide={handleUpdateSpareModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
          </Modal.Header>
          <UpdateSpare
            initialValues={updateSpareRecord}
            handleClose={handleUpdateSpareModalClose}
            getData={getData}
            lists={listData}
          />
        </Container>
      </Modal>

      {/* USE */}
      <Modal
        show={openUseFormModal}
        onHide={handleSendModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">{t("use")}</Modal.Title>
          </Modal.Header>
          <UseSpare
            handleClose={handleSendModalClose}
            getData={getData}
            getUsedData={getUsedData}
            spare={useSpareRecord}
          />
        </Container>
      </Modal>
      {/* UPDATE USED*/}
      <Modal
        show={openUpdateUsedModal}
        onHide={handleUpdateUsedModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">
              {t("update_used")}
            </Modal.Title>
          </Modal.Header>
          <UpdateUsed
            initialValues={updateUsedRecord}
            handleClose={handleUpdateUsedModalClose}
            getData={getData}
            getUsedData={getUsedData}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Spare;
