import { Button, DatePicker, Input, Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";
import { AiTwotoneDelete } from "react-icons/ai";
const { Search } = Input;

const Activity = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [activityData, setActivityData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const activityColumns = [
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
      title: `${t("name")}`,
      dataIndex: "username",
      key: "username",
      width: 50,
    },
    {
      title: `${t("activity")}`,
      dataIndex: "activity",
      key: "activity",
      width: 250,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createdAt",
      key: "id",
      width: 100,
      render: (record) => <span>{moment(record).format("Y.MM.DD HH:mm")}</span>,
    },
    ...(role == "Admin"
      ? [
          {
            dataIndex: "",
            width: 10,
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
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  const getActivity = async () => {
    setLoading(true);
    await HTTP.get(
      `/activity/all?_limit=${limit}&_page=${currentPage}&_search=${search}&_date=${date}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setActivityData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setActivityData([]);
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
        await HTTP.delete(`/activity/delete/${id}`)
          .then((response) => {
            getActivity();
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
  const handleDeleteSelected = async () => {
    Swal.fire({
      title: `${t("on_delete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("delete")}`,
      confirmButtonColor: "red",
      cancelButtonText: `${t("cancel")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await HTTP.delete(`/activity/deletemany?_ids=${selectedRows}`)
          .then((response) => {
            getActivity();
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
    getActivity();
  }, [currentPage, search, date]);

  return (
    <>
      <Row>
        <Col md={4}>
          <h4 className="mb-3">{t("activity")}</h4>
        </Col>
        <Col md={2}>
          <Button
            onClick={() => {
              handleDeleteSelected();
            }}
            disabled={!selectedRows.length}
            type="primary"
            className="my-1 my-md-2"
            ghost
          >
            {t("delete")}
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
        columns={activityColumns}
        size="small"
        className="tbs"
        rowKey="id"
        rowSelection={{
          type: "checkbox",
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
        dataSource={activityData}
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
      />
    </>
  );
};

export default Activity;
