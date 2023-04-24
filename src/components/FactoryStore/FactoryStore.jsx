import { Button, Table, Input, Space, Spin, Select, DatePicker } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { HTTP } from "../../HTTPS";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import SelectedForm from "./SelectedForm";
import NotSelectedForm from "./NotSelectedForm";
import EachTable from "./EachTable";
import UpdateProduct from "./UpdateProduct";
import { useAuth } from "../auth";
import Swal from "sweetalert2";
const { Search } = Input;

const FactoryStore = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showedQuality, setShowedQuality] = useState("1");
  const [productionData, setProductionData] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [sentData, setSentData] = useState([]);
  const [slimit, setSLimit] = useState(25);
  const [scount, setSCount] = useState(0);
  const [sentLength, setSentLength] = useState(0);
  const [scurrentPage, setSCurrentPage] = useState(1);
  const [ssearch, setSSearch] = useState("");
  const [sloading, setSLoading] = useState(false);

  const [openSendFormModal, setOpenSendFormModal] = useState(false);

  const quality = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
  ];

  const handleSendModalClose = () => {
    setShowedQuality(showedQuality);
    getAllDatas();
    setOpenSendFormModal(false);
  };

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});

  const handleUpdateModalClose = () => {
    setShowedQuality(showedQuality);
    getAllDatas([]);
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };
  const handleUpdateRecord = (record) => {
    setUpdateRecord(record);
    setOpenUpdateModal(true);
  };

  const handleAddSelectedRows = (id) => {
    var include = false;
    for (var i = 0; i < selectedProducts.length; i++) {
      if (selectedProducts[i] == id) {
        include = true;
      }
    }
    if (!include) {
      setSelectedProducts([...selectedProducts, id]);
    }
  };
  const handleRemoveSelectedRows = (id) => {
    var include = false;
    for (var i = 0; i < selectedProducts.length; i++) {
      if (selectedProducts[i] == id) {
        include = true;
      }
    }
    if (include) {
      for (var j = 0; j < selectedProducts.length; j++) {
        if (selectedProducts[j] == id) {
          selectedProducts.splice(j, 1);
        }
      }
    }
  };

  const productionsColumns = [
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "packetQnt",
      key: "packetQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
        </span>
      ),
    },
    {
      title: `${t("total_weight")}`,
      dataIndex: "packetWeight",
      key: "packetWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
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
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "standartPacketQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
        </span>
      ),
    },
    {
      title: `${t("s_packet_w")}`,
      dataIndex: "standartPacketWeight",
      key: "standartPacketWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];
  const sentColumns = [
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
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "qnt",
      key: "qnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
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
      title: `${t("sent_to")}`,
      dataIndex: "sentTo",
      key: "sentTo",
      width: 75,
    },
  ];
  const getAllDatas = async () => {
    setProductionData([]);
    setLoading(true);
    setSelectedProducts([]);
    await HTTP.get(
      `/production/grouped?_qlt=${showedQuality}&_date=${date}&_search=${search}`
    )
      .then((response) => {
        setProductionData(response.data);
        setLoading(false);
        setSelectedProducts([]);
      })
      .catch((error) => {
        setProductionData([]);
        setLoading(false);
        setSelectedProducts([]);
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
  const getSentDatas = async () => {
    setLoading(true);
    await HTTP.get(
      `/sent/all?_from=FactoryStore&_limit=${slimit}&_page=${scurrentPage}&_search=${ssearch}`
    )
      .then((response) => {
        setSLoading(false);
        setSCount(Math.ceil(response.data.count / slimit));
        setSentLength(response.data.count);
        setSentData(response.data.rows);
      })
      .catch((error) => {
        setSLoading(false);
        setSentData([]);
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

  useEffect(() => {
    getAllDatas();
    getSentDatas();
  }, [search, date, slimit, scurrentPage, ssearch, showedQuality]);

  return (
    <>
      <Row className="mt-5">
        <Col md={2}>
          <h4 className="mb-3">{t("factor_store")} </h4>
        </Col>
        <Col md={2}>
          <span>{t("quality")} </span>
          <Select
            value={showedQuality}
            options={quality}
            onChange={(e) => {
              setShowedQuality(e);
            }}
          />
        </Col>
        <Col md={2}>
          {role == "Admin" || role == "Accountant" || role == "Sliter" ? (
            <Button
              onClick={() => {
                setOpenSendFormModal(true);
              }}
              disabled={!productionData.length}
              type="primary"
              className="px-5 my-1 my-md-2"
              ghost
            >
              {t("send")}
            </Button>
          ) : (
            <></>
          )}
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
      {productionData.length ? (
        <Table
          columns={productionsColumns}
          defaultExpandAllRows={true}
          size="small"
          className="tbs bg"
          id="rollsTable"
          rowKey="id"
          pagination={false}
          loading={{
            indicator: (
              <Space size="middle">
                <Spin size="large" />
              </Space>
            ),
            spinning: loading,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <EachTable
                record={record}
                handleAddSelectedRows={handleAddSelectedRows}
                handleRemoveSelectedRows={handleRemoveSelectedRows}
                handleUpdateRecord={handleUpdateRecord}
              />
            ),
          }}
          dataSource={productionData}
        />
      ) : (
        <>
          <div className="text-center mt-5">
            <h3 className="mb-5">{t("empty_store_line", { showedQuality })}</h3>
            <hr />
          </div>
        </>
      )}
      {/* SENT TABLE */}
      <Row className="mt-5">
        <Col md={8}>
          <h4 className="mb-3">
            {t("sent_products")} ({sentLength})
          </h4>
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
        columns={sentColumns}
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
        expandedRowRender={(record) => (
          <>
            <div className="px-md-4">
              <span className=" lh-base">{t("driverName")}: </span>
              <span className="fw-bold">{record.driverName}</span>
              <br />
              <span className=" lh-base">{t("driverPhone")}: </span>
              <span className="fw-bold">{record.driverPhone}</span>
              <br />
              <span className=" lh-base">{t("car_no")}: </span>
              <span className="fw-bold">{record.carNo}</span>
              <br />
              <span className=" lh-base">{t("car_type")}: </span>
              <span className="fw-bold">{record.carType}</span>
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
            </div>
          </>
        )}
        dataSource={sentData}
      />
      {/* SEND MODAL */}
      <Modal
        show={openSendFormModal}
        onHide={handleSendModalClose}
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
            <Modal.Title id="update-modal-title">{t("send")}</Modal.Title>
          </Modal.Header>
          {selectedProducts.length ? (
            <SelectedForm
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              handleClose={handleSendModalClose}
              getAllDatas={getAllDatas}
              getSentDatas={getSentDatas}
            />
          ) : (
            <NotSelectedForm
              handleClose={handleSendModalClose}
              getAllDatas={getAllDatas}
              getSentDatas={getSentDatas}
            />
          )}
        </Container>
      </Modal>
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
            getAllDatas={getAllDatas}
          />
        </Container>
      </Modal>
    </>
  );
};

export default FactoryStore;
