import { DatePicker, Space, Spin, Table, Input } from "antd";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import { HTTP } from "../../HTTPS";
import Swal from "sweetalert2";

const { Search } = Input;

const SelledBlackpipe = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [selledB, setSelledB] = useState([]);
  const [selledBLength, setSelledBLength] = useState(0);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const selledBColumns = [
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
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "qnt",
      key: "qnt",
      width: 35,
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
      width: 35,
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
      `/sent/all?_limit=${limit}&_page=${currentPage}&_from=BlackPipe&_search=${search}&_date=${date}&_selled=${1}`
    )
      .then((response) => {
        setLoading(false);
        setCount(Math.ceil(response.data.count / limit));
        setSelledBLength(response.data.count);
        setSelledB(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setSelledB([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response && error.response.status === 404) {
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
      {/*ROLLS TABLE */}
      <Row>
        <Col md={6}>
          <h4 className="mb-3">
            {t("sold_blackpipe")} ({selledBLength})
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
        columns={selledBColumns}
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
        dataSource={selledB}
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

export default SelledBlackpipe;
