import { DatePicker, Input, Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const { Search } = Input;

const SelledRemainings = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [wastings, setWastings] = useState([]);
  const [wastingsLength, setWastingsLength] = useState(0);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const wastingsColumns = [
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
      title: `${t("sell_to")}`,
      dataIndex: "sellTo",
      key: "sellTo",
      width: 100,
    },
    {
      title: `${t("sell_by")}`,
      dataIndex: "sellBy",
      key: "sellBy",
      width: 35,
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "weight",
      width: 35,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("comment")}`,
      dataIndex: "sellComment",
      key: "sellComment",
      width: 35,
    },
    {
      title: `${t("date")}`,
      dataIndex: "createAt",
      key: "createAt",
      width: 75,
      render: (record) => <span>{moment(record).format("Y-MM-DD HH:mm")}</span>,
    },
  ];

  const getSentDatas = async () => {
    setLoading(true);
    await HTTP.get(
      `/remainings/selled?_limit=${limit}&_page=${currentPage}&_search=${search}&_date=${date}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setWastingsLength(response.data.count);
        setWastings(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setWastings([]);
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
    getSentDatas();
  }, [search, date, limit]);
  return (
    <>
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("selled_remainings")} ({wastingsLength})
          </h4>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            style={{ margin: " 10px 0 10px" }}
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
            style={{ margin: " 10px 0 10px" }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={wastingsColumns}
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
        dataSource={wastings}
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

export default SelledRemainings;
