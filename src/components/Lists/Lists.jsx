import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { HTTP } from "../../HTTPS";
import { Button, Space, Spin, Table, Input } from "antd";
import Swal from "sweetalert2";
import AddList from "./AddList";
import UpdateList from "./UpdateList";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
const { Search } = Input;

const Lists = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [listData, setListData] = useState([]);
  const [listLength, setListLength] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});

  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };

  const listColumn = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "standartPacketQnt",
      width: 75,
    },
    {
      title: `${t("s_packet_w")}`,
      dataIndex: "standartPacketWeight",
      key: "standartPacketWeight",
      width: 75,
    },
    {
      title: `${t("s_piece_w")}`,
      dataIndex: "standartPieceWeight",
      key: "standartPieceWeight",
      width: 75,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 50,
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

  const getData = async () => {
    setLoading(true);
    await HTTP.get(
      `/productionlist/all?_search=${search}&_createdBy=${localStorage.getItem(
        "username"
      )}`
    )
      .then((response) => {
        setLoading(false);
        setListLength(response.data.count);
        setListData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
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
          `/productionlist/delete/${id}?_deletedBy=${localStorage.getItem(
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
            if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "List not Found",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
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
            }
          });
      }
    });
  };
  useEffect(() => {
    getData();
  }, [search]);
  return (
    <>
      {/* ADD LIST */}
      {role == "Admin" || role == "Accountant" ? (
        <AddList getData={getData} />
      ) : (
        <></>
      )}

      {/* CURRENT LIST */}
      <Row>
        <Col md={8}>
          <h4 className="mb-3">
            {t("current_lists")} ({listLength})
          </h4>
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
          spinning: loading,
        }}
        pagination={false}
        dataSource={listData}
      />
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
            <Modal.Title id="update-modal-title">{t("update")}</Modal.Title>
          </Modal.Header>
          <UpdateList
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getData={getData}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Lists;
