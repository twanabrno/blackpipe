import { Button, Space, Spin, Table, Input } from "antd";
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import React, { useEffect } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import ResetPassword from "./ResetPassword";
const { Search } = Input;

const Users = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [userData, setUserData] = useState([]);
  const [userLength, setUserLength] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});

  const handleUpdateModalClose = () => {
    setUpdateRecord([]);
    setOpenUpdateModal(false);
  };

  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetRecord, setResetRecord] = useState({});

  const handleResetModalClose = () => {
    setResetRecord([]);
    setOpenResetModal(false);
  };

  const usersColumn = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("role")}`,
      dataIndex: "role",
      key: "role",
      width: 75,
    },
    {
      title: `${t("username")}`,
      dataIndex: "username",
      key: "name",
      width: 75,
    },
    {
      title: `${t("phone")}`,
      dataIndex: "phone",
      key: "phone",
      width: 75,
    },
    {
      dataIndex: "",
      width: 100,
      fixed: "right",
      key: "id",
      render: (record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setResetRecord(record.id);
              setOpenResetModal(true);
            }}
            type="primary"
            ghost
            className={`my-1`}
          >
            <BiReset />{" "}
            <span className="d-none d-md-inline"> {t("password")}</span>
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
          </Button>{" "}
          <Button
            size="small"
            onClick={() => {
              handleDelete(record.id);
            }}
            danger
            className={`my-1 ${record.role == "Admin" ? "d-none" : ""}`}
          >
            <AiTwotoneDelete />{" "}
            <span className="d-none d-md-inline"> {t("delete")}</span>
          </Button>{" "}
        </>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    await HTTP.get(`/users/all?_search=${search}`)
      .then((response) => {
        setLoading(false);
        setUserLength(response.data.count);
        setUserData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setUserData([]);
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
        await HTTP.delete(`/users/delete/${id}`)
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
            if (error.response.status == 401) {
              auth.logout();
            } else if (error.response.status === 404) {
              Swal.fire({
                position: "top-end",
                icon: "info",
                title: "User not Found",
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
  }, [search]);

  return (
    <>
      <AddUser getData={getData} />
      <Row>
        <Col md={8}>
          <h4 className="mb-3">
            {t("users")} ({userLength})
          </h4>
        </Col>
        <Col md={4}>
          <Search
            placeholder={t("search")}
            allowClear
            enterButton
            style={{ margin: " 10px 0 10px" }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={usersColumn}
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
        pagination={false}
        dataSource={userData}
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
          <UpdateUser
            initialValues={updateRecord}
            handleClose={handleUpdateModalClose}
            getData={getData}
          />
        </Container>
      </Modal>
      {/* RESET PASSWORD */}
      <Modal
        show={openResetModal}
        onHide={handleResetModalClose}
        size="lg"
        aria-labelledby="update-modal-title"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="update-modal-title">
              {t("reset_password")}
            </Modal.Title>
          </Modal.Header>
          <ResetPassword
            handleClose={handleResetModalClose}
            getData={getData}
            id={resetRecord}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Users;
